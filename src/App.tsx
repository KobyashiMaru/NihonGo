import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { MacKeyboardGuide } from './components/keyboard/MacKeyboardGuide';
import { JISKeyboardTrainer } from './components/keyboard/JISKeyboardTrainer';
import { VideoCallScreen } from './components/videocall/VideoCallScreen';
import { FourSkillsHub } from './components/skills/FourSkillsHub';
import { RoadmapScreen } from './components/roadmap/RoadmapScreen';
import { SettingsModal } from './components/settings/SettingsModal';
import { loadUserProgress, saveUserProgress, addXP } from './services/storageService';
import { soundEffects } from './services/soundEffects';
import { speechService } from './services/speechService';
import { UserProgress } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('mac-keyboard');
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
          onSelectTab={(tab) => setCurrentTab(tab)}
        />

        {/* Viewport for Current Module */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
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

          {currentTab === 'roadmap' && (
            <RoadmapScreen
              progress={progress}
              onSelectModule={(type) => {
                if (type === 'keyboard') setCurrentTab('keyboard-trainer');
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
