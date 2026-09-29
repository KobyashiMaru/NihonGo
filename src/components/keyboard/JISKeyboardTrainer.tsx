import React, { useState, useEffect, useRef } from 'react';
import { TYPING_CHALLENGES, KANA_LIST } from '../../data/kanaData';
import { soundEffects } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Keyboard, 
  Volume2, 
  RefreshCw, 
  Award,
  Layers,
  Flame,
  ArrowRight
} from 'lucide-react';
import { speechService } from '../../services/speechService';

interface JISKeyboardTrainerProps {
  onEarnXP: (amount: number) => void;
}

export const JISKeyboardTrainer: React.FC<JISKeyboardTrainerProps> = ({ onEarnXP }) => {
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  // True while the macOS Japanese IME still shows underlined (unconfirmed) text
  const isComposingRef = useRef(false);
  // Set once the current item is solved so late input events cannot advance twice
  const isAdvancingRef = useRef(false);
  const advanceTimerRef = useRef<number | null>(null);

  const currentChallenge = TYPING_CHALLENGES[selectedChallengeIdx];
  const currentItem = currentChallenge.items[currentItemIdx] as any;
  const isKanjiChallenge = Boolean(currentItem.targetKanji);

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentItemIdx, selectedChallengeIdx]);

  // Audio pronunciation when new item loads
  useEffect(() => {
    if (currentItem && !isCompleted) {
      speechService.speak(currentItem.kana || currentItem.prompt);
    }
  }, [currentItemIdx, selectedChallengeIdx]);

  const isCorrectAnswer = (raw: string) => {
    const val = raw.trim();
    // Kanji challenge: only the converted kanji counts (typing the kana alone skips the Space step)
    if (isKanjiChallenge) return val === currentItem.targetKanji;
    return (
      val === currentItem.kana ||
      val === currentItem.kanji || // macOS Live Conversion may already have turned it into kanji
      val.toLowerCase() === currentItem.romaji?.toLowerCase()
    );
  };

  const checkAnswer = (val: string) => {
    if (isAdvancingRef.current || !isCorrectAnswer(val)) return;
    isAdvancingRef.current = true;

    soundEffects.playCorrect();
    setStreakCount(prev => prev + 1);

    if (currentItemIdx + 1 < currentChallenge.items.length) {
      advanceTimerRef.current = window.setTimeout(() => {
        setCurrentItemIdx(prev => prev + 1);
        setUserInput('');
        isAdvancingRef.current = false;
      }, 280);
    } else {
      // Completed the challenge set!
      setIsCompleted(true);
      soundEffects.playVictory();
      onEarnXP(50);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);
    soundEffects.playKeyClick();

    // While the IME is composing, the value is still underlined text the user has not
    // confirmed yet. Wait for Return (compositionend) instead of advancing mid-composition.
    if (isComposingRef.current || (e.nativeEvent as InputEvent).isComposing) return;
    checkAnswer(val);
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    checkAnswer(e.currentTarget.value);
  };

  const handleReset = () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    setCurrentItemIdx(0);
    setUserInput('');
    setIsCompleted(false);
    setStreakCount(0);
    isAdvancingRef.current = false;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Keyboard className="w-4 h-4" />
            <span>日式鍵盤打字肌肉記憶訓練</span>
          </div>
          <h2 className="text-2xl font-black text-white">JIS 打字特訓道場</h2>
          <p className="text-slate-400 text-sm mt-1">
            按下實體鍵盤的【かな】鍵，練習平假名輸入與「空白鍵選漢字」的必殺技！
          </p>
        </div>

        {/* Challenge Selector */}
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {TYPING_CHALLENGES.map((ch, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedChallengeIdx(idx);
                handleReset();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                selectedChallengeIdx === idx
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {ch.title.split('打字')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Typing Gym Area */}
      {!isCompleted ? (
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Progress Bar */}
          <div className="flex justify-between items-center text-xs text-slate-400 mb-6 font-mono">
            <span>關卡進度: {currentItemIdx + 1} / {currentChallenge.items.length}</span>
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-amber-400 font-bold">連對: {streakCount} 題</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-8">
            <div
              className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${((currentItemIdx + 1) / currentChallenge.items.length) * 100}%` }}
            />
          </div>

          {/* Target Card */}
          <div className="text-center space-y-4 py-4">
            <div className="inline-flex items-center space-x-2 bg-slate-800/90 border border-slate-700 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300">
              <span>意義：{currentItem.prompt}</span>
              <button
                onClick={() => speechService.speak(currentItem.kana || currentItem.targetKanji)}
                className="hover:text-sky-400 transition-colors"
                title="重聽發音"
              >
                <Volume2 className="w-3.5 h-3.5 text-sky-400 ml-1" />
              </button>
            </div>

            {/* Huge Japanese Display */}
            <div className="text-5xl sm:text-6xl font-black text-white tracking-wide">
              {currentItem.targetKanji || currentItem.kana}
            </div>

            {/* Furigana & Romaji Guides */}
            <div className="flex justify-center items-center space-x-4 text-sm font-mono">
              <span className="text-sky-300 font-bold bg-sky-950/60 px-3 py-1 rounded-lg border border-sky-800/60">
                讀音：{currentItem.kana}
              </span>
              <span className="text-slate-400 bg-slate-800/60 px-3 py-1 rounded-lg border border-slate-700/60">
                鍵盤拼寫：<span className="text-amber-300 font-bold">{currentItem.romaji}</span>
              </span>
            </div>

            {currentItem.tip && (
              <p className="text-xs text-emerald-400/90 font-medium bg-emerald-950/30 border border-emerald-800/40 max-w-md mx-auto py-1.5 px-3 rounded-xl">
                💡 技巧：{currentItem.tip}
              </p>
            )}
          </div>

          {/* Interactive Typing Input */}
          <div className="mt-8 max-w-md mx-auto space-y-3">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onCompositionStart={() => { isComposingRef.current = true; }}
                onCompositionEnd={handleCompositionEnd}
                placeholder={isKanjiChallenge ? '按【かな】打拼音 → Space 選漢字 → Return' : '在此輸入假名或羅馬字...'}
                className="w-full bg-slate-950 border-2 border-sky-500/50 focus:border-sky-400 rounded-2xl px-5 py-4 text-center text-2xl font-bold text-white tracking-widest outline-none shadow-inner transition-all placeholder:text-slate-600 placeholder:text-base placeholder:tracking-normal font-sans"
              />
            </div>

            {/* Quick Keyboard Instruction */}
            <div className="text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
              <kbd className="bg-slate-800 text-sky-300 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-700">
                かな
              </kbd>
              <span>
                {isKanjiChallenge
                  ? `打「${currentItem.romaji}」→ 按 Space 選「${currentItem.targetKanji}」→ 按 Return 確定`
                  : `打「${currentItem.romaji}」拼出假名 → 按 Return 確定`}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Victory Completion Card */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-emerald-400 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Award className="w-10 h-10 text-slate-950" />
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-black text-white">太棒了！本單元特訓完成！</h3>
            <p className="text-slate-300 max-w-md mx-auto text-sm">
              你已經熟練掌握了本單元的鍵盤輸入肌肉記憶，獲得了 <span className="text-amber-400 font-bold">+50 XP</span> 獎勵！
            </p>
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <button
              onClick={handleReset}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-3 rounded-xl text-sm transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>再練一次</span>
            </button>
            <button
              onClick={() => {
                const nextIdx = (selectedChallengeIdx + 1) % TYPING_CHALLENGES.length;
                setSelectedChallengeIdx(nextIdx);
                handleReset();
              }}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center space-x-2 shadow-lg shadow-sky-500/25"
            >
              <span>挑戰下一關卡</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 50 Sounds Quick Reference Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>五十音速查表（點擊可即時聽發音）</span>
          </div>
          <span className="text-xs text-slate-400">平假名 / 片假名 / 羅馬字</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {KANA_LIST.slice(0, KANA_LIST.findIndex(k => k.hiragana === 'ん') + 1).map((k, i) => (
            <button
              key={i}
              onClick={() => speechService.speak(k.hiragana)}
              className="bg-slate-950/70 hover:bg-sky-950/50 hover:border-sky-500/50 border border-slate-800/80 rounded-xl p-2 text-center transition-all group"
            >
              <div className="text-base font-bold text-white group-hover:text-sky-300">{k.hiragana}</div>
              <div className="text-[10px] text-slate-500 group-hover:text-slate-300">{k.katakana}</div>
              <div className="text-[9px] text-amber-400 font-mono">{k.romaji}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
