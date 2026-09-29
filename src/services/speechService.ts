// Speech Service (Web Speech Synthesis TTS & Speech Recognition STT)

// Convert ruby markup (<ruby>漢字<rt>かんじ</rt></ruby>) into its kana reading
export const furiganaToKana = (furigana: string): string =>
  furigana
    .replace(/<ruby>.*?<rt>(.*?)<\/rt><\/ruby>/g, '$1')
    .replace(/<[^>]+>/g, '');

// Normalize Japanese text for fuzzy comparison: drop markup and punctuation,
// fold full-width/half-width variants and treat katakana the same as hiragana
const normalizeForCompare = (text: string): string =>
  text
    .replace(/<rt>.*?<\/rt>/g, '')
    .replace(/<[^>]+>/g, '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s、。，．,.!?！？「」『』（）()〜～・…"'-]/g, '')
    .replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));

const levenshteinSimilarity = (a: string, b: string): number => {
  if (!a || !b) return 0;
  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) matrix[i] = [i];
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return 1 - matrix[a.length][b.length] / Math.max(a.length, b.length);
};

// Human readable messages for SpeechRecognition error codes. `null` means "ignore".
const describeRecognitionError = (code: string): string | null => {
  switch (code) {
    case 'aborted':
      return null;
    case 'not-allowed':
    case 'service-not-allowed':
      return '麥克風權限被拒絕：請點瀏覽器網址列左側的圖示，允許此網站使用麥克風。';
    case 'no-speech':
      return '沒有偵測到聲音，請靠近麥克風再試一次。';
    case 'audio-capture':
      return '找不到可用的麥克風裝置，請確認麥克風已連接。';
    case 'network':
      return '語音辨識需要網路連線（瀏覽器會把語音送到雲端辨識），請檢查網路後再試。';
    case 'language-not-supported':
      return '此瀏覽器不支援日語語音辨識，建議改用 Google Chrome。';
    default:
      return `語音辨識發生錯誤（${code}），請再試一次。`;
  }
};

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private voices: SpeechSynthesisVoice[] = [];
  private defaultRate = 0.85;

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

  // Rate used when a caller does not pass one (driven by the user's settings)
  setDefaultRate(rate: number): void {
    this.defaultRate = rate;
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
    utterance.rate = options?.rate ?? this.defaultRate;
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

  // Start microphone speech recognition.
  // `continuous: true` keeps listening through pauses until stopListening() is called
  // (used for push-to-talk); otherwise the browser stops after the first phrase.
  startListening(
    callbacks: {
      onResult: (transcript: string, isFinal: boolean) => void;
      onError?: (message: string) => void;
      onEnd?: () => void;
    },
    options?: { continuous?: boolean }
  ): boolean {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      callbacks.onError?.('您的瀏覽器不支援 Web Speech API 語音辨識。建議使用 Google Chrome、Edge 或 Safari。');
      return false;
    }

    // Detach the previous session so its late events cannot leak into this one
    this.abortListening();

    try {
      const recognition = new SpeechRecognition();
      this.recognition = recognition;
      recognition.lang = 'ja-JP';
      recognition.interimResults = true;
      recognition.continuous = options?.continuous ?? false;
      recognition.maxAlternatives = 3;

      const isCurrent = () => this.recognition === recognition;

      recognition.onresult = (event: any) => {
        if (!isCurrent()) return;
        let finalTranscript = '';
        let interimTranscript = '';

        // Rebuild the whole utterance so continuous sessions keep earlier phrases
        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        callbacks.onResult(finalTranscript + interimTranscript, !interimTranscript && Boolean(finalTranscript));
      };

      recognition.onerror = (event: any) => {
        if (!isCurrent()) return;
        const message = describeRecognitionError(event.error);
        if (message) callbacks.onError?.(message);
      };

      recognition.onend = () => {
        if (!isCurrent()) return;
        this.recognition = null;
        callbacks.onEnd?.();
      };

      recognition.start();
      return true;
    } catch (err: any) {
      this.recognition = null;
      callbacks.onError?.(err?.message || '無法啟動語音識別');
      return false;
    }
  }

  // Gracefully stop: the browser delivers the final transcript, then fires onEnd.
  // Safe to call before the session has actually started.
  stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  // Hard cancel without firing any more callbacks (e.g. when leaving the screen)
  abortListening(): void {
    const recognition = this.recognition;
    if (!recognition) return;
    this.recognition = null;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    try {
      recognition.abort();
    } catch {}
  }

  // How closely `spoken` matches the best of `targets` (0 to 100). Targets can be
  // the kanji sentence and its kana reading, since recognizers return either.
  matchScore(spoken: string, targets: string[]): number {
    const cleanSpoken = normalizeForCompare(spoken);
    if (!cleanSpoken) return 0;

    let best = 0;
    for (const target of targets) {
      const cleanTarget = normalizeForCompare(target);
      if (!cleanTarget) continue;
      const similarity = cleanSpoken.includes(cleanTarget) ? 1 : levenshteinSimilarity(cleanTarget, cleanSpoken);
      best = Math.max(best, similarity);
    }
    return Math.round(best * 100);
  }

  // Calculate pronunciation similarity score (0 to 100)
  scorePronunciation(target: string, spoken: string, reading?: string): { score: number; feedback: string } {
    if (!normalizeForCompare(spoken)) {
      return { score: 0, feedback: '未偵測到發音，請按下麥克風再試一次！' };
    }

    const similarity = this.matchScore(spoken, reading ? [target, reading] : [target]);

    if (similarity === 100) {
      return { score: 100, feedback: '發音非常標準！太厲害了 (完璧！)' };
    }

    let feedback: string;
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
