import React, { useCallback, useState } from 'react';
import StartScreen from './components/StartScreen.jsx';
import CharacterSelect from './components/CharacterSelect.jsx';
import GameScreen from './components/GameScreen.jsx';
import EndScreen from './components/EndScreen.jsx';

const SCREENS = {
  START: 'start',
  SELECT: 'select',
  GAME: 'game',
  END: 'end'
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.START);
  const [playerChar, setPlayerChar] = useState(null);
  const [enemyChar, setEnemyChar] = useState(null);
  const [result, setResult] = useState(null);

  const handleStart = useCallback(() => setScreen(SCREENS.SELECT), []);

  const handleSelect = useCallback((charId) => {
    const pool = ['sword', 'spear', 'mage', 'brute', 'assassin', 'archer', 'elemental', 'summoner'].filter((c) => c !== charId);
    const ai = pool[Math.floor(Math.random() * pool.length)];
    setPlayerChar(charId);
    setEnemyChar(ai);
    setScreen(SCREENS.GAME);
  }, []);

  const handleGameOver = useCallback((winner) => {
    setResult(winner);
    setScreen(SCREENS.END);
  }, []);

  const handleRestart = useCallback(() => {
    setResult(null);
    setPlayerChar(null);
    setEnemyChar(null);
    setScreen(SCREENS.SELECT);
  }, []);

  const handleHome = useCallback(() => {
    setResult(null);
    setPlayerChar(null);
    setEnemyChar(null);
    setScreen(SCREENS.START);
  }, []);

  return (
    <div className="app-shell">
      {screen === SCREENS.START && <StartScreen onStart={handleStart} />}
      {screen === SCREENS.SELECT && <CharacterSelect onSelect={handleSelect} />}
      {screen === SCREENS.GAME && (
        <GameScreen
          playerChar={playerChar}
          enemyChar={enemyChar}
          onGameOver={handleGameOver}
        />
      )}
      {screen === SCREENS.END && (
        <EndScreen result={result} onRestart={handleRestart} onHome={handleHome} />
      )}
    </div>
  );
}
