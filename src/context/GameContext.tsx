import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import type { ReactNode, Dispatch } from 'react'
import { CASES } from '../data/cases'
import { load, save } from '../utils/storage'
import type {
  GameState,
  GameAction,
  Classification,
  Clue,
  RoundResult,
  PlayerStats,
} from '../types/game'

// ---------- Scoring ----------

function calcRoundScore(
  selected: Classification,
  correct: Classification,
  selectedClueIds: string[],
  clues: Clue[],
  timeElapsed: number
): number {
  let score = 0

  if (selected === correct) score += 100
  else score -= 50

  for (const id of selectedClueIds) {
    const clue = clues.find((c) => c.id === id)
    if (clue?.isRelevant) score += 20
    else score -= 10
  }

  if (timeElapsed < 20_000) score += 50
  else if (timeElapsed < 40_000) score += 25

  return score
}

// ---------- Reducer ----------

const initialState: GameState = {
  screen: 'start',
  currentCaseIndex: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  phase: 'classifying',
  selectedClassification: null,
  selectedClueIds: [],
  results: [],
  roundStartTime: 0,
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...initialState, screen: 'game', roundStartTime: Date.now() }

    case 'SELECT_CLASSIFICATION':
      return {
        ...state,
        selectedClassification: action.classification,
        phase: 'investigating',
      }

    case 'TOGGLE_CLUE': {
      const already = state.selectedClueIds.includes(action.clueId)
      return {
        ...state,
        selectedClueIds: already
          ? state.selectedClueIds.filter((id) => id !== action.clueId)
          : [...state.selectedClueIds, action.clueId],
      }
    }

    case 'SUBMIT_CASE': {
      const currentCase = CASES[state.currentCaseIndex]
      const timeElapsed = Date.now() - state.roundStartTime
      const roundScore = calcRoundScore(
        state.selectedClassification!,
        currentCase.correctClassification,
        state.selectedClueIds,
        currentCase.clues,
        timeElapsed
      )
      const isCorrect =
        state.selectedClassification === currentCase.correctClassification
      const newStreak = isCorrect ? state.streak + 1 : 0
      const newMaxStreak = Math.max(newStreak, state.maxStreak)

      const result: RoundResult = {
        caseId: currentCase.id,
        selectedClassification: state.selectedClassification!,
        isCorrect,
        correctCluesSelected: state.selectedClueIds.filter(
          (id) => currentCase.clues.find((c) => c.id === id)?.isRelevant
        ).length,
        incorrectCluesSelected: state.selectedClueIds.filter(
          (id) => !currentCase.clues.find((c) => c.id === id)?.isRelevant
        ).length,
        scoreGained: roundScore,
        timeElapsed,
      }

      return {
        ...state,
        score: Math.max(0, state.score + roundScore),
        streak: newStreak,
        maxStreak: newMaxStreak,
        phase: 'feedback',
        results: [...state.results, result],
      }
    }

    case 'NEXT_CASE': {
      const nextIndex = state.currentCaseIndex + 1
      if (nextIndex >= CASES.length) {
        return { ...state, screen: 'summary', phase: 'complete' }
      }
      return {
        ...state,
        currentCaseIndex: nextIndex,
        phase: 'classifying',
        selectedClassification: null,
        selectedClueIds: [],
        roundStartTime: Date.now(),
      }
    }

    case 'PREV_CASE': {
      const prevIndex = state.currentCaseIndex - 1
      if (prevIndex < 0) return state
      const prevCase = CASES[prevIndex]
      const prevResult = state.results.find(r => r.caseId === prevCase.id)
      return {
        ...state,
        currentCaseIndex: prevIndex,
        phase: prevResult ? 'feedback' : 'classifying',
        selectedClassification: prevResult?.selectedClassification ?? null,
        selectedClueIds: [],
      }
    }

    case 'RESTART':
      return { ...initialState }
  }
}

// ---------- Context ----------

interface GameContextType {
  state: GameState
  dispatch: Dispatch<GameAction>
}

const GameContext = createContext<GameContextType | null>(null)

const DEFAULT_STATS: PlayerStats = {
  totalGames: 0,
  totalCorrect: 0,
  totalFooled: 0,
  totalEvidenceFound: 0,
  bestStreak: 0,
  lastStreak: 0,
  totalScore: 0,
  badges: [],
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const savedRef = useRef(false)

  useEffect(() => {
    if (state.screen === 'summary' && !savedRef.current) {
      savedRef.current = true
      const existing = load('stats', DEFAULT_STATS) as PlayerStats
      const gameCorrect = state.results.filter(r => r.isCorrect).length
      const gameFooled = state.results.filter(r => !r.isCorrect).length
      const gameEvidence = state.results.reduce((sum, r) => sum + r.correctCluesSelected, 0)

      const newTotalGames = existing.totalGames + 1
      const newTotalCorrect = existing.totalCorrect + gameCorrect
      const newTotalEvidenceFound = existing.totalEvidenceFound + gameEvidence
      const newBestStreak = Math.max(existing.bestStreak, state.maxStreak)
      const newTotalScore = existing.totalScore + state.score

      const badges = [...existing.badges]
      const earn = (id: string) => { if (!badges.includes(id)) badges.push(id) }
      earn('forsta-fallet')
      if (newBestStreak >= 3) earn('streakjagaren')
      if (newTotalEvidenceFound >= 15) earn('bevissamlaren')
      if (newTotalGames >= 5) earn('veteranen')
      if (newTotalGames >= 5 && newTotalCorrect / (newTotalGames * CASES.length) >= 0.8) earn('skarpskytten')

      const updated: PlayerStats = {
        totalGames: newTotalGames,
        totalCorrect: newTotalCorrect,
        totalFooled: existing.totalFooled + gameFooled,
        totalEvidenceFound: newTotalEvidenceFound,
        bestStreak: newBestStreak,
        lastStreak: state.maxStreak,
        totalScore: newTotalScore,
        badges,
      }
      save('stats', updated)
    }
    if (state.screen === 'start') {
      savedRef.current = false
    }
  }, [state.screen])

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
