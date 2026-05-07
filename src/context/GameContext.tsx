import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react';
import { storage } from '../utils/storage';
import type { GameState, Verdict } from '../types/game';

const STORAGE_KEY = 'game-state';

const initialState: GameState = {
  currentCaseIndex: 0,
  score: 0,
  answers: {},
};

type Action =
  | { type: 'reset' }
  | { type: 'answer'; caseId: string; verdict: Verdict; correct: boolean }
  | { type: 'next' };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'answer':
      return {
        ...state,
        score: action.correct ? state.score + 1 : state.score,
        answers: { ...state.answers, [action.caseId]: action.verdict },
      };
    case 'next':
      return { ...state, currentCaseIndex: state.currentCaseIndex + 1 };
  }
}

type GameContextValue = {
  state: GameState;
  dispatch: React.Dispatch<Action>;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (init) => storage.get<GameState>(STORAGE_KEY, init),
  );

  useEffect(() => {
    storage.set(STORAGE_KEY, state);
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame måste användas inuti <GameProvider>');
  return ctx;
}
