import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Volume2, VolumeX, Check, X, ArrowRight, RotateCcw, Ear, Lightbulb } from 'lucide-react';
import { ALL_KANA_KEYS, KanaCard, KanaScript, getKanaCard, isCorrectTypedAnswer, toHiragana } from '../../data/kanaFlashcardData';
import { KanaStudyMode, shuffle } from '../../services/kanaSrsService';
import { speechService } from '../../services/speechService';
import { soundEffects } from '../../services/soundEffects';
import { KanaCardDetails } from './KanaCardDetails';

export interface KanaSessionResult {
  total: number;
  firstTryCorrect: number;
  missed: string[];
}

interface KanaStudySessionProps {
  script: KanaScript;
  mode: KanaStudyMode;
  queue: string[];
  pool: string[];         // Kana being studied, preferred as wrong options
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  onReview: (key: string, correct: boolean) => void;
  onFinish: (result: KanaSessionResult) => void;
  onExit: () => void;
}

const OPTION_COUNT = 4;
// A missed card comes back after this many other cards
const REQUEUE_GAP = 3;
const AUTO_ADVANCE_MS = 900;

const MODE_PROMPTS: Record<KanaStudyMode, string> = {
  flip: '先在心裡念出讀音，再翻面確認',
  choice: '這個字怎麼念？',
  listen: '聽到的是哪一個字？',
  type: '輸入這個字的羅馬拼音',
};

// Wrong options: look-alikes and same row/vowel from the studied kana first, never a same-sounding kana
const buildOptions = (answer: KanaCard, script: KanaScript, pool: string[]): string[] => {
  const vowel = answer.sound.slice(-1);
  const related = (key: string) => {
    const c = getKanaCard(key, script);
    return c.rowId === answer.rowId || c.sound.slice(-1) === vowel;
  };
  const lookalikes = answer.confusables.flatMap(set => set.chars).map(toHiragana);
  const inPool = new Set(pool);
  const tiers = [
    lookalikes.filter(k => inPool.has(k)),
    pool.filter(related),
    pool,
    lookalikes,
    ALL_KANA_KEYS.filter(related),
    ALL_KANA_KEYS,
  ];

  const picked: string[] = [];
  const sounds = new Set([answer.sound]);
  for (const tier of tiers) {
    for (const key of shuffle(tier)) {
      if (picked.length >= OPTION_COUNT - 1) break;
      const sound = getKanaCard(key, script).sound;
      if (sounds.has(sound)) continue;
      sounds.add(sound);
      picked.push(key);
    }
  }
  return shuffle([answer.key, ...picked]);
};

export const KanaStudySession: React.FC<KanaStudySessionProps> = ({
  script,
  mode,
  queue: initialQueue,
  pool,
  autoSpeak,
  onToggleAutoSpeak,
  onReview,
  onFinish,
  onExit,
}) => {
  const [queue, setQueue] = useState(initialQueue);
  const [round, setRound] = useState(0);       // Bumps for every card shown, even a repeated one
  const [missed, setMissed] = useState<string[]>([]);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  // `known` is false when the answer was right but only after opening the hint
  const [feedback, setFeedback] = useState<{ correct: boolean; known: boolean; picked?: string; typed?: string } | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [typed, setTyped] = useState('');
  // Reshuffled for every round, including when a missed card comes back
  const optionsFor = (key: string) =>
    mode === 'choice' || mode === 'listen' ? buildOptions(getKanaCard(key, script), script, pool) : [];
  const [options, setOptions] = useState(() => optionsFor(initialQueue[0]));
  const advanceTimerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const total = initialQueue.length;

  const card = getKanaCard(queue[0], script);
  const currentKey = card.key;
  const cleared = total - new Set(queue).size;

  const speakCard = () => speechService.speak(card.key);

  // Listening mode plays the sound as soon as a card appears
  useEffect(() => {
    if (mode !== 'listen') return;
    const timer = window.setTimeout(() => speechService.speak(currentKey), 250);
    return () => clearTimeout(timer);
  }, [round, mode, currentKey]);

  useEffect(() => {
    if (mode === 'type') inputRef.current?.focus();
  }, [round, mode]);

  useEffect(() => () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    speechService.stopSpeaking();
  }, []);

  const goNext = (wasCorrect: boolean, nextMissed = missed, nextFirstTry = firstTryCorrect) => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    const rest = queue.slice(1);
    const at = Math.min(REQUEUE_GAP, rest.length);
    const next = wasCorrect ? rest : [...rest.slice(0, at), queue[0], ...rest.slice(at)];

    if (next.length === 0) {
      onFinish({ total, firstTryCorrect: nextFirstTry, missed: nextMissed });
      return;
    }
    setQueue(next);
    setOptions(optionsFor(next[0]));
    setRound(r => r + 1);
    setFeedback(null);
    setFlipped(false);
    setHintShown(false);
    setTyped('');
  };

  const submit = (correct: boolean, answer?: { picked?: string; typed?: string }) => {
    if (feedback) return;
    const key = card.key;
    // Right only after peeking at the hint still means "not learned yet": it comes back like a miss
    const known = correct && !hintShown;
    onReview(key, known);

    const wasMissed = missed.includes(key);
    const nextMissed = known || wasMissed ? missed : [...missed, key];
    const nextFirstTry = firstTryCorrect + (known && !wasMissed ? 1 : 0);
    setMissed(nextMissed);
    setFirstTryCorrect(nextFirstTry);

    if (correct) soundEffects.playCorrect();
    else soundEffects.playWrong();

    // Flip mode is self-graded after the answer was already shown
    if (mode === 'flip') {
      goNext(known, nextMissed, nextFirstTry);
      return;
    }

    setFeedback({ correct, known, ...answer });
    if (autoSpeak || mode === 'listen') speakCard();
    if (known) {
      advanceTimerRef.current = window.setTimeout(() => goNext(true, nextMissed, nextFirstTry), AUTO_ADVANCE_MS);
    }
  };

  const flip = () => {
    if (flipped) {
      speakCard();
      return;
    }
    setFlipped(true);
    if (autoSpeak) speakCard();
  };

  const pickOption = (key: string) => submit(key === card.key, { picked: key });

  // The origin hint is offered before answering; listening mode would give the shape away
  const canShowHint = mode !== 'listen' && !feedback && !(mode === 'flip' && flipped);
  const isHandakuten = card.key.normalize('NFD')[1] === '\u309A';

  const submitTyped = () => {
    if (!typed.trim()) return;
    submit(isCorrectTypedAnswer(card, typed), { typed: typed.trim() });
  };

  // Keyboard shortcuts; the handler is refreshed every render so it always sees current state
  const keyHandlerRef = useRef<(e: KeyboardEvent) => void>(() => {});
  useEffect(() => {
    keyHandlerRef.current = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const isConfirmKey = e.key === ' ' || e.key === 'Enter';
      if (isConfirmKey) {
        // The shortcut handles it: keep a mouse-focused button from clicking too, and Space from scrolling
        e.preventDefault();
        if (document.activeElement instanceof HTMLButtonElement) document.activeElement.blur();
      }

      if (feedback) {
        if (isConfirmKey) goNext(feedback.known);
        return;
      }

      if ((e.key === 'h' || e.key === 'H') && canShowHint) {
        setHintShown(true);
        return;
      }

      if (mode === 'flip') {
        if (isConfirmKey) {
          flip();
        } else if (flipped && (e.key === '1' || e.key === 'ArrowLeft')) {
          submit(false);
        } else if (flipped && (e.key === '2' || e.key === 'ArrowRight')) {
          submit(true);
        }
        return;
      }

      if (mode === 'choice' || mode === 'listen') {
        const index = Number(e.key) - 1;
        if (index >= 0 && index < options.length) {
          pickOption(options[index]);
        } else if (e.key === ' ' && mode === 'listen') {
          speakCard();
        }
      }
    };
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => keyHandlerRef.current(e);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleTypedKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
    e.preventDefault();
    if (feedback) goNext(feedback.known);
    else submitTyped();
  };

  const optionClass = (key: string) => {
    if (!feedback) {
      return 'bg-slate-950/70 border-slate-700 hover:border-pink-400 hover:bg-pink-950/30 text-white';
    }
    if (key === card.key) return 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
    if (key === feedback.picked) return 'bg-rose-500/20 border-rose-500 text-rose-200';
    return 'bg-slate-950/40 border-slate-800 text-slate-600';
  };

  const showDetails = mode === 'flip' ? flipped : Boolean(feedback && !feedback.known);

  const hintArea = canShowHint && (
    hintShown ? (
      <div className="max-w-md mx-auto flex items-start space-x-3 rounded-2xl border border-amber-700/50 bg-amber-950/30 px-4 py-3 text-left">
        <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-1" />
        <div>
          {card.base ? (
            <div className="text-sm text-amber-100">
              這是 <span className="text-2xl font-black text-amber-200 mx-1">{card.base}</span>
              加上{isHandakuten ? '半濁音符號 ゜' : '濁音符號 ゛'}
            </div>
          ) : card.origin ? (
            <div className="text-sm text-amber-100">
              字源 <span className="text-2xl font-black text-amber-200 mx-1">{card.origin.kanji}</span>
              {card.origin.hint}
            </div>
          ) : null}
          <div className="text-[11px] text-amber-200/60 mt-1">看了提示才答對的字，等一下會再考一次</div>
        </div>
      </div>
    ) : (
      <button
        onClick={() => setHintShown(true)}
        className="mx-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-amber-700/40 bg-amber-950/20 hover:bg-amber-950/40 text-xs font-semibold text-amber-300 transition-colors"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        <span>給我提示（字源）</span>
        {mode !== 'type' && <kbd className="text-[10px] font-mono text-amber-300/60">H</kbd>}
      </button>
    )
  );

  return (
    <div className="space-y-5">
      {/* Session top bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onExit}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>結束練習</span>
          </button>
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-slate-400">完成 <span className="text-white font-bold">{cleared}</span> / {total}</span>
            <span className="text-emerald-400">一次答對 {firstTryCorrect}</span>
            {missed.length > 0 && <span className="text-rose-400">待加強 {missed.length}</span>}
          </div>
          <button
            onClick={onToggleAutoSpeak}
            title={autoSpeak ? '自動發音：開' : '自動發音：關'}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700"
          >
            {autoSpeak ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-pink-500 to-amber-400 h-full transition-all duration-300"
            style={{ width: `${(cleared / total) * 100}%` }}
          />
        </div>
      </div>

      <p className="text-center text-sm font-semibold text-slate-300">{MODE_PROMPTS[mode]}</p>

      {/* Flip card */}
      {mode === 'flip' && (
        <div key={round} className="space-y-4">
          <button onClick={flip} className="block w-full max-w-sm mx-auto perspective-distant" aria-label="翻面">
            <div className={`relative h-64 sm:h-72 transition-transform duration-500 transform-3d ${flipped ? 'rotate-y-180' : ''}`}>
              <div className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 shadow-2xl flex flex-col items-center justify-center">
                <span className="text-8xl sm:text-9xl font-black text-white leading-none">{card.char}</span>
                <span className="absolute bottom-4 text-xs text-slate-500">點卡片或按 Space 翻面</span>
              </div>
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-pink-950 to-slate-900 border-2 border-pink-500/50 shadow-2xl flex flex-col items-center justify-center space-y-2">
                <span className="text-5xl font-black text-white leading-none">{card.char}</span>
                <span className="text-5xl sm:text-6xl font-black font-mono text-amber-300">{card.romaji}</span>
                <span className="absolute bottom-4 flex items-center space-x-1 text-xs text-slate-400">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>再點一下重聽發音</span>
                </span>
              </div>
            </div>
          </button>

          {hintArea}

          {flipped ? (
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <button
                onClick={() => submit(false)}
                className="flex items-center justify-center space-x-2 py-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/50 text-rose-200 font-bold text-sm transition-colors"
              >
                <X className="w-4 h-4" />
                <span>還不熟</span>
                <kbd className="text-[10px] font-mono text-rose-300/70">1</kbd>
              </button>
              <button
                onClick={() => submit(true)}
                className="flex items-center justify-center space-x-2 py-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/50 text-emerald-200 font-bold text-sm transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>記住了</span>
                <kbd className="text-[10px] font-mono text-emerald-300/70">2</kbd>
              </button>
            </div>
          ) : (
            <button
              onClick={flip}
              className="block mx-auto px-8 py-3 rounded-2xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-sm shadow-lg shadow-pink-500/20 transition-colors"
            >
              翻面看答案
            </button>
          )}
        </div>
      )}

      {/* Question card for choice / listen / type */}
      {mode !== 'flip' && (
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex justify-center">
            {mode === 'listen' ? (
              <button
                onClick={speakCard}
                className="w-36 h-36 rounded-full bg-gradient-to-br from-sky-500/30 to-indigo-600/30 border-2 border-sky-400/60 flex flex-col items-center justify-center text-sky-200 hover:scale-105 transition-transform"
              >
                {feedback ? (
                  <span className="text-6xl font-black text-white">{card.char}</span>
                ) : (
                  <>
                    <Ear className="w-12 h-12" />
                    <span className="text-[11px] mt-1">再聽一次（Space）</span>
                  </>
                )}
              </button>
            ) : (
              <span className="text-8xl sm:text-9xl font-black text-white leading-none py-2">{card.char}</span>
            )}
          </div>

          {hintArea}

          {(mode === 'choice' || mode === 'listen') && (
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {options.map((key, i) => {
                const option = getKanaCard(key, script);
                return (
                  <button
                    key={key}
                    onClick={() => pickOption(key)}
                    disabled={Boolean(feedback)}
                    className={`relative rounded-2xl border-2 py-4 font-black transition-all ${optionClass(key)} ${
                      mode === 'listen' ? 'text-4xl' : 'text-2xl font-mono'
                    }`}
                  >
                    <kbd className="absolute top-1.5 left-2 text-[10px] font-mono font-normal text-slate-500">{i + 1}</kbd>
                    {mode === 'listen' ? option.char : option.romaji}
                    {feedback && mode === 'listen' && (
                      <span className="block text-xs font-mono font-normal text-slate-400 mt-0.5">{option.romaji}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {mode === 'type' && (
            <div className="max-w-sm mx-auto space-y-2">
              <input
                ref={inputRef}
                type="text"
                value={typed}
                onChange={e => setTyped(e.target.value)}
                onKeyDown={handleTypedKeyDown}
                readOnly={Boolean(feedback)}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="例如 ka，按 Return 送出"
                className={`w-full bg-slate-950 border-2 rounded-2xl px-5 py-3.5 text-center text-2xl font-bold font-mono text-white outline-none transition-colors placeholder:text-slate-600 placeholder:text-sm placeholder:font-sans ${
                  feedback
                    ? feedback.known ? 'border-emerald-400' : feedback.correct ? 'border-amber-400' : 'border-rose-500'
                    : 'border-pink-500/50 focus:border-pink-400'
                }`}
              />
              {!feedback && (
                <p className="text-center text-[11px] text-slate-500">
                  請先按【英数】切到英文輸入；用日文輸入法打出假名也算對
                </p>
              )}
            </div>
          )}

          {/* Answer feedback */}
          {feedback && (
            <div
              className={`max-w-md mx-auto flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
                feedback.known
                  ? 'bg-emerald-950/40 border-emerald-700/60'
                  : feedback.correct
                    ? 'bg-amber-950/40 border-amber-700/60'
                    : 'bg-rose-950/40 border-rose-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                {feedback.correct ? (
                  <Check className={`w-5 h-5 ${feedback.known ? 'text-emerald-400' : 'text-amber-400'}`} />
                ) : (
                  <X className="w-5 h-5 text-rose-400" />
                )}
                <div className="text-sm">
                  <div className={`font-bold ${feedback.known ? 'text-emerald-200' : feedback.correct ? 'text-amber-200' : 'text-rose-200'}`}>
                    {feedback.known ? '答對了！' : feedback.correct ? '答對了（有看提示）' : '答案是'}
                    <span className="text-xl text-white mx-2">{card.char}</span>
                    <span className="font-mono text-amber-300">{card.romaji}</span>
                  </div>
                  {!feedback.correct && feedback.picked && (
                    <div className="text-xs text-slate-400">
                      你選的是 {getKanaCard(feedback.picked, script).char}（{getKanaCard(feedback.picked, script).romaji}）
                    </div>
                  )}
                  {!feedback.correct && feedback.typed && (
                    <div className="text-xs text-slate-400">你輸入的是「{feedback.typed}」</div>
                  )}
                </div>
              </div>
              <button
                onClick={() => goNext(feedback.known)}
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex-shrink-0"
              >
                <span>{feedback.known ? '下一張' : '繼續'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {showDetails && <KanaCardDetails card={card} script={script} />}

      {/* Keyboard hint */}
      <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500">
        <RotateCcw className="w-3 h-3" />
        <span>
          {mode === 'flip' && 'Space 翻面　H 提示　1 / ← 還不熟　2 / → 記住了　答錯的卡片會在幾張後再出現'}
          {(mode === 'choice' || mode === 'listen') && `數字鍵 1–4 作答　${mode === 'listen' ? 'Space 重聽　' : 'H 提示　'}Return 下一張`}
          {mode === 'type' && 'Return 送出 / 下一張　答錯的卡片會在幾張後再出現'}
        </span>
      </div>
    </div>
  );
};
