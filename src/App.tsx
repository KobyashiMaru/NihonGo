import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { MacKeyboardGuide } from './components/keyboard/MacKeyboardGuide';
import { JISKeyboardTrainer } from './components/keyboard/JISKeyboardTrainer';
import { KanaFlashcards } from './components/kana/KanaFlashcards';
import { VideoCallScreen } from './components/videocall/VideoCallScreen';
import { FourSkillsHub } from './components/skills/FourSkillsHub';
import { RoadmapScreen } from './components/roadmap/RoadmapScreen';
import { SettingsModal } from './components/settings/SettingsModal';
import { loadUserProgress, saveUserProgress, addXP } from './services/storageService';
import { soundEffects } from './services/soundEffects';
import { speechService } from './services/speechService';
import { UserProgress } from './types';

// Loaded on first visit: keeps the Markdown renderer and sanitizer out of the main bundle
const LearningLibrary = lazy(() =>
  import('./components/library/LearningLibrary').then(m => ({ default: m.LearningLibrary }))
);

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('mac-keyboard');
  // Document another module asked the library to open (e.g. the kana origin table)
  const [libraryDocId, setLibraryDocId] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync progress changes to localStorage
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Apply the user's preferred TTS speed everywhere
  useEffect(() => {
    speechService.setDefaultRate(progress.settings.speechRate);
  }, [progress.settings.speechRate]);

  useEffect(() => {
    soundEffects.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const handleUpdateProgress = (updated: UserProgress) => {
    setProgress(updated);
  };

  // Functional update so several rewards in a row are never lost
  const handleEarnXP = (amount: number) => {
    setProgress(prev => addXP(prev, amount));
  };

  const openTab = (tab: NavTab) => {
    setLibraryDocId(null);
    setCurrentTab(tab);
  };

  const openDocument = (docId: string) => {
    setLibraryDocId(docId);
    setCurrentTab('library');
  };

  const handleToggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        progress={progress}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGuide={() => setCurrentTab('mac-keyboard')}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={openTab}
        />

        {/* Viewport for Current Module */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'kana-flashcards' && (
            <KanaFlashcards onEarnXP={handleEarnXP} onOpenDocument={openDocument} />
          )}

          {currentTab === 'mac-keyboard' && (
            <MacKeyboardGuide onGoToTrainer={() => setCurrentTab('keyboard-trainer')} />
          )}

          {currentTab === 'keyboard-trainer' && (
            <JISKeyboardTrainer onEarnXP={handleEarnXP} />
          )}

          {currentTab === 'video-call' && (
            <VideoCallScreen onEarnXP={handleEarnXP} settings={progress.settings} />
          )}

          {currentTab === 'four-skills' && (
            <FourSkillsHub onEarnXP={handleEarnXP} />
          )}

          {currentTab === 'library' && (
            <Suspense fallback={<div className="text-center text-sm text-slate-500 py-20">正在開啟學習資料庫…</div>}>
              <LearningLibrary key={libraryDocId ?? 'library'} initialDocId={libraryDocId} />
            </Suspense>
          )}

          {currentTab === 'roadmap' && (
            <RoadmapScreen
              progress={progress}
              onSelectModule={(type) => {
                if (type === 'kana') setCurrentTab('kana-flashcards');
                else if (type === 'keyboard') setCurrentTab('keyboard-trainer');
                else if (type === 'conversation') setCurrentTab('video-call');
                else setCurrentTab('four-skills');
              }}
            />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        progress={progress}
        onUpdateProgress={handleUpdateProgress}
      />
    </div>
  );
}

export default App;
