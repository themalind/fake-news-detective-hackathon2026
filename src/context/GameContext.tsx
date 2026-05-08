import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import type { ReactNode, Dispatch } from 'react'
import { CASES } from '../data/cases'
import { ROUNDS } from '../data/rounds'
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
  currentRoundIndex: 0,
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

function firstCaseIndexOfRound(roundIndex: number): number {
  return CASES.findIndex(c => c.id === ROUNDS[roundIndex].caseIds[0])
}

function nextUnresolvedInRound(
  roundIndex: number,
  currentCaseIndex: number,
  results: RoundResult[]
): number | null {
  const round = ROUNDS[roundIndex]
  const currentId = CASES[currentCaseIndex].id
  const pos = round.caseIds.indexOf(currentId)
  // Sök från nästa position framåt, sedan wrap runt
  const ordered = [
    ...round.caseIds.slice(pos + 1),
    ...round.caseIds.slice(0, pos + 1),
  ]
  for (const id of ordered) {
    if (!results.find(r => r.caseId === id)) {
      return CASES.findIndex(c => c.id === id)
    }
  }
  return null
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const allCaseIds = ROUNDS.flatMap(r => r.caseIds)
      const allDone = allCaseIds.every(id => state.results.find(r => r.caseId === id))

      // Om pågående session har delresultat (ej hela spelet klart) → resumea
      if (state.results.length > 0 && !allDone) {
        const nextRoundIndex = ROUNDS.findIndex(round =>
          !round.caseIds.every(id => state.results.find(r => r.caseId === id))
        )
        const idx = nextRoundIndex === -1 ? 0 : nextRoundIndex
        return {
          ...state,
          screen: 'round-intro',
          currentRoundIndex: idx,
          currentCaseIndex: firstCaseIndexOfRound(idx),
          phase: 'classifying',
          selectedClassification: null,
          selectedClueIds: [],
          roundStartTime: Date.now(),
        }
      }

      // Ny omgång — bestäm startrunda utifrån sparad level
      const stored = load('stats', DEFAULT_STATS) as PlayerStats
      const startRoundIndex = (stored.totalCompletedRounds ?? 0) % ROUNDS.length
      return {
        ...initialState,
        screen: 'round-intro',
        currentRoundIndex: startRoundIndex,
        currentCaseIndex: firstCaseIndexOfRound(startRoundIndex),
        roundStartTime: Date.now(),
      }
    }

    case 'START_ROUND':
      return {
        ...state,
        screen: 'game',
        currentCaseIndex: firstCaseIndexOfRound(state.currentRoundIndex),
        phase: 'classifying',
        selectedClassification: null,
        selectedClueIds: [],
        roundStartTime: Date.now(),
      }

    case 'NEXT_ROUND': {
      const nextRoundIndex = state.currentRoundIndex + 1
      if (nextRoundIndex >= ROUNDS.length) {
        return { ...state, screen: 'start', phase: 'complete' }
      }
      return {
        ...state,
        screen: 'round-intro',
        currentRoundIndex: nextRoundIndex,
        currentCaseIndex: firstCaseIndexOfRound(nextRoundIndex),
        phase: 'classifying',
        selectedClassification: null,
        selectedClueIds: [],
        roundStartTime: Date.now(),
      }
    }

    case 'EXIT_TO_START':
      return { ...state, screen: 'start' }

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
      const allClues = [
        ...currentCase.clues,
        ...currentCase.positiveClues,
        ...currentCase.misleadingClues,
      ]
      const timeElapsed = Date.now() - state.roundStartTime
      const roundScore = calcRoundScore(
        state.selectedClassification!,
        currentCase.correctClassification,
        state.selectedClueIds,
        allClues,
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
          (id) => allClues.find((c) => c.id === id)?.isRelevant
        ).length,
        incorrectCluesSelected: state.selectedClueIds.filter(
          (id) => !allClues.find((c) => c.id === id)?.isRelevant
        ).length,
        selectedClueIds: state.selectedClueIds,
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
      const currentRound = ROUNDS[state.currentRoundIndex]
      const roundDone = currentRound.caseIds.every(id =>
        state.results.find(r => r.caseId === id)
      )
      if (roundDone) {
        return { ...state, screen: 'round-summary', phase: 'complete' }
      }
      const nextIndex = nextUnresolvedInRound(
        state.currentRoundIndex,
        state.currentCaseIndex,
        state.results
      )
      if (nextIndex === null) {
        return { ...state, screen: 'round-summary', phase: 'complete' }
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
      const currentRound = ROUNDS[state.currentRoundIndex]
      const currentId = CASES[state.currentCaseIndex].id
      const posInRound = currentRound.caseIds.indexOf(currentId)
      if (posInRound <= 0) return state
      const prevId = currentRound.caseIds[posInRound - 1]
      const prevIndex = CASES.findIndex(c => c.id === prevId)
      const prevResult = state.results.find(r => r.caseId === prevId)
      return {
        ...state,
        currentCaseIndex: prevIndex,
        phase: prevResult ? 'investigating' : 'classifying',
        selectedClassification: prevResult?.selectedClassification ?? null,
        selectedClueIds: prevResult?.selectedClueIds ?? [],
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
  totalCompletedRounds: 0,
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const lastSavedRoundRef = useRef(-1)

  useEffect(() => {
    if (state.screen === 'start') {
      lastSavedRoundRef.current = -1
    }
  }, [state.screen])

  useEffect(() => {
    if (state.screen !== 'round-summary') return
    if (lastSavedRoundRef.current === state.currentRoundIndex) return
    lastSavedRoundRef.current = state.currentRoundIndex

    const isLastRound = state.currentRoundIndex === ROUNDS.length - 1
    const roundCaseIds = ROUNDS[state.currentRoundIndex].caseIds
    const roundResults = state.results.filter(r => roundCaseIds.includes(r.caseId))
    const roundCorrect = roundResults.filter(r => r.isCorrect).length
    const roundFooled = roundResults.filter(r => !r.isCorrect).length
    const roundEvidence = roundResults.reduce((sum, r) => sum + r.correctCluesSelected, 0)
    const roundScore = roundResults.reduce((sum, r) => sum + r.scoreGained, 0)

    const existing = load('stats', DEFAULT_STATS) as PlayerStats
    const newTotalCorrect = existing.totalCorrect + roundCorrect
    const newTotalEvidenceFound = existing.totalEvidenceFound + roundEvidence
    const newBestStreak = Math.max(existing.bestStreak, state.maxStreak)
    const newTotalCompletedRounds = (existing.totalCompletedRounds ?? 0) + 1
    const newTotalGames = isLastRound ? existing.totalGames + 1 : existing.totalGames

    const badges = [...existing.badges]
    const earn = (id: string) => { if (!badges.includes(id)) badges.push(id) }
    earn('forsta-fallet')
    if (newBestStreak >= 3) earn('streakjagaren')
    if (newTotalEvidenceFound >= 15) earn('bevissamlaren')
    if (isLastRound) {
      if (newTotalGames >= 5) earn('veteranen')
      const totalPlayed = existing.totalCorrect + existing.totalFooled
      if (newTotalGames >= 5 && totalPlayed > 0 && existing.totalCorrect / totalPlayed >= 0.8) earn('skarpskytten')
    }

    save('stats', {
      ...existing,
      totalGames: newTotalGames,
      totalCorrect: newTotalCorrect,
      totalFooled: existing.totalFooled + roundFooled,
      totalEvidenceFound: newTotalEvidenceFound,
      bestStreak: newBestStreak,
      lastStreak: state.maxStreak,
      totalScore: existing.totalScore + roundScore,
      totalCompletedRounds: newTotalCompletedRounds,
      badges,
    })
  }, [state.screen, state.currentRoundIndex])

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
