import React, { useCallback, useState, useEffect } from 'react';
import StartScreen from './components/StartScreen.jsx';
import CharacterSelect from './components/CharacterSelect.jsx';
import StageSelect from './components/StageSelect.jsx';
import GameScreen from './components/GameScreen.jsx';
import EndScreen from './components/EndScreen.jsx';
import SettingsScreen from './components/SettingsScreen.jsx';
import HelpScreen from './components/HelpScreen.jsx';
import CreditsScreen from './components/CreditsScreen.jsx';
import TournamentScreen from './components/TournamentScreen.jsx';
import { KeybindsContext } from './contexts/KeybindsContext.js';
import { loadKeybinds } from './game/keybinds.js';
import { advanceTournament, getTournamentState } from './game/tournament.js';

const SCREENS = {
  START: 'start',
  SELECT: 'select',
  STAGE_SELECT: 'stage_select',
  GAME: 'game',
  END: 'end',
  SETTINGS: 'settings',
  HELP: 'help',
  CREDITS: 'credits',
  TOURNAMENT: 'tournament',
  TOURNAMENT_GAME: 'tournament_game'
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.START);
  const [playerChar, setPlayerChar] = useState(null);
  const [enemyChar, setEnemyChar] = useState(null);
  const [selectedStage, setSelectedStage] = useState('rooftop');
  const [result, setResult] = useState(null);
  const [keybinds, setKeybinds] = useState(loadKeybinds());
  const [prevScreen, setPrevScreen] = useState(SCREENS.START);
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    // Load keybinds on mount
    const loaded = loadKeybinds();
    setKeybinds(loaded);

    // Escape key for settings
    const handleEsc = (e) => {
      if (e.code === 'Escape' && screen !== SCREENS.SETTINGS && screen !== SCREENS.START) {
        setPrevScreen(screen);
        setScreen(SCREENS.SETTINGS);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [screen]);

  const handleStart = useCallback(() => setScreen(SCREENS.SELECT), []);

  const handleSelect = useCallback((charId) => {
    const pool = ['sword', 'spear', 'mage', 'brute', 'assassin', 'archer', 'elemental', 'summoner', 'paladin', 'berserker', 'gunslinger', 'necromancer'].filter((c) => c !== charId);
    const ai = pool[Math.floor(Math.random() * pool.length)];
    setPlayerChar(charId);
    setEnemyChar(ai);
    setScreen(SCREENS.STAGE_SELECT);
  }, []);

  const handleStageSelect = useCallback((stage) => {
    setSelectedStage(stage);
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

  const handleOpenSettings = useCallback((fromScreen) => {
    setPrevScreen(fromScreen);
    setScreen(SCREENS.SETTINGS);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setScreen(prevScreen);
  }, [prevScreen]);

  const handleOpenHelp = useCallback(() => {
    setPrevScreen(screen);
    setScreen(SCREENS.HELP);
  }, [screen]);

  const handleCloseHelp = useCallback(() => {
    setScreen(prevScreen);
  }, [prevScreen]);

  const handleOpenCredits = useCallback(() => {
    setPrevScreen(screen);
    setScreen(SCREENS.CREDITS);
  }, [screen]);

  const handleCloseCredits = useCallback(() => {
    setScreen(prevScreen);
  }, [prevScreen]);

  const handleStartTournament = useCallback((tournamentObj) => {
    setTournament(tournamentObj);
    const state = getTournamentState(tournamentObj);
    setPlayerChar(state.currentMatch.player);
    setEnemyChar(state.currentMatch.opponent);
    setScreen(SCREENS.TOURNAMENT_GAME);
  }, []);

  const handleTournamentGameOver = useCallback((winner) => {
    setResult(winner);
    const updated = advanceTournament(tournament, winner);
    setTournament(updated);
    setScreen(SCREENS.END);
  }, [tournament]);

  const handleTournamentRestart = useCallback(() => {
    if (tournament.winner) {
      // Tournament complete
      setTournament(null);
      setResult(null);
      setPlayerChar(null);
      setEnemyChar(null);
      setScreen(SCREENS.START);
    } else {
      // Next round
      const state = getTournamentState(tournament);
      setPlayerChar(state.currentMatch.player);
      setEnemyChar(state.currentMatch.opponent);
      setResult(null);
      setScreen(SCREENS.TOURNAMENT_GAME);
    }
  }, [tournament]);

  return (
    <KeybindsContext.Provider value={{ keybinds, setKeybinds }}>
      <div className="app-shell">
        {screen === SCREENS.START && <StartScreen onStart={handleStart} onSettings={() => handleOpenSettings(SCREENS.START)} onHelp={handleOpenHelp} onCredits={handleOpenCredits} onTournament={() => setScreen(SCREENS.TOURNAMENT)} />}
        {screen === SCREENS.SELECT && <CharacterSelect onSelect={handleSelect} onSettings={() => handleOpenSettings(SCREENS.SELECT)} />}
        {screen === SCREENS.STAGE_SELECT && <StageSelect onSelect={handleStageSelect} onBack={() => setScreen(SCREENS.SELECT)} />}
        {screen === SCREENS.TOURNAMENT && <TournamentScreen onStart={handleStartTournament} onBack={() => setScreen(SCREENS.START)} />}
        {screen === SCREENS.GAME && (
          <GameScreen
            playerChar={playerChar}
            enemyChar={enemyChar}
            stage={selectedStage}
            onGameOver={handleGameOver}
            keybinds={keybinds}
          />
        )}
        {screen === SCREENS.TOURNAMENT_GAME && (
          <GameScreen
            playerChar={playerChar}
            enemyChar={enemyChar}
            stage={selectedStage}
            onGameOver={handleTournamentGameOver}
            keybinds={keybinds}
            tournament={tournament}
          />
        )}
        {screen === SCREENS.END && (
          <EndScreen
            result={result}
            onRestart={tournament ? handleTournamentRestart : handleRestart}
            onHome={handleHome}
            isTournament={!!tournament}
            tournamentWinner={tournament?.winner}
          />
        )}
        {screen === SCREENS.SETTINGS && (
          <SettingsScreen onClose={handleCloseSettings} />
        )}
        {screen === SCREENS.HELP && (
          <HelpScreen onClose={handleCloseHelp} />
        )}
        {screen === SCREENS.CREDITS && (
          <CreditsScreen onClose={handleCloseCredits} />
        )}
      </div>
    </KeybindsContext.Provider>
  );
}
