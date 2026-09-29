import React from 'react';
import { JLPT_STAGES, JLPTStage } from '../../data/jlptCurriculum';
import { UserProgress } from '../../types';
import { 
  Map, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Award, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  Crown
} from 'lucide-react';

interface RoadmapScreenProps {
  progress: UserProgress;
  onSelectModule: (type: string) => void;
}

export const RoadmapScreen: React.FC<RoadmapScreenProps> = ({ progress, onSelectModule }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-800/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold text-amber-300">
            <Map className="w-3.5 h-3.5" />
            <span>通往 JLPT N3 / N2 認證之路</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">學習闖關升級地圖</h2>
          <p className="text-slate-300 text-sm max-w-xl">
            從 0 基礎五十音與日式鍵盤打字起步，循序漸進解鎖 N5、N4，最終邁向 N3 / N2 日語達人境界！
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <div className="text-xs text-slate-400">目前累積總經驗值</div>
          <div className="text-2xl font-black text-amber-400 font-mono">{progress.xp} XP</div>
          <div className="text-xs text-slate-500">當前進度：{progress.currentLevel}</div>
        </div>
      </div>

      {/* Stage Progression Timeline */}
      <div className="space-y-8 relative">
        {/* Connecting Vertical Line */}
        <div className="hidden lg:block absolute left-8 top-10 bottom-10 w-1 bg-gradient-to-b from-emerald-500 via-amber-500 to-slate-800 z-0" />

        {JLPT_STAGES.map((stage, idx) => {
          const isUnlocked = progress.xp >= stage.requiredXp;
          const isCurrent = isUnlocked && (idx === JLPT_STAGES.length - 1 || progress.xp < JLPT_STAGES[idx + 1]?.requiredXp);

          return (
            <div
              key={stage.id}
              className={`relative z-10 bg-slate-900/80 border rounded-3xl p-6 sm:p-8 transition-all ${
                isCurrent
                  ? 'border-amber-500/60 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/20'
                  : isUnlocked
                  ? 'border-slate-800'
                  : 'border-slate-800/50 opacity-75'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Stage Info */}
                <div className="flex items-start space-x-4">
                  {/* Stage Icon Node */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-bold shadow-lg ${
                      isCurrent
                        ? 'bg-gradient-to-tr from-amber-500 to-emerald-400 text-slate-950'
                        : isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isUnlocked ? (
                      stage.level === 'JLPT N2' ? <Crown className="w-7 h-7" /> : idx + 1
                    ) : (
                      <Lock className="w-6 h-6" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded">
                        {stage.level}
                      </span>
                      {isCurrent && (
                        <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40 animate-pulse">
                          當前挑戰中
                        </span>
                      )}
                      {!isUnlocked && (
                        <span className="text-xs text-slate-500 flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span>需 {stage.requiredXp} XP 解鎖</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white">{stage.name}</h3>
                    <p className="text-xs text-amber-400/90 font-medium">{stage.subtitle}</p>
                    <p className="text-sm text-slate-300 max-w-2xl leading-relaxed pt-1">
                      {stage.description}
                    </p>
                  </div>
                </div>

                {/* Scope & Vocab Target */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                  <div className="text-left lg:text-right">
                    <div className="text-xs text-slate-500 font-mono">詞彙累積目標</div>
                    <div className="text-base font-bold text-slate-200">{stage.vocabularyCount} 字</div>
                  </div>
                  <div className="text-left lg:text-right lg:mt-2">
                    <div className="text-xs text-slate-500 font-mono">課程單元數</div>
                    <div className="text-sm font-bold text-slate-300">{stage.modules.length} 個模組</div>
                  </div>
                </div>
              </div>

              {/* Modules List inside Stage */}
              <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {stage.modules.map((mod) => (
                  <div
                    key={mod.id}
                    onClick={() => {
                      if (isUnlocked) onSelectModule(mod.type);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all text-left ${
                      isUnlocked
                        ? 'bg-slate-950/70 hover:bg-slate-800/70 border-slate-800 hover:border-amber-500/50 cursor-pointer group'
                        : 'bg-slate-950/30 border-slate-800/30 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-slate-500">{mod.type.toUpperCase()}</span>
                      <span className="text-[10px] font-bold text-amber-400">+{mod.xpReward} XP</span>
                    </div>
                    <div className={`text-xs font-bold ${isUnlocked ? 'text-white group-hover:text-amber-300' : 'text-slate-600'}`}>
                      {mod.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">{mod.desc}</div>
                  </div>
                ))}
              </div>

              {/* Grammar Points Focus */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[11px] text-slate-500 mr-1">焦點語法：</span>
                {stage.grammarFocus.map((g, gi) => (
                  <span key={gi} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded-md border border-slate-800">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
