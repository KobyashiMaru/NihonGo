// Kana Flashcard Spaced Repetition (Leitner boxes) and preferences, persisted in localStorage

import { KanaScript } from '../data/kanaFlashcardData';

export interface KanaCardState {
  box: number;      // 0 = never studied … MAX_BOX = long-term memory
  due: number;      // Timestamp (ms) when the card should be reviewed again
  seen: number;
  correct: number;
}

export type KanaSrsState = Record<string, KanaCardState>;

export type MasteryLevel = 'new' | 'learning' | 'familiar' | 'mastered';

export type KanaStudyMode = 'flip' | 'choice' | 'listen' | 'type';

export interface KanaPrefs {
  script: KanaScript;
  rows: string[];
  mode: KanaStudyMode;
  size: number;       // Cards per session, 0 = every selected card
  autoSpeak: boolean;
}

const SRS_KEY = 'nihongo_kana_srs_v1';
const PREFS_KEY = 'nihongo_kana_prefs_v1';

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

// Wait before the next review once a card lands in a box
const BOX_INTERVALS = [0, 10 * MINUTE, DAY, 3 * DAY, 7 * DAY, 16 * DAY];
const MAX_BOX = BOX_INTERVALS.length - 1;

const DEFAULT_PREFS: KanaPrefs = {
  script: 'hiragana',
  rows: ['a'],
  mode: 'flip',
  size: 20,
  autoSpeak: true,
};

export const kanaCardId = (script: KanaScript, key: string): string =>
  `${script === 'hiragana' ? 'h' : 'k'}:${key}`;

export const loadKanaSrs = (): KanaSrsState => {
  try {
    const raw = localStorage.getItem(SRS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveKanaSrs = (state: KanaSrsState): void => {
  try {
    localStorage.setItem(SRS_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save kana progress to localStorage', err);
  }
};

export const loadKanaPrefs = (): KanaPrefs => {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
};

export const saveKanaPrefs = (prefs: KanaPrefs): void => {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save kana preferences to localStorage', err);
  }
};

export const reviewKanaCard = (
  state: KanaSrsState,
  id: string,
  correct: boolean,
  now = Date.now()
): KanaSrsState => {
  const prev = state[id] ?? { box: 0, due: 0, seen: 0, correct: 0 };
  let { box, due } = prev;

  if (!correct) {
    box = 1;
    due = now + BOX_INTERVALS[1];
  } else if (box === 0 || due <= now) {
    // Only an on-time review moves a card up, so cramming cannot skip the spacing
    box = Math.min(box + 1, MAX_BOX);
    due = now + BOX_INTERVALS[box];
  }

  return {
    ...state,
    [id]: { box, due, seen: prev.seen + 1, correct: prev.correct + (correct ? 1 : 0) },
  };
};

export const getMastery = (card?: KanaCardState): MasteryLevel => {
  if (!card || card.box === 0) return 'new';
  if (card.box === 1) return 'learning';
  if (card.box <= 3) return 'familiar';
  return 'mastered';
};

export const isKanaDue = (card: KanaCardState | undefined, now = Date.now()): boolean =>
  Boolean(card && card.box > 0 && card.due <= now);

// Due cards first (weakest first), then unseen cards in chart order, then early practice
export const buildKanaQueue = (
  keys: string[],
  script: KanaScript,
  state: KanaSrsState,
  size: number,
  now = Date.now()
): string[] => {
  const cardOf = (key: string) => state[kanaCardId(script, key)];
  const byBoxThenDue = (a: string, b: string) =>
    cardOf(a)!.box - cardOf(b)!.box || cardOf(a)!.due - cardOf(b)!.due;

  const due = keys.filter(k => isKanaDue(cardOf(k), now)).sort(byBoxThenDue);
  const fresh = keys.filter(k => getMastery(cardOf(k)) === 'new');
  const early = keys.filter(k => !isKanaDue(cardOf(k), now) && getMastery(cardOf(k)) !== 'new').sort(byBoxThenDue);

  const picked = [...due, ...fresh, ...early].slice(0, size > 0 ? size : keys.length);
  return shuffle(picked);
};

export const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
