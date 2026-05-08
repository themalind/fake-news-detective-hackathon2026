import { GameProvider, useGame } from './context/GameContext'
import StartPage from './pages/StartPage'
import RoundIntroPage from './pages/RoundIntroPage'
import GamePage from './pages/GamePage'
import RoundSummaryPage from './pages/RoundSummaryPage'
import SummaryPage from './pages/SummaryPage'

function AppScreens() {
  const { state, dispatch } = useGame()

  if (state.screen === 'start') {
    return <StartPage onStart={() => dispatch({ type: 'START_GAME' })} />
  }
  if (state.screen === 'round-intro') {
    return <RoundIntroPage />
  }
  if (state.screen === 'game') {
    return <GamePage />
  }
  if (state.screen === 'round-summary') {
    return <RoundSummaryPage />
  }
  return <SummaryPage />
}

export default function App() {
  return (
    <GameProvider>
      <AppScreens />
    </GameProvider>
  )
}
