import React from 'react';
import { UserProgress } from '../../types';
import { Flame, Sparkles, Volume2, VolumeX, ShieldAlert, Award } from 'lucide-react';

interface NavbarProps {
  progress: UserProgress;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  onOpenSettings,
  onOpenGuide,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3 lg:py-0 lg:h-(--navbar-height) lg:flex lg:items-center">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onOpenGuide}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white font-black text-xl">
            日
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-white tracking-wide">NihonGo!</span>
              <span className="text-xs bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded-full border border-rose-500/30">
                日語通
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">專為日式鍵盤與零基礎打造的日語學習站</p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* JLPT Target */}
          <div className="hidden md:flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">當前階段:</span>
            <span className="text-xs font-bold text-amber-400">{progress.currentLevel} (目標 N3/N2)</span>
          </div>

          {/* XP */}
          <div className="flex items-center space-x-1.5 bg-indigo-950/60 border border-indigo-700/50 px-3 py-1.5 rounded-lg shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-bold text-indigo-200">{progress.xp}</span>
            <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-semibold">XP</span>
          </div>

          {/* Streak */}
          <div className="flex items-center space-x-1.5 bg-amber-950/60 border border-amber-700/50 px-3 py-1.5 rounded-lg shadow-sm">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span className="text-xs font-bold text-amber-200">{progress.streak}</span>
            <span className="text-[10px] text-amber-400 hidden sm:inline">天連續</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? '音效已開啟' : '音效已靜音'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors font-medium"
          >
            設定
          </button>
        </div>
      </div>
    </header>
  );
};
