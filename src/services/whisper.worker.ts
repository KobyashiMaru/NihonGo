// Web Worker running Whisper speech recognition inside the browser.
// Used when the browser has no working Web Speech recognizer (e.g. Brave), and keeps
// the heavy model work off the UI thread. The model is downloaded once from Hugging Face
// and then served from the browser cache.
import { pipeline, type AutomaticSpeechRecognitionPipeline } from '@huggingface/transformers';

const MODEL_ID = 'onnx-community/whisper-base';

type WorkerRequest =
  | { type: 'load' }
  | { type: 'transcribe'; id: number; audio: Float32Array };

let transcriberPromise: Promise<AutomaticSpeechRecognitionPipeline> | null = null;

const loadTranscriber = () => {
  transcriberPromise ??= pipeline('automatic-speech-recognition', MODEL_ID, {
    // 8-bit quantized weights: ~77 MB download, runs fine on the CPU (WASM) backend
    dtype: 'q8',
    device: 'wasm',
    progress_callback: (info) => {
      if (info.status === 'progress_total') {
        self.postMessage({ type: 'progress', progress: info.progress });
      }
    },
  }) as Promise<AutomaticSpeechRecognitionPipeline>;

  // Allow a retry after a failed download instead of caching the rejection forever
  transcriberPromise.catch(() => {
    transcriberPromise = null;
  });
  return transcriberPromise;
};

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;
  try {
    if (request.type === 'load') {
      await loadTranscriber();
      self.postMessage({ type: 'ready' });
      return;
    }

    const transcriber = await loadTranscriber();
    self.postMessage({ type: 'ready' });
    const output = await transcriber(request.audio, { language: 'japanese', task: 'transcribe' });
    const text = Array.isArray(output) ? output.map(o => o.text).join('') : output.text;
    self.postMessage({ type: 'result', id: request.id, text });
  } catch (err: any) {
    self.postMessage({
      type: 'error',
      id: request.type === 'transcribe' ? request.id : undefined,
      message: String(err?.message ?? err),
    });
  }
};
