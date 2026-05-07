export type Screen = 'start';

export type Verdict = 'real' | 'fake';

export type Case = {
  id: string;
  headline: string;
  source: string;
  body: string;
  verdict: Verdict;
  explanation: string;
};

export type GameState = {
  currentCaseIndex: number;
  score: number;
  answers: Record<string, Verdict>;
};
