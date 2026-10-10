import React from 'react';
import { 
  Keyboard, 
  Video, 
  Headphones, 
  Map, 
  BookOpen, 
  HelpCircle,
  Sparkles,
  Layers,
  Library
} from 'lucide-react';

export type NavTab = 'kana-flashcards' | 'mac-keyboard' | 'keyboard-trainer' | 'video-call' | 'four-skills' | 'roadmap' | 'library';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navItems = [
    {
      id: 'kana-flashcards' as NavTab,
      label: '五十音單字卡',
      sublabel: '翻卡背誦與間隔複習',
      icon: Layers,
      badge: '零基礎',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      activeColor: 'from-pink-600/30 to-rose-600/10 border-pink-500/50 text-pink-400',
    },
    {
      id: 'mac-keyboard' as NavTab,
      label: 'Mac 日式鍵盤圖解',
      sublabel: '巧控鍵盤入門',
      icon: Keyboard,
      badge: '必讀新手',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      activeColor: 'from-emerald-600/30 to-teal-600/10 border-emerald-500/50 text-emerald-400',
    },
    {
      id: 'video-call' as NavTab,
      label: 'AI 擬真視訊通話',
      sublabel: 'Duolingo式互動會話',
      icon: Video,
      badge: '熱門',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      activeColor: 'from-rose-600/30 to-pink-600/10 border-rose-500/50 text-rose-400',
    },
    {
      id: 'keyboard-trainer' as NavTab,
      label: 'JIS 打字特訓道場',
      sublabel: '五十音與漢字轉換',
      icon: BookOpen,
      activeColor: 'from-sky-600/30 to-blue-600/10 border-sky-500/50 text-sky-400',
    },
    {
      id: 'four-skills' as NavTab,
      label: '聽說讀寫四維訓練',
      sublabel: '發音影子與聽力測驗',
      icon: Headphones,
      activeColor: 'from-purple-600/30 to-indigo-600/10 border-purple-500/50 text-purple-400',
    },
    {
      id: 'roadmap' as NavTab,
      label: 'JLPT 闖關升級地圖',
      sublabel: 'N5 → N3 / N2 藍圖',
      icon: Map,
      activeColor: 'from-amber-600/30 to-orange-600/10 border-amber-500/50 text-amber-400',
    },
    {
      id: 'library' as NavTab,
      label: '學習資料庫',
      sublabel: '講義・筆記・對照表',
      icon: Library,
      activeColor: 'from-cyan-600/30 to-teal-600/10 border-cyan-500/50 text-cyan-400',
    },
  ];

  return (
    // On desktop the sidebar stays in place under the navbar while the page scrolls
    <aside className="w-full lg:w-64 bg-slate-900/60 lg:sticky lg:top-(--navbar-height) lg:self-start lg:h-[calc(100vh-var(--navbar-height))] lg:overflow-y-auto lg:overflow-x-hidden border-b lg:border-b-0 lg:border-r border-slate-800 p-3 lg:p-4 flex lg:flex-col justify-between overflow-x-auto">
      <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 w-full">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 hidden lg:block">
          學習模組
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-shrink-0 flex items-center justify-between px-3.5 py-3 rounded-xl border transition-all text-left group ${
                isActive
                  ? `bg-gradient-to-r ${item.activeColor} shadow-md`
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold flex items-center space-x-1.5">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${item.badgeColor} font-bold`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 hidden sm:block">{item.sublabel}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Zero Basis & Keyboard Support Tip */}
      <div className="hidden lg:block bg-gradient-to-br from-indigo-950/40 to-slate-900/60 rounded-xl p-3 border border-indigo-900/40 mt-4">
        <div className="flex items-center space-x-2 text-indigo-300 font-semibold text-xs mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>新手起步指南</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          還不認識假名？先到「五十音單字卡」每天背一行，再到「Mac 日式鍵盤圖解」學打字，最後前往「AI 視訊通話」開口說日語！
        </p>
      </div>
    </aside>
  );
};
