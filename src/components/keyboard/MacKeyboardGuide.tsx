import React, { useState, useEffect } from 'react';
import { 
  MAC_JIS_SPECIAL_KEYS, 
  MACOS_SETUP_STEPS, 
  MAC_KEYBOARD_LAYOUT_ROWS,
  MAC_IME_SHORTCUTS,
  MacKeyGuideItem 
} from '../../data/macKeyboardGuideData';
import { 
  Keyboard, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Zap, 
  HelpCircle,
  ArrowRight,
  Laptop
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface MacKeyboardGuideProps {
  onGoToTrainer: () => void;
}

// Physical key (KeyboardEvent.code / key) → guide card id + status text
const detectSpecialKey = (e: KeyboardEvent): { id: string; label: string } | null => {
  if (e.code === 'Lang2' || e.key === 'Eisu' || e.code === 'NonConvert') {
    return { id: 'eisu', label: '英数 (Eisu) - 切換成英文輸入！' };
  }
  if (e.code === 'Lang1' || e.key === 'KanaMode' || e.code === 'KanaMode') {
    return { id: 'kana', label: 'かな (Kana) - 切換成日文輸入！' };
  }
  if (e.code === 'Space') return { id: 'space_kanji', label: 'Space - 漢字變換！' };
  if (e.code === 'Enter' || e.code === 'NumpadEnter') return { id: 'return_enter', label: 'Return - 確定輸入！' };
  if (e.code === 'BracketLeft') return { id: 'at_key', label: '@ 鍵 - 免按 Shift！' };
  if (e.code === 'Quote') return { id: 'colon_key', label: ': (冒號鍵) - 免按 Shift！' };
  if (e.code === 'IntlYen') return { id: 'yen_key', label: '¥ (日圓符號鍵)！' };
  if (e.code === 'ControlLeft') return { id: 'control_key', label: 'control (A 鍵左側)！' };
  return null;
};

export const MacKeyboardGuide: React.FC<MacKeyboardGuideProps> = ({ onGoToTrainer }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'setup' | 'shortcuts'>('visual');
  const [selectedKey, setSelectedKey] = useState<MacKeyGuideItem>(MAC_JIS_SPECIAL_KEYS[0]);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [testInput, setTestInput] = useState<string>('');
  const [lastKeyPressedName, setLastKeyPressedName] = useState<string>('尚未按鍵');

  // Real-time physical keyboard detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in text inputs
      if (document.activeElement?.tagName === 'INPUT') return;

      setActiveCode(e.code);
      soundEffects.playKeyClick();

      // Detect special keys
      const special = detectSpecialKey(e);
      const found = special && MAC_JIS_SPECIAL_KEYS.find(k => k.id === special.id);
      if (special && found) {
        setSelectedKey(found);
        setLastKeyPressedName(special.label);
      } else {
        setLastKeyPressedName(`按鍵: ${e.key} (${e.code})`);
      }
    };

    const handleKeyUp = () => {
      setTimeout(() => setActiveCode(null), 180);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const isHighlightedKey = (keyItem: any) => {
    if (!keyItem.highlightId) return false;
    return keyItem.highlightId === selectedKey.id;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
              <Laptop className="w-3.5 h-3.5" />
              <span>Apple MacBook / Magic Keyboard JIS 日式巧控鍵盤專屬指南</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              圖解你的日式鍵盤：<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">零基礎秒懂神級用法</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              恭喜你拿到日式（JIS）鍵盤！它和美式鍵盤最大的不同，就是
              空白鍵兩側的 <span className="text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">英数</span> 與 <span className="text-teal-400 font-bold bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-800">かな</span> 鍵：按哪個就切到哪種語言，不必再用 Control＋Space 猜目前的輸入法。
            </p>
          </div>

          <button
            onClick={onGoToTrainer}
            className="flex-shrink-0 inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-5 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Keyboard className="w-5 h-5" />
            <span>前往 JIS 打字道場特訓</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700/60 mt-8 space-x-2 sm:space-x-4">
          <button
            onClick={() => setActiveTab('visual')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'visual'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>1. 互動鍵盤圖解與神鍵剖析</span>
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'setup'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>2. macOS 日本語輸入法設定教學</span>
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'shortcuts'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>3. 日文輸入法快捷鍵</span>
          </button>
        </div>
      </div>

      {/* TAB 1: VISUAL KEYBOARD INTERACTION */}
      {activeTab === 'visual' && (
        <div className="space-y-6">
          {/* Real-time Pressed Key Status Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-slate-400">實體鍵盤即時感應：</span>
              <span className="text-sm font-mono font-bold text-emerald-300 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                {lastKeyPressedName}
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center space-x-1.5">
              <span>💡 提示：現在試敲你手邊的巧控鍵盤，畫面上的按鍵會同步發光！</span>
            </div>
          </div>

          {/* Interactive Apple Magic Keyboard Visualizer */}
          <div className="bg-slate-950/90 border-2 border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-x-auto">
            <div className="min-w-[820px] mx-auto space-y-2 select-none">
              {MAC_KEYBOARD_LAYOUT_ROWS.map((row, rIdx) => (
                <div key={rIdx} className="flex space-x-1.5 justify-center">
                  {row.map((keyItem: any, kIdx: number) => {
                    // The physical Return key reports a single 'Enter' code for both halves of the inverted L
                    const isPressed = activeCode === keyItem.code || (keyItem.isEnter && activeCode === 'Enter');
                    const isHighlighted = isHighlightedKey(keyItem);

                    // Mac style half-height ▲ / ▼ keys stacked between ◀ and ▶
                    if (keyItem.isArrowStack) {
                      return (
                        <div key={kIdx} className={`flex flex-col space-y-0.5 h-11 ${keyItem.width || 'w-8'}`}>
                          {[['ArrowUp', '▲'], ['ArrowDown', '▼']].map(([code, label]) => (
                            <div
                              key={code}
                              className={`flex-1 rounded-md border flex items-center justify-center text-[9px] font-mono transition-all duration-100 ${
                                activeCode === code
                                  ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                                  : 'bg-slate-900/90 border-slate-800 text-slate-300'
                              }`}
                            >
                              {label}
                            </div>
                          ))}
                        </div>
                      );
                    }

                    // Special styling for inverted L return key
                    if (keyItem.isEnter) {
                      return (
                        <div
                          key={kIdx}
                          onClick={() => {
                            const found = MAC_JIS_SPECIAL_KEYS.find(k => k.id === 'return_enter');
                            if (found) setSelectedKey(found);
                          }}
                          className={`cursor-pointer rounded-lg border flex flex-col items-center justify-center p-1 font-mono transition-all duration-100 ${
                            keyItem.width || 'w-12'
                          } ${
                            isPressed
                              ? 'bg-amber-400 text-slate-950 border-amber-300 scale-95 shadow-lg shadow-amber-400/50'
                              : isHighlighted
                              ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/50'
                              : 'bg-slate-800/90 hover:bg-slate-700/80 border-slate-700 text-slate-200'
                          }`}
                          style={{ height: '44px' }}
                        >
                          <span className="text-[11px] font-bold">{keyItem.label}</span>
                          <span className="text-[9px] text-amber-400">⏎</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={kIdx}
                        onClick={() => {
                          if (keyItem.highlightId) {
                            const found = MAC_JIS_SPECIAL_KEYS.find(k => k.id === keyItem.highlightId);
                            if (found) setSelectedKey(found);
                          }
                        }}
                        className={`cursor-pointer rounded-lg border flex flex-col items-center justify-between py-1 px-1.5 font-mono transition-all duration-100 h-11 ${
                          keyItem.width || 'w-12'
                        } ${
                          isPressed
                            ? 'bg-emerald-400 text-slate-950 border-emerald-300 scale-95 shadow-lg shadow-emerald-400/50'
                            : isHighlighted
                            ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/60 shadow-md shadow-emerald-500/20'
                            : keyItem.isSpecial
                            ? 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 text-slate-300'
                            : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex justify-between w-full text-[9px] text-slate-400 leading-none">
                          <span>{keyItem.shiftLabel || ''}</span>
                          <span className="text-emerald-400/80 font-sans">{keyItem.kanaLabel || ''}</span>
                        </div>
                        <span className={`text-[12px] font-bold leading-none ${isHighlighted ? 'text-emerald-300' : ''}`}>
                          {keyItem.label}
                        </span>
                        <div className="h-1" />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Key In-Depth Breakdown Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Key Selector Pills */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>日式鍵盤專屬核心鍵位一覽</span>
              </div>
              <div className="space-y-1.5">
                {MAC_JIS_SPECIAL_KEYS.map((key) => {
                  const isSelected = selectedKey.id === key.id;
                  return (
                    <button
                      key={key.id}
                      onClick={() => setSelectedKey(key)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500/60 text-white shadow-md'
                          : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm flex items-center space-x-2">
                          <span>{key.name}</span>
                          <span className="text-xs text-slate-500 font-normal">({key.jpName})</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{key.location}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {key.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Detailed Explanation */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-block bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold mb-2 border border-emerald-500/30">
                    {selectedKey.tag}
                  </div>
                  <h3 className="text-2xl font-black text-white">{selectedKey.name}</h3>
                  <p className="text-xs text-emerald-400/90 font-mono mt-0.5">位置：{selectedKey.location}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-mono font-bold">
                  {selectedKey.name.split(' ')[0]}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">按鍵精髓說明</h4>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">{selectedKey.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">如何使用？</h4>
                <ul className="space-y-2">
                  {selectedKey.howToUse.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>實戰範例</span>
                </div>
                <p className="text-sm text-slate-300 font-mono">{selectedKey.example}</p>
              </div>

              {/* Live Sandbox Input */}
              <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-4 space-y-2">
                <label className="block text-xs font-bold text-emerald-300">
                  實機練習輸入框（試試按下鍵盤上的【かな】輸入「nihon」，再按【Space】與【Return】）：
                </label>
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="點擊這裡開始敲鍵盤測試..."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 font-mono text-base outline-none"
                />
                <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                  <span>當前輸入內容長度: {testInput.length} 字元</span>
                  {testInput && (
                    <button
                      onClick={() => setTestInput('')}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      清空
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MACOS SETUP STEP BY STEP */}
      {activeTab === 'setup' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="max-w-2xl space-y-2">
              <h3 className="text-xl font-extrabold text-white">{MACOS_SETUP_STEPS.length} 個步驟在 Mac 啟用日本語輸入法</h3>
              <p className="text-sm text-slate-400">
                macOS 內建最高品質的日本語輸入引擎，不需要安裝任何第三方軟體。照著以下步驟只要 1 分鐘即可設定完畢！
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MACOS_SETUP_STEPS.map((stepItem) => (
                <div
                  key={stepItem.step}
                  className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-4 hover:border-emerald-500/40 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                      0{stepItem.step}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">macOS 13 Ventura 以上</span>
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {stepItem.title}
                  </h4>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {stepItem.desc}
                  </p>

                  {stepItem.tip && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-start space-x-2">
                      <HelpCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{stepItem.tip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-800/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-bold text-white">完成設定了嗎？</div>
                <div className="text-xs text-slate-400">現在按下實體鍵盤的【かな】鍵，到打字道場挑戰假名與問候語吧！</div>
              </div>
              <button
                onClick={onGoToTrainer}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center space-x-1.5"
              >
                <span>立即開始打字練習</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POWER SHORTCUTS */}
      {activeTab === 'shortcuts' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-xl font-extrabold text-white">Mac 日本語輸入法常用快捷鍵</h3>
            <p className="text-sm text-slate-400">
              這些快捷鍵要在文字「還有底線、尚未按 Return 確定」時使用，可以把整段直接轉換成需要的文字種類。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MAC_IME_SHORTCUTS.map((shortcut) => (
              <div key={shortcut.keys} className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-emerald-400 font-mono font-bold text-sm">{shortcut.keys}</div>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded whitespace-nowrap">{shortcut.badge}</span>
                </div>
                <div className="text-sm font-bold text-white">{shortcut.title}</div>
                <p className="text-xs text-slate-400">{shortcut.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-start space-x-2">
            <HelpCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>MacBook 的 F6～F10 預設是亮度、音量等功能鍵，要同時按住 fn（🌐）才會變成 F 鍵。</p>
              <p>Control＋Shift＋J／K 是切換「輸入模式」（之後打的字都會是平假名／片假名），和上面「轉換已輸入文字」的 Control＋J／K 不同。</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
