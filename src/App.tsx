import { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { StartPage } from './pages/StartPage';
import type { Screen } from './types/game';

export function App() {
  const [screen, setScreen] = useState<Screen>('start');

  return (
    <GameProvider>
      {screen === 'start' && <StartPage onStart={() => setScreen('start')} />}
    </GameProvider>
  );
}
