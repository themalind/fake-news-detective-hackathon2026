export type Classification = "true" | "false" | "misleading";

export type GamePhase = "classifying" | "investigating" | "feedback" | "complete";

export type CaseType = "headline" | "social-post" | "article" | "image-post";

export type Screen = "start" | "game" | "summary";

// ---------- Case data ----------

export interface Clue {
  id: string;
  text: string;
  /** Whether this clue actually supports the correct verdict */
  isRelevant: boolean;
}

export interface ImageAnalysis {
  matchFound: boolean;
  originalLocation?: string;
  originalDate?: string;
  subject?: string;
}

export interface Case {
  id: string;
  caseNumber: number;
  type: CaseType;
  source: string;
  author?: string;
  date: string;
  headline: string;
  content: string;
  correctClassification: Classification;
  clues: Clue[];
  /** Short explanation shown after submitting */
  feedback: string;
  /** "If shared, this could…" shown in feedback */
  consequence: string;
  image?: string;
  imageAnalysis?: ImageAnalysis;
}

// ---------- Game state ----------

export interface RoundResult {
  caseId: string;
  selectedClassification: Classification;
  isCorrect: boolean;
  correctCluesSelected: number;
  incorrectCluesSelected: number;
  scoreGained: number;
  timeElapsed: number;
}

export interface GameState {
  screen: Screen;
  currentCaseIndex: number;
  score: number;
  streak: number;
  maxStreak: number;
  phase: GamePhase;
  selectedClassification: Classification | null;
  selectedClueIds: string[];
  results: RoundResult[];
  roundStartTime: number;
}

// ---------- Persistent player stats ----------

export interface PlayerStats {
  totalGames: number;
  totalCorrect: number;
  totalFooled: number;
  totalEvidenceFound: number;
  bestStreak: number;
  lastStreak: number;
  totalScore: number;
  badges: string[];
}

// ---------- Reducer actions ----------

export type GameAction =
  | { type: "START_GAME" }
  | { type: "SELECT_CLASSIFICATION"; classification: Classification }
  | { type: "TOGGLE_CLUE"; clueId: string }
  | { type: "SUBMIT_CASE" }
  | { type: "NEXT_CASE" }
  | { type: "RESTART" };
