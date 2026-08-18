export interface AppConfig {
  girlfriendName: string;
  yourName: string;
  birthdayDate: string; // e.g., '2026-08-20' or '2024-08-20'
  level: number;
  targetXP: number;
  musicTitle: string;
  finalSurpriseURL: string;
  finalMsg: string;
  letterMsg: string;
  story: StoryEvent[];
  memories: MemoryItem[];
  coupons: LoveCoupon[];
  trivia: TriviaItem[];
}

export interface StoryEvent {
  id: string;
  date: string;
  title: string;
  msg: string;
  icon?: string;
  image?: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  desc: string;
  date?: string;
  img: string;
  tag?: string;
}

export interface LoveCoupon {
  id: string;
  title: string;
  description: string;
  icon: string;
  redeemed: boolean;
}

export interface TriviaItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserProgress {
  xp: number;
  visitedSections: string[];
  interactedObjects: string[];
  visitedStoryEvents?: string[];
  visitedMemories?: string[];
  gamesWon: string[];
  gameHighScores?: Record<string, number>;
  gameBestTimes?: Record<string, number>;
  letterOpened: boolean;
  candlesBlown: boolean;
  redeemedCoupons: string[];
  easterEggFound: boolean;
  lastSaved?: number;
}

export type ActiveSection = 
  | 'loading'
  | 'main-menu'
  | 'story'
  | 'memories'
  | 'room'
  | 'games-menu'
  | 'letter'
  | 'final-surprise';

export type GameType = 'catch' | 'match' | 'hunt' | 'pop' | 'trivia';
