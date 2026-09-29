// Speech Service (Web Speech Synthesis TTS & Speech Recognition STT)

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isListening: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  // Strip ruby tags, html tags, and symbols for clean TTS speech
  private cleanTextForTTS(rawText: string): string {
    return rawText
      .replace(/<rt>.*?<\/rt>/g, '') // Remove furigana rt content if kanji is already there
      .replace(/<[^>]+>/g, '')        // Remove remaining HTML tags
      .replace(/[～〜]/g, '')          // Remove wave dashes
      .trim();
  }

  // Speak Japanese text with natural voice and adjustable speed
  speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): void {
    if (!this.synth) {
      console.warn('Speech synthesis is not supported in this browser.');
      options?.onEnd?.();
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const clean = this.cleanTextForTTS(text);
    if (!clean) {
      options?.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'ja-JP';
    utterance.rate = options?.rate ?? 0.85; // Default beginner friendly speed
    utterance.pitch = options?.pitch ?? 1.05;

    // Pick best Japanese voice (macOS Kyoko / Otoya or any ja-JP voice)
    const jaVoices = this.voices.filter(v => v.lang.startsWith('ja') || v.lang.includes('JP'));
    const preferredVoice = jaVoices.find(v => v.name.includes('Kyoko') || v.name.includes('Otoya') || v.name.includes('Google') || v.name.includes('Natural')) || jaVoices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (options?.onStart) utterance.onstart = options.onStart;
    if (options?.onEnd) utterance.onend = options.onEnd;
    if (options?.onError) utterance.onerror = options.onError;

    this.synth.speak(utterance);
  }

  stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Start microphone speech recognition
  startListening(callbacks: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onError?: (err: string) => void;
    onEnd?: () => void;
  }): boolean {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      callbacks.onError?.('您的瀏覽器不支援 Web Speech API。建議使用 Google Chrome、Edge 或 Safari。');
      return false;
    }

    try {
      if (this.recognition) {
        this.recognition.abort();
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'ja-JP';
      this.recognition.interimResults = true;
      this.recognition.continuous = false;
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const resultText = finalTranscript || interimTranscript;
        callbacks.onResult(resultText, Boolean(finalTranscript));
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        callbacks.onError?.(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        callbacks.onEnd?.();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      callbacks.onError?.(err?.message || '無法啟動語音識別');
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListening = false;
    }
  }

  // Calculate pronunciation similarity score (0 to 100)
  scorePronunciation(target: string, spoken: string): { score: number; feedback: string } {
    const cleanTarget = target.replace(/[\s、。！？!?,.]/g, '').toLowerCase();
    const cleanSpoken = spoken.replace(/[\s、。！？!?,.]/g, '').toLowerCase();

    if (!cleanSpoken) {
      return { score: 0, feedback: '未偵測到發音，請按住麥克風再試一次！' };
    }

    if (cleanTarget === cleanSpoken || cleanSpoken.includes(cleanTarget) || cleanTarget.includes(cleanSpoken)) {
      return { score: 100, feedback: '發音非常標準！太厲害了 (完璧！)' };
    }

    // Levenshtein distance calculation
    const matrix: number[][] = [];
    const len1 = cleanTarget.length;
    const len2 = cleanSpoken.length;

    for (let i = 0; i <= len1; i++) matrix[i] = [i];
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = cleanTarget[i - 1] === cleanSpoken[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const dist = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    const similarity = Math.max(0, Math.round((1 - dist / maxLen) * 100));

    let feedback = '發音很接近了，加油！';
    if (similarity >= 80) {
      feedback = '發音很好！語調很自然！';
    } else if (similarity >= 60) {
      feedback = '很棒的嘗試！稍微注意一下個別音節喔。';
    } else {
      feedback = '再跟著示範朗讀一次試試看！';
    }

    return { score: Math.max(similarity, 50), feedback };
  }
}

export const speechService = new SpeechService();
