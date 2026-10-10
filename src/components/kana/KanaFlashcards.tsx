import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Layers,
  ListChecks,
  Ear,
  Keyboard,
  CalendarClock,
  GraduationCap,
  Trophy,
  RotateCcw,
  Repeat,
  ChevronLeft,
  Volume2,
  VolumeX,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { KANA_ROWS, ALL_KANA_KEYS, KanaRow, KanaScript, rowKana, inScript, toKatakana, getKanaCard } from '../../data/kanaFlashcardData';
import { KANA_ORIGINS_DOC_ID } from '../../data/learningDocs';
import {
  KanaPrefs,
  KanaSrsState,
  KanaStudyMode,
  MasteryLevel,
  loadKanaPrefs,
  saveKanaPrefs,
  loadKanaSrs,
  saveKanaSrs,
  reviewKanaCard,
  getMastery,
  isKanaDue,
  kanaCardId,
  buildKanaQueue,
  shuffle,
} from '../../services/kanaSrsService';
import { speechService } from '../../services/speechService';
import { soundEffects } from '../../services/soundEffects';
import { KanaStudySession, KanaSessionResult } from './KanaStudySession';

interface KanaFlashcardsProps {
  onEarnXP: (amount: number) => void;
  onOpenDocument: (docId: string) => void;
}

interface ActiveSession {
  id: number;
  script: KanaScript;
  mode: KanaStudyMode;
  queue: string[];
  pool: string[];
}

const MODES: { id: KanaStudyMode; title: string; desc: string; hint: string; icon: React.ElementType }[] = [
  { id: 'flip', title: '翻卡記憶', desc: '看字回想讀音，翻面對答案並自評。', hint: '第一次學新字從這裡開始', icon: Layers },
  { id: 'choice', title: '看字選音', desc: '看假名，從 4 個羅馬拼音中選出正確讀音。', hint: '確認真的認得', icon: ListChecks },
  { id: 'listen', title: '聽音辨字', desc: '聽發音，從 4 個假名中找出正確的字。', hint: '練耳朵與字形連結', icon: Ear },
  { id: 'type', title: '看字打拼音', desc: '看假名，用鍵盤打出羅馬拼音。', hint: '直接對應日文輸入法', icon: Keyboard },
];

const SIZE_OPTIONS = [
  { value: 10, label: '10 張' },
  { value: 20, label: '20 張' },
  { value: 0, label: '全部' },
];

const MASTERY_STYLES: Record<MasteryLevel, { cell: string; dot: string; label: string }> = {
  new: { cell: 'bg-slate-950/70 border-slate-800 text-slate-300', dot: 'bg-slate-600', label: '未學' },
  learning: { cell: 'bg-rose-950/50 border-rose-700/60 text-rose-100', dot: 'bg-rose-500', label: '學習中' },
  familiar: { cell: 'bg-amber-950/40 border-amber-600/60 text-amber-100', dot: 'bg-amber-400', label: '熟悉中' },
  mastered: { cell: 'bg-emerald-950/50 border-emerald-500/60 text-emerald-100', dot: 'bg-emerald-400', label: '已掌握' },
};

export const KanaFlashcards: React.FC<KanaFlashcardsProps> = ({ onEarnXP, onOpenDocument }) => {
  const [prefs, setPrefs] = useState<KanaPrefs>(loadKanaPrefs);
  const [srs, setSrs] = useState<KanaSrsState>(loadKanaSrs);
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [result, setResult] = useState<(KanaSessionResult & { xp: number; session: ActiveSession }) | null>(null);
  // Snapshot of "now" for due counts; refreshed whenever the menu is shown again
  const [now, setNow] = useState(Date.now);
  const sessionCountRef = useRef(0);

  useEffect(() => saveKanaPrefs(prefs), [prefs]);
  useEffect(() => saveKanaSrs(srs), [srs]);

  // The start button sits at the bottom of a long menu; show each new screen from the top
  const screenKey = session ? `session-${session.id}` : result ? 'summary' : 'menu';
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [screenKey]);

  const updatePrefs = (patch: Partial<KanaPrefs>) => setPrefs(prev => ({ ...prev, ...patch }));
  const { script } = prefs;
  const masteryOf = (key: string) => getMastery(srs[kanaCardId(script, key)]);

  const selectedKeys = useMemo(
    () => KANA_ROWS.filter(r => prefs.rows.includes(r.id)).flatMap(rowKana),
    [prefs.rows]
  );
  const dueKeys = ALL_KANA_KEYS.filter(k => isKanaDue(srs[kanaCardId(script, k)], now));
  const counts = ALL_KANA_KEYS.reduce<Record<MasteryLevel, number>>(
    (acc, k) => ({ ...acc, [masteryOf(k)]: acc[masteryOf(k)] + 1 }),
    { new: 0, learning: 0, familiar: 0, mastered: 0 }
  );
  const sessionSize = prefs.size > 0 ? Math.min(prefs.size, selectedKeys.length) : selectedKeys.length;

  const startSession = (queue: string[], pool: string[]) => {
    if (queue.length === 0) return;
    setResult(null);
    sessionCountRef.current += 1;
    setSession({ id: sessionCountRef.current, script, mode: prefs.mode, queue, pool });
  };

  const startSelected = () => startSession(buildKanaQueue(selectedKeys, script, srs, prefs.size), selectedKeys);

  const startDueReview = () => {
    const pool = [...new Set([...selectedKeys, ...dueKeys])];
    startSession(shuffle(dueKeys), pool);
  };

  const handleReview = (key: string, correct: boolean) => {
    if (!session) return;
    setSrs(prev => reviewKanaCard(prev, kanaCardId(session.script, key), correct));
  };

  const handleFinish = (res: KanaSessionResult) => {
    if (!session) return;
    const xp = 10 + res.firstTryCorrect * 2;
    onEarnXP(xp);
    soundEffects.playVictory();
    if (res.firstTryCorrect / res.total >= 0.8) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
    setResult({ ...res, xp, session });
    setSession(null);
    setNow(Date.now());
  };

  const backToMenu = () => {
    setSession(null);
    setResult(null);
    setNow(Date.now());
  };

  const toggleRow = (row: KanaRow) => {
    updatePrefs({
      rows: prefs.rows.includes(row.id) ? prefs.rows.filter(id => id !== row.id) : [...prefs.rows, row.id],
    });
  };

  const selectKind = (kind: KanaRow['kind']) => {
    const ids = KANA_ROWS.filter(r => r.kind === kind).map(r => r.id);
    updatePrefs({ rows: [...new Set([...prefs.rows, ...ids])] });
  };

  // ---------- Active session ----------
  if (session) {
    return (
      <div className="max-w-3xl mx-auto pb-12">
        <KanaStudySession
          key={session.id}
          script={session.script}
          mode={session.mode}
          queue={session.queue}
          pool={session.pool}
          autoSpeak={prefs.autoSpeak}
          onToggleAutoSpeak={() => updatePrefs({ autoSpeak: !prefs.autoSpeak })}
          onReview={handleReview}
          onFinish={handleFinish}
          onExit={backToMenu}
        />
      </div>
    );
  }

  // ---------- Session summary ----------
  if (result) {
    const accuracy = Math.round((result.firstTryCorrect / result.total) * 100);
    return (
      <div className="max-w-2xl mx-auto pb-12">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-amber-400 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Trophy className="w-10 h-10 text-slate-950" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-white">這一輪背完了！</h3>
            <p className="text-slate-400 text-sm">答錯的字已排進複習，系統會在適當的時間再考你一次。</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
              <div className="text-2xl font-black text-white">{result.total}</div>
              <div className="text-[11px] text-slate-400">本輪卡片</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
              <div className="text-2xl font-black text-emerald-400">{accuracy}%</div>
              <div className="text-[11px] text-slate-400">一次答對率</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
              <div className="text-2xl font-black text-amber-400">+{result.xp}</div>
              <div className="text-[11px] text-slate-400">獲得 XP</div>
            </div>
          </div>

          {result.missed.length > 0 && (
            <div className="text-left space-y-2">
              <div className="text-xs font-bold text-rose-300">這些字要再加強（點一下聽發音）</div>
              <div className="flex flex-wrap gap-2">
                {result.missed.map(key => {
                  const card = getKanaCard(key, result.session.script);
                  return (
                    <button
                      key={key}
                      onClick={() => speechService.speak(key)}
                      className="w-14 bg-rose-950/30 border border-rose-800/60 hover:border-rose-500 rounded-xl py-1.5 text-center"
                    >
                      <div className="text-2xl font-black text-white">{card.char}</div>
                      <div className="text-[10px] font-mono text-rose-300">{card.romaji}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {result.missed.length > 0 && (
              <button
                onClick={() => startSession(shuffle(result.missed), result.session.pool)}
                className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>只練答錯的 {result.missed.length} 張</span>
              </button>
            )}
            <button
              onClick={startSelected}
              className="bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm transition-colors flex items-center space-x-2"
            >
              <Repeat className="w-4 h-4" />
              <span>再來一輪</span>
            </button>
            <button
              onClick={backToMenu}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-3 rounded-xl text-sm transition-colors flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>回到選單</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Menu ----------
  const renderRow = (row: KanaRow) => {
    const isSelected = prefs.rows.includes(row.id);
    const keys = rowKana(row);
    const learned = keys.filter(k => masteryOf(k) !== 'new').length;
    return (
      <div key={row.id} className="flex items-stretch gap-2">
        <button
          onClick={() => toggleRow(row)}
          className={`w-20 sm:w-24 flex-shrink-0 rounded-xl border px-2 py-1.5 text-left transition-all ${
            isSelected
              ? 'bg-pink-500/15 border-pink-500/60 text-pink-200'
              : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <span
              className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                isSelected ? 'bg-pink-500 border-pink-400 text-slate-950' : 'border-slate-600'
              }`}
            >
              {isSelected && '✓'}
            </span>
            <span className="text-sm font-bold">{script === 'hiragana' ? row.label : toKatakana(row.label)}</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">學過 {learned}/{keys.length}</div>
        </button>
        <div className="flex-1 grid grid-cols-5 gap-1.5 sm:gap-2">
          {row.cells.map((key, i) => {
            if (!key) return <div key={i} />;
            const card = getKanaCard(key, script);
            const style = MASTERY_STYLES[masteryOf(key)];
            return (
              <button
                key={key}
                onClick={() => speechService.speak(key)}
                title={`${card.char}（${card.romaji}）・${style.label}`}
                className={`rounded-xl border py-1 text-center transition-transform hover:scale-105 ${style.cell}`}
              >
                <div className="text-lg sm:text-xl font-bold leading-tight">{card.char}</div>
                <div className="text-[9px] sm:text-[10px] font-mono opacity-70">{card.romaji}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-950/50 via-slate-900 to-slate-900 border border-pink-900/40 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-pink-400 font-bold text-xs uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>零基礎第一步・間隔重複記憶法</span>
            </div>
            <h2 className="text-2xl font-black text-white">五十音單字卡</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              一次背一行就好！答錯的字會很快再出現，答對的字會隔一天、三天、一週再考你，用最少時間記得最牢。
            </p>
            <button
              onClick={() => onOpenDocument(KANA_ORIGINS_DOC_ID)}
              className="mt-3 inline-flex items-center space-x-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/30 border border-cyan-800/50 rounded-lg px-3 py-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>查看完整「五十音漢字字源對照表」</span>
            </button>
          </div>

          {/* Script toggle */}
          <div className="flex bg-slate-950/80 border border-slate-800 rounded-2xl p-1 self-start md:self-center">
            {(['hiragana', 'katakana'] as KanaScript[]).map(s => (
              <button
                key={s}
                onClick={() => updatePrefs({ script: s })}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  script === s ? 'bg-pink-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s === 'hiragana' ? '平假名 あ' : '片假名 ア'}
              </button>
            ))}
          </div>
        </div>

        {/* Mastery stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['mastered', 'familiar', 'learning', 'new'] as MasteryLevel[]).map(level => (
            <div key={level} className="bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                <span className={`w-2 h-2 rounded-full ${MASTERY_STYLES[level].dot}`} />
                <span>{MASTERY_STYLES[level].label}</span>
              </div>
              <div className="text-xl font-black text-white mt-0.5">
                {counts[level]}
                <span className="text-xs text-slate-500 font-normal"> / {ALL_KANA_KEYS.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Due review reminder */}
      {dueKeys.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-950/30 border border-amber-700/50 rounded-2xl px-5 py-4">
          <div className="flex items-center space-x-3">
            <CalendarClock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-amber-200">有 {dueKeys.length} 張卡片到了複習時間</div>
              <div className="text-xs text-amber-200/60">
                {dueKeys.slice(0, 12).map(k => inScript(k, script)).join(' ')}
                {dueKeys.length > 12 && ' …'}
              </div>
            </div>
          </div>
          <button
            onClick={startDueReview}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-colors flex-shrink-0"
          >
            立即複習（{MODES.find(m => m.id === prefs.mode)?.title}）
          </button>
        </div>
      )}

      {/* Step 1: rows */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">① 選擇要背的行</h3>
            <p className="text-xs text-slate-400 mt-0.5">建議一次加一行，等前面的字大多變成黃色或綠色再加下一行。點假名可以聽發音。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => selectKind('seion')} className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
              清音全選
            </button>
            <button onClick={() => selectKind('dakuon')} className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
              濁音・半濁音全選
            </button>
            <button onClick={() => updatePrefs({ rows: [] })} className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700">
              清除
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
          {(Object.keys(MASTERY_STYLES) as MasteryLevel[]).map(level => (
            <span key={level} className="flex items-center space-x-1">
              <span className={`w-2.5 h-2.5 rounded-sm ${MASTERY_STYLES[level].dot}`} />
              <span>{MASTERY_STYLES[level].label}</span>
            </span>
          ))}
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">清音</div>
          {KANA_ROWS.filter(r => r.kind === 'seion').map(renderRow)}
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pt-3">濁音・半濁音</div>
          {KANA_ROWS.filter(r => r.kind === 'dakuon').map(renderRow)}
        </div>
      </div>

      {/* Step 2: mode */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <h3 className="text-base font-bold text-white">② 選擇練習方式</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODES.map(m => {
            const Icon = m.icon;
            const isActive = prefs.mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => updatePrefs({ mode: m.id })}
                className={`flex items-start space-x-3 text-left rounded-2xl border p-4 transition-all ${
                  isActive
                    ? 'bg-pink-500/10 border-pink-500/60 ring-2 ring-pink-500/20'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className={`p-2 rounded-xl ${isActive ? 'bg-pink-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{m.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{m.desc}</div>
                  <div className="text-[11px] text-pink-300/80 mt-1">{m.hint}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: start */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-white">③ 每輪張數</span>
          <div className="flex bg-slate-950/80 border border-slate-800 rounded-xl p-1">
            {SIZE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => updatePrefs({ size: opt.value })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  prefs.size === opt.value ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => updatePrefs({ autoSpeak: !prefs.autoSpeak })}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white"
          >
            {prefs.autoSpeak ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4" />}
            <span>自動發音{prefs.autoSpeak ? '開' : '關'}</span>
          </button>
        </div>
        <button
          onClick={startSelected}
          disabled={selectedKeys.length === 0}
          className="bg-pink-500 hover:bg-pink-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black px-6 py-3 rounded-2xl text-sm transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-pink-500/20 disabled:shadow-none"
        >
          <span>{selectedKeys.length === 0 ? '請先選擇要背的行' : `開始背誦・${sessionSize} 張`}</span>
          {selectedKeys.length > 0 && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
