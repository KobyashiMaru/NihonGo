// Main-thread side of the in-browser Whisper recognizer: owns the worker, exposes the
// model download state to React, and prepares recorded audio for the model.
import { useSyncExternalStore } from 'react';

export interface LocalModelStatus {
  state: 'idle' | 'loading' | 'ready' | 'error';
  progress: number; // 0-100 while downloading
  error?: string;
}

type WorkerMessage =
  | { type: 'progress'; progress: number }
  | { type: 'ready' }
  | { type: 'result'; id: number; text: string }
  | { type: 'error'; id?: number; message: string };

// Whisper expects 16 kHz mono samples
const WHISPER_SAMPLE_RATE = 16000;

class LocalSpeechRecognizer {
  private worker: Worker | null = null;
  private status: LocalModelStatus = { state: 'idle', progress: 0 };
  private listeners = new Set<() => void>();
  private loadWaiters: { resolve: () => void; reject: (err: Error) => void }[] = [];
  private pending = new Map<number, { resolve: (text: string) => void; reject: (err: Error) => void }>();
  private nextId = 1;

  isSupported(): boolean {
    return (
      typeof Worker !== 'undefined' &&
      typeof WebAssembly !== 'undefined' &&
      typeof MediaRecorder !== 'undefined' &&
      Boolean(navigator.mediaDevices?.getUserMedia)
    );
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getStatus = () => this.status;

  private setStatus(status: LocalModelStatus) {
    this.status = status;
    this.listeners.forEach(listener => listener());
  }

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL('./whisper.worker.ts', import.meta.url), { type: 'module' });
      this.worker.onmessage = (event: MessageEvent<WorkerMessage>) => this.handleMessage(event.data);
      this.worker.onerror = (event) => this.failAll(event.message || '語音模型無法啟動');
    }
    return this.worker;
  }

  private handleMessage(msg: WorkerMessage) {
    switch (msg.type) {
      case 'progress':
        if (this.status.state === 'loading') {
          this.setStatus({ state: 'loading', progress: Math.round(msg.progress) });
        }
        break;
      case 'ready':
        if (this.status.state !== 'ready') {
          this.setStatus({ state: 'ready', progress: 100 });
          this.loadWaiters.splice(0).forEach(waiter => waiter.resolve());
        }
        break;
      case 'result':
        this.pending.get(msg.id)?.resolve(msg.text);
        this.pending.delete(msg.id);
        break;
      case 'error':
        if (this.status.state === 'ready' && msg.id !== undefined) {
          // The model works; only this one transcription failed
          this.pending.get(msg.id)?.reject(new Error(msg.message));
          this.pending.delete(msg.id);
        } else {
          this.failAll(msg.message);
        }
        break;
    }
  }

  private failAll(message: string) {
    const err = new Error(message);
    // Start from a fresh worker on the next attempt
    this.worker?.terminate();
    this.worker = null;
    this.setStatus({ state: 'error', progress: 0, error: message });
    this.loadWaiters.splice(0).forEach(waiter => waiter.reject(err));
    this.pending.forEach(p => p.reject(err));
    this.pending.clear();
  }

  // Download (first time only, then browser-cached) and initialise the model.
  // Safe to call repeatedly; a failed download is retried on the next call.
  load(): Promise<void> {
    if (this.status.state === 'ready') return Promise.resolve();
    const loaded = new Promise<void>((resolve, reject) => this.loadWaiters.push({ resolve, reject }));
    if (this.status.state !== 'loading') {
      this.setStatus({ state: 'loading', progress: 0 });
      this.getWorker().postMessage({ type: 'load' });
    }
    return loaded;
  }

  async transcribe(audio: Float32Array): Promise<string> {
    await this.load();
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.getWorker().postMessage({ type: 'transcribe', id, audio }, [audio.buffer]);
    });
  }
}

export const localRecognizer = new LocalSpeechRecognizer();

// React hook: re-renders when the model download state changes
export const useLocalModelStatus = () =>
  useSyncExternalStore(localRecognizer.subscribe, localRecognizer.getStatus);

// Status line for the UI while the model is loading or after it failed, otherwise null
export const describeModelStatus = (status: LocalModelStatus): string | null => {
  if (status.state === 'loading') {
    return `正在載入離線日語語音模型 ${status.progress}%（第一次需下載約 80MB，之後會存在瀏覽器快取）`;
  }
  if (status.state === 'error') {
    return `離線語音模型載入失敗（${status.error}），請檢查網路後再按一次麥克風重試。`;
  }
  return null;
};

// Decode a recorded clip and resample it to the 16 kHz mono samples Whisper expects
export const decodeRecording = async (blob: Blob): Promise<Float32Array> => {
  const ctx = new AudioContext();
  try {
    const decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
    const length = Math.max(1, Math.ceil(decoded.duration * WHISPER_SAMPLE_RATE));
    const offline = new OfflineAudioContext(1, length, WHISPER_SAMPLE_RATE);
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination); // multi-channel input is down-mixed to mono
    source.start();
    const rendered = await offline.startRendering();
    // Copy so the buffer can be transferred to the worker
    return new Float32Array(rendered.getChannelData(0));
  } finally {
    ctx.close();
  }
};

// Whisper tends to "hear" stock phrases (e.g. ご視聴ありがとうございました) in silence,
// so skip clips that are too short or never get louder than background noise
export const containsSpeech = (samples: Float32Array): boolean => {
  if (samples.length < WHISPER_SAMPLE_RATE * 0.3) return false;
  const windowSize = WHISPER_SAMPLE_RATE / 20; // 50 ms
  for (let start = 0; start + windowSize <= samples.length; start += windowSize) {
    let sum = 0;
    for (let i = start; i < start + windowSize; i++) sum += samples[i] * samples[i];
    if (Math.sqrt(sum / windowSize) > 0.01) return true;
  }
  return false;
};
