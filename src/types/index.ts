// Types for Japanese Learning Platform

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2';

export interface JISKey {
  code: string;           // KeyboardEvent.code (e.g. 'KeyA', 'Convert', 'NonConvert', 'KanaMode')
  label: string;          // Main label displayed on keycap (e.g. 'A', 'かな', '英数')
  shiftLabel?: string;    // Shift symbol (e.g. '!', '"')
  kanaLabel?: string;     // Kana printed on Japanese keycap (e.g. 'ち', 'あ')
  width?: string;         // Tailwind width class (e.g. 'w-12', 'w-16', 'flex-1')
  height?: string;
  isSpecial?: boolean;    // Mac JIS special key (英数, かな, Return, etc.)
  macFeature?: string;    // Explanation of what it does on Mac
  isEnter?: boolean;      // Upside-down L return key
}

export interface KanaCharacter {
  hiragana: string;
  katakana: string;
  romaji: string;
  group: 'vowels' | 'k' | 's' | 't' | 'n' | 'h' | 'm' | 'y' | 'r' | 'w' | 'n_single' | 'dakuten' | 'handakuten' | 'yoon';
  exampleWord: string;
  exampleFurigana: string;
  exampleRomaji: string;
  exampleMeaning: string;
}

export interface VocabularyWord {
  id: string;
  kanji?: string;
  kana: string;
  romaji: string;
  meaning: string;
  level: JLPTLevel;
  category: string;
  exampleJa: string;
  exampleZh: string;
  exampleRomaji: string;
}

export interface DialogueNode {
  id: string;
  tutorSpeech: string;
  tutorFurigana: string;
  tutorRomaji: string;
  tutorTranslation: string;
  expectedKeywords?: string[];
  suggestedResponses: {
    label: string;
    japanese: string;
    furigana: string;
    romaji: string;
    meaning: string;
    nextNodeId: string;
    xp: number;
  }[];
  defaultNextNodeId?: string;
}

export interface CallScenario {
  id: string;
  title: string;
  titleJa: string;
  category: string;
  description: string;
  level: JLPTLevel;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tutorName: string;
  tutorAvatar: string;
  tutorRole: string;
  background: string;
  startNodeId: string;
  nodes: Record<string, DialogueNode>;
  keyVocabulary: { word: string; reading: string; meaning: string }[];
  grammarPoints: { title: string; pattern: string; explanation: string }[];
}

export interface ChatMessage {
  id: string;
  sender: 'tutor' | 'user' | 'system';
  japanese: string;
  furigana?: string;
  romaji?: string;
  translation?: string;
  timestamp: number;
  score?: number; // speaking score 0-100
}

export interface FourSkillsLesson {
  id: string;
  title: string;
  level: JLPTLevel;
  type: 'listening' | 'speaking' | 'reading' | 'writing';
  description: string;
  content: any;
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  masteredKana: string[];
  callStats: {
    totalCalls: number;
    totalMinutes: number;
    averageScore: number;
  };
  currentLevel: JLPTLevel;
  settings: {
    autoSpeak: boolean;
    speechRate: number; // 0.7 to 1.2
    showFurigana: boolean;
    showRomaji: boolean;
    showTranslation: boolean;
    micEnabled: boolean;
    geminiApiKey?: string;
  };
}
