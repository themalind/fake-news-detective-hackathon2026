import { GameProvider, useGame } from './context/GameContext'
import StartPage from './pages/StartPage'
import GamePage from './pages/GamePage'
import SummaryPage from './pages/SummaryPage'

function AppScreens() {
  const { state, dispatch } = useGame()

  if (state.screen === 'start') {
    return <StartPage onStart={() => dispatch({ type: 'START_GAME' })} />
  }
  if (state.screen === 'game') {
    return <GamePage />
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
