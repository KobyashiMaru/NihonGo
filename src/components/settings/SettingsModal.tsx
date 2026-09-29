import React from 'react';
import { UserProgress } from '../../types';
import { X, Sparkles, Volume2, Key, Sliders, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProgress,
}) => {
  if (!isOpen) return null;

  const { settings } = progress;

  const updateSetting = (key: keyof typeof settings, val: any) => {
    const updated: UserProgress = {
      ...progress,
      settings: {
        ...progress.settings,
        [key]: val,
      },
    };
    onUpdateProgress(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">學習與通話偏好設定</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Speech Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">日語發音語速 (TTS)</span>
              <span className="text-indigo-400 font-mono font-bold">{settings.speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.2"
              step="0.05"
              value={settings.speechRate}
              onChange={(e) => updateSetting('speechRate', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.6x (超慢速)</span>
              <span>0.85x (新手推薦)</span>
              <span>1.2x (母語標準速)</span>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between cursor-pointer p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">通話中預設顯示振假名（讀音）</span>
              <input
                type="checkbox"
                checked={settings.showFurigana}
                onChange={(e) => updateSetting('showFurigana', e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">通話中預設顯示羅馬字（拼音）</span>
              <input
                type="checkbox"
                checked={settings.showRomaji}
                onChange={(e) => updateSetting('showRomaji', e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">通話中預設顯示中文翻譯</span>
              <input
                type="checkbox"
                checked={settings.showTranslation}
                onChange={(e) => updateSetting('showTranslation', e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
            </label>
          </div>

          {/* Optional Gemini API Key */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Google Gemini API Key (可選・無限自由自由會話)</span>
            </div>
            <input
              type="password"
              value={settings.geminiApiKey || ''}
              onChange={(e) => updateSetting('geminiApiKey', e.target.value)}
              placeholder="預設已內建智慧通話樹，若有 API Key 可在此填入"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-400 font-mono"
            />
            <p className="text-[10px] text-slate-500">
              留空時將使用內建離線高速對話決策樹與原生 Web Speech 語音，完全免費無限制！
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition-colors"
        >
          儲存並返回
        </button>
      </div>
    </div>
  );
};
