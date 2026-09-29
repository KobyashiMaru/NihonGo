// User Progress and LocalStorage Persistence

import { UserProgress } from '../types';

const STORAGE_KEY = 'nihongo_user_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  xp: 120,
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessons: ['m0-1'],
  masteredKana: ['あ', 'い', 'う', 'え', 'お'],
  callStats: {
    totalCalls: 0,
    totalMinutes: 0,
    averageScore: 92,
  },
  currentLevel: 'N5',
  settings: {
    autoSpeak: true,
    speechRate: 0.85,
    showFurigana: true,
    showRomaji: true,
    showTranslation: true,
    micEnabled: true,
  },
};

export const loadUserProgress = (): UserProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      settings: {
        ...DEFAULT_PROGRESS.settings,
        ...(parsed.settings || {}),
      },
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
};

export const saveUserProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }
};

export const addXP = (current: UserProgress, amount: number): UserProgress => ({
  ...current,
  xp: current.xp + amount,
});
