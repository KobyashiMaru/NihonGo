import React, { useState } from 'react';
import { 
  LISTENING_EXERCISES, 
  SPEAKING_EXERCISES, 
  READING_ARTICLES, 
  WRITING_EXERCISES,
  ListeningExercise,
  SpeakingExercise,
  ReadingArticle,
  WritingExercise
} from '../../data/fourSkillsData';
import { speechService } from '../../services/speechService';
import { soundEffects } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Headphones, 
  Mic, 
  BookOpen, 
  PenTool, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight,
  RotateCcw,
  Languages,
  Award
} from 'lucide-react';

interface FourSkillsHubProps {
  onEarnXP: (amount: number) => void;
}

type SkillTab = 'listening' | 'speaking' | 'reading' | 'writing';

export const FourSkillsHub: React.FC<FourSkillsHubProps> = ({ onEarnXP }) => {
  const [activeTab, setActiveTab] = useState<SkillTab>('listening');

  // LISTENING STATE
  const [listenIdx, setListenIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [listenFeedback, setListenFeedback] = useState<string | null>(null);

  // SPEAKING STATE
  const [speakIdx, setSpeakIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [pronounceScore, setPronounceScore] = useState<number | null>(null);
  const [scoreFeedback, setScoreFeedback] = useState<string>('');

  // READING STATE
  const [readIdx, setReadIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showFurigana, setShowFurigana] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  // WRITING STATE
  const [writeIdx, setWriteIdx] = useState(0);
  const [constructedWords, setConstructedWords] = useState<string[]>([]);
  const [writeSubmitted, setWriteSubmitted] = useState(false);

  // --- LISTENING HANDLERS ---
  const currentListen = LISTENING_EXERCISES[listenIdx];

  const handleListenOption = (optIdx: number) => {
    setSelectedOptionIdx(optIdx);
    const opt = currentListen.options[optIdx];
    if (opt.isCorrect) {
      soundEffects.playCorrect();
      setListenFeedback(opt.explanation);
      onEarnXP(25);
    } else {
      soundEffects.playWrong();
      setListenFeedback(opt.explanation);
    }
  };

  const nextListening = () => {
    setSelectedOptionIdx(null);
    setListenFeedback(null);
    setListenIdx(prev => (prev + 1) % LISTENING_EXERCISES.length);
  };

  // --- SPEAKING HANDLERS ---
  const currentSpeak = SPEAKING_EXERCISES[speakIdx];

  const toggleRecording = () => {
    if (isRecording) {
      speechService.stopListening();
      setIsRecording(false);
    } else {
      setSpokenTranscript('');
      setPronounceScore(null);
      setScoreFeedback('');
      const ok = speechService.startListening({
        onResult: (text, isFinal) => {
          setSpokenTranscript(text);
          if (isFinal) {
            setIsRecording(false);
            const res = speechService.scorePronunciation(currentSpeak.targetJapanese, text);
            setPronounceScore(res.score);
            setScoreFeedback(res.feedback);
            if (res.score >= 70) {
              soundEffects.playCorrect();
              onEarnXP(currentSpeak.points);
            } else {
              soundEffects.playWrong();
            }
          }
        },
        onError: (err) => {
          setIsRecording(false);
          setScoreFeedback('麥克風未偵測到聲音，請再試一次。');
        },
        onEnd: () => setIsRecording(false)
      });
      setIsRecording(ok);
    }
  };

  // --- READING HANDLERS ---
  const currentArticle = READING_ARTICLES[readIdx];

  const handleQuizSelect = (qIdx: number, aIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: aIdx }));
    const isRight = currentArticle.comprehensionQuestions[qIdx].correctIndex === aIdx;
    if (isRight) {
      soundEffects.playCorrect();
      onEarnXP(15);
    } else {
      soundEffects.playWrong();
    }
  };

  // --- WRITING HANDLERS ---
  const currentWrite = WRITING_EXERCISES[writeIdx];

  const handleAddWordToSentence = (w: string) => {
    if (constructedWords.includes(w)) return;
    setConstructedWords(prev => [...prev, w]);
    soundEffects.playKeyClick();
  };

  const handleRemoveWord = (idx: number) => {
    setConstructedWords(prev => prev.filter((_, i) => i !== idx));
    soundEffects.playKeyClick();
  };

  const handleCheckWriting = () => {
    const full = constructedWords.join('');
    setWriteSubmitted(true);
    if (full === currentWrite.targetJapanese) {
      soundEffects.playCorrect();
      onEarnXP(30);
      confetti({ particleCount: 50, spread: 60 });
    } else {
      soundEffects.playWrong();
    }
  };

  const handleResetWriting = () => {
    setConstructedWords([]);
    setWriteSubmitted(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-800/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold text-purple-300">
            <Headphones className="w-3.5 h-3.5" />
            <span>全方位日語能力特訓</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">聽說讀寫四維訓練室</h2>
          <p className="text-slate-300 text-sm max-w-xl">
            均衡強化聽覺辨音、口說影子跟讀（Shadowing）、文章閱讀理解與日式鍵盤造句！
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 space-x-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('listening')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'listening'
                ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>聽 (Listening)</span>
          </button>
          <button
            onClick={() => setActiveTab('speaking')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'speaking'
                ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>說 (Speaking)</span>
          </button>
          <button
            onClick={() => setActiveTab('reading')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'reading'
                ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>讀 (Reading)</span>
          </button>
          <button
            onClick={() => setActiveTab('writing')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'writing'
                ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>寫 (Writing)</span>
          </button>
        </div>
      </div>

      {/* 1. LISTENING TAB */}
      {activeTab === 'listening' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span className="bg-slate-800 px-3 py-1 rounded-full text-purple-300 font-bold">
              {currentListen.category}
            </span>
            <span>題目: {listenIdx + 1} / {LISTENING_EXERCISES.length}</span>
          </div>

          <div className="text-center space-y-4 py-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white">{currentListen.question}</h3>
            
            {/* Play Sound Button */}
            <button
              onClick={() => speechService.speak(currentListen.japaneseVoice, { rate: 0.85 })}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-black px-8 py-5 rounded-3xl shadow-xl shadow-purple-500/30 transition-transform active:scale-95 text-lg"
            >
              <Volume2 className="w-7 h-7" />
              <span>點擊播放音訊 (朗讀)</span>
            </button>
            <p className="text-xs text-slate-400">若聽不清楚可多次重複點擊聆聽！</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {currentListen.options.map((opt, idx) => {
              const isSelected = selectedOptionIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleListenOption(idx)}
                  className={`p-5 rounded-2xl border text-left transition-all font-medium text-sm flex items-center justify-between ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-purple-500/60 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && (
                    opt.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next */}
          {listenFeedback && (
            <div className="max-w-2xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="text-sm text-slate-300 leading-relaxed">{listenFeedback}</div>
              <button
                onClick={nextListening}
                className="w-full bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center space-x-2"
              >
                <span>進入下一題聽力</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. SPEAKING TAB */}
      {activeTab === 'speaking' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span className="bg-slate-800 px-3 py-1 rounded-full text-purple-300 font-bold">
              影子跟讀 (Shadowing) & AI 評分
            </span>
            <span>題目: {speakIdx + 1} / {SPEAKING_EXERCISES.length}</span>
          </div>

          <div className="text-center space-y-4 max-w-xl mx-auto py-4">
            <span className="text-xs text-slate-400">情境：{currentSpeak.context}</span>
            <div className="text-4xl sm:text-5xl font-black text-white">{currentSpeak.targetJapanese}</div>
            <div className="text-sm font-mono text-purple-300 font-bold">讀音：{currentSpeak.romaji}</div>
            <div className="text-sm text-slate-400">意思是：{currentSpeak.translation}</div>

            {/* Model Audio */}
            <div className="pt-2">
              <button
                onClick={() => speechService.speak(currentSpeak.targetJapanese, { rate: 0.85 })}
                className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span>聆聽標準發音示範</span>
              </button>
            </div>
          </div>

          {/* Record button */}
          <div className="text-center space-y-4">
            <button
              onClick={toggleRecording}
              className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center shadow-2xl transition-all transform active:scale-95 ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/50'
                  : 'bg-gradient-to-tr from-purple-500 to-indigo-500 text-slate-950 shadow-purple-500/40 hover:scale-105'
              }`}
            >
              <Mic className="w-10 h-10" />
            </button>
            <div className="text-xs text-slate-400">
              {isRecording ? '正在聆聽您的發音，請大聲說出上方日語...' : '點擊麥克風開始跟讀練習'}
            </div>
          </div>

          {/* Results Display */}
          {(spokenTranscript || pronounceScore !== null) && (
            <div className="max-w-md mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
              <div className="text-xs text-slate-500 font-mono">辨識結果：</div>
              <div className="text-lg font-bold text-white">「{spokenTranscript || '...'}」</div>

              {pronounceScore !== null && (
                <div className="space-y-2">
                  <div className="text-3xl font-black text-amber-400">{pronounceScore} 分</div>
                  <div className="text-xs text-slate-300 font-medium">{scoreFeedback}</div>
                </div>
              )}

              <button
                onClick={() => {
                  setSpeakIdx(prev => (prev + 1) % SPEAKING_EXERCISES.length);
                  setSpokenTranscript('');
                  setPronounceScore(null);
                }}
                className="w-full bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>下一句練習</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. READING TAB */}
      {activeTab === 'reading' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs bg-purple-500/20 text-purple-300 font-bold px-2.5 py-1 rounded-full border border-purple-500/30">
                分級閱讀 ({currentArticle.level})
              </span>
              <h3 className="text-xl font-bold text-white mt-2">{currentArticle.title}</h3>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowFurigana(prev => !prev)}
                className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-colors ${
                  showFurigana ? 'bg-sky-500 text-slate-950 border-sky-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                振假名標註
              </button>
              <button
                onClick={() => setShowTranslation(prev => !prev)}
                className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-colors ${
                  showTranslation ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                中文對照
              </button>
            </div>
          </div>

          {/* Article Sentences */}
          <div className="space-y-4 bg-slate-950/70 p-6 rounded-2xl border border-slate-800/80">
            {currentArticle.contentLines.map((line, idx) => (
              <div key={idx} className="space-y-1 pb-3 border-b border-slate-800/50 last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div
                    className="text-lg text-white font-medium leading-loose"
                    dangerouslySetInnerHTML={{
                      __html: showFurigana ? line.furigana : line.japanese
                    }}
                  />
                  <button
                    onClick={() => speechService.speak(line.japanese, { rate: 0.85 })}
                    className="p-1 text-slate-500 hover:text-purple-400 transition-colors ml-2 mt-1"
                    title="朗讀本句"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                {showTranslation && (
                  <div className="text-xs text-slate-400 font-sans">{line.translation}</div>
                )}
              </div>
            ))}
          </div>

          {/* Comprehension Quiz */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider">閱讀理解小測驗</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentArticle.comprehensionQuestions.map((q, qIdx) => (
                <div key={qIdx} className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-sm font-bold text-white">{qIdx + 1}. {q.question}</div>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[qIdx] === optIdx;
                      const isRight = q.correctIndex === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleQuizSelect(qIdx, optIdx)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                            isSelected
                              ? isRight
                                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold'
                                : 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && (
                            isRight ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. WRITING TAB */}
      {activeTab === 'writing' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span className="bg-slate-800 px-3 py-1 rounded-full text-purple-300 font-bold">
              日式鍵盤造句重組訓練
            </span>
            <span>題目: {writeIdx + 1} / {WRITING_EXERCISES.length}</span>
          </div>

          <div className="space-y-4 text-center max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-white">{currentWrite.prompt}</h3>
            <p className="text-xs text-slate-400">{currentWrite.hint}</p>
          </div>

          {/* Constructed Sentence Drop-zone */}
          <div className="max-w-xl mx-auto bg-slate-950 border-2 border-dashed border-purple-500/40 rounded-2xl p-6 min-h-[90px] flex flex-wrap items-center justify-center gap-2">
            {constructedWords.length === 0 ? (
              <span className="text-xs text-slate-500 font-sans">點擊下方詞塊加入造句...</span>
            ) : (
              constructedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveWord(idx)}
                  className="bg-purple-600 hover:bg-rose-600 text-white font-bold px-4 py-2 rounded-xl text-base shadow-md transition-colors flex items-center space-x-1"
                  title="點擊移除此詞"
                >
                  <span>{word}</span>
                </button>
              ))
            )}
          </div>

          {/* Scrambled Word Pills */}
          <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto">
            {currentWrite.scrambledWords.map((word, idx) => {
              const isUsed = constructedWords.includes(word);
              return (
                <button
                  key={idx}
                  disabled={isUsed}
                  onClick={() => handleAddWordToSentence(word)}
                  className={`px-5 py-3 rounded-2xl font-bold text-base transition-all border ${
                    isUsed
                      ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                      : 'bg-slate-800 hover:bg-purple-950 hover:border-purple-400 text-slate-200 border-slate-700 shadow-md'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 max-w-md mx-auto pt-4">
            <button
              onClick={handleResetWriting}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重新排列</span>
            </button>
            <button
              onClick={handleCheckWriting}
              className="bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold px-8 py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-purple-500/25 flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>送出檢查 (+30 XP)</span>
            </button>
          </div>

          {/* Result explanation */}
          {writeSubmitted && (
            <div className="max-w-xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 text-center">
              <div className="text-sm font-bold text-emerald-400">
                正確句型：{currentWrite.targetJapanese}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{currentWrite.explanation}</p>
              <button
                onClick={() => {
                  setWriteIdx(prev => (prev + 1) % WRITING_EXERCISES.length);
                  handleResetWriting();
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2 rounded-xl"
              >
                換下一題
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
