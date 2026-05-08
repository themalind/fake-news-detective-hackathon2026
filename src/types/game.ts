export type Classification = "true" | "false" | "misleading";

export type GamePhase = "classifying" | "investigating" | "feedback" | "complete";

export type CaseType = "headline" | "social-post" | "article" | "image-post";

export type Screen = "start" | "round-intro" | "game" | "round-summary" | "summary";

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

// ---------- Inline-länkar i artiklar ----------

/** Forskningsrapport som visas i fake-browser för "report"-länkar */
export interface ResearchReport {
  title: string;
  authors: string;
  affiliation: string;
  funding?: string;
  date: string;
  participants?: number;
  abstract: string;
  method: string;
  findings: string[];
  conclusion: string;
}

/** Detaljer för en "shady"-länk som öppnar varningsmodal */
export interface ShadyLinkInfo {
  /** Tydlig anledningar till varför URL:en är misstänkt */
  reasons: string[];
  /** Vad URL:en låtsas peka mot (t.ex. "regeringens pressmeddelande") */
  pretendsToBe: string;
  /** Vad legitim adress hade varit */
  legitDomain: string;
}

export type ArticleLink =
  | { type: "report"; url: string; report: ResearchReport }
  | { type: "dead"; url: string }
  | { type: "shady"; url: string; warning: ShadyLinkInfo };

export interface Case {
  id: string;
  caseNumber: number;
  type: CaseType;
  /** Tidningens/sajtens visningsnamn (i mastheaden) — fallback om articles.html saknar source */
  source: string;
  /** Full URL som visas i browser-frame:s adressbar. Faller tillbaka på source om saknad. */
  url?: string;
  author?: string;
  date: string;
  headline: string;
  content: string;
  correctClassification: Classification;
  /** Bevis som visas när användaren klassar artikeln som FALSKT */
  clues: Clue[];
  /** Bevis som visas när användaren klassar artikeln som SANT */
  positiveClues: Clue[];
  /** Bevis som visas när användaren klassar artikeln som VILSELEDANDE */
  misleadingClues: Clue[];
  /** Short explanation shown after submitting */
  feedback: string;
  /** "If shared, this could…" shown in feedback */
  consequence: string;
  image?: string;
  imageAnalysis?: ImageAnalysis;
  /** Inline-länkar som referas via {{key|displaytext}}-tokens i artikeltext */
  inlineLinks?: Record<string, ArticleLink>;
}

// ---------- Game state ----------

export interface RoundResult {
  caseId: string;
  selectedClassification: Classification;
  isCorrect: boolean;
  correctCluesSelected: number;
  incorrectCluesSelected: number;
  /** Sparas så bevis-granskningen kan visas igen i review-läge */
  selectedClueIds: string[];
  scoreGained: number;
  timeElapsed: number;
}

export interface GameState {
  screen: Screen;
  currentRoundIndex: number;
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
  totalCompletedRounds: number;
}

// ---------- Reducer actions ----------

export type GameAction =
  | { type: "START_GAME" }
  | { type: "START_ROUND" }
  | { type: "NEXT_ROUND" }
  | { type: "SELECT_CLASSIFICATION"; classification: Classification }
  | { type: "TOGGLE_CLUE"; clueId: string }
  | { type: "SUBMIT_CASE" }
  | { type: "NEXT_CASE" }
  | { type: "PREV_CASE" }
  | { type: "EXIT_TO_START" }
  | { type: "RESTART" };
