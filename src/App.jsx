import React, { useCallback, useState, useEffect } from 'react';
import StartScreen from './components/StartScreen.jsx';
import CharacterSelect from './components/CharacterSelect.jsx';
import StageSelect from './components/StageSelect.jsx';
import GameScreen from './components/GameScreen.jsx';
import EndScreen from './components/EndScreen.jsx';
import SettingsScreen from './components/SettingsScreen.jsx';
import PauseMenu from './components/PauseMenu.jsx';
import StoryIntroScreen from './components/StoryIntroScreen.jsx';
import HelpScreen from './components/HelpScreen.jsx';
import CreditsScreen from './components/CreditsScreen.jsx';
import TournamentScreen from './components/TournamentScreen.jsx';
import { KeybindsContext } from './contexts/KeybindsContext.js';
import { loadKeybinds } from './game/keybinds.js';
import { advanceTournament, getTournamentState } from './game/tournament.js';
import { CHARACTERS } from './game/characters.js';
import { STAGE_LIST } from './game/stage.js';

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
  TOURNAMENT_GAME: 'tournament_game',
  OPPONENT_SELECT: 'opponent_select',
  STORY_INTRO: 'story_intro',
  CHARACTERS: 'characters',
  MAPS: 'maps'
};

function pickRandom(list, exclude = null) {
  const pool = exclude ? list.filter((item) => item !== exclude) : list;
  return pool[Math.floor(Math.random() * pool.length)];
}

function buildStoryQueue(playerChar) {
  const ids = Object.keys(CHARACTERS).filter((id) => id !== playerChar);
  const grouped = ids.reduce((acc, id) => {
    const key = CHARACTERS[id].archetype || 'Specialists';
    if (!acc[key]) acc[key] = [];
    acc[key].push(id);
    return acc;
  }, {});
  const groups = Object.values(grouped).map((group) => [...group].sort(() => Math.random() - 0.5));
  const queue = [];
  while (groups.some((group) => group.length)) {
    for (const group of groups) {
      if (group.length) queue.push(group.shift());
    }
  }
  return queue;
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.START);
  const [playerChar, setPlayerChar] = useState(null);
  const [enemyChar, setEnemyChar] = useState(null);
  const [selectedStage, setSelectedStage] = useState('battlefield');
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('quick');
  const [storyQueue, setStoryQueue] = useState([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [matchSeed, setMatchSeed] = useState(0);
  const [keybinds, setKeybinds] = useState(loadKeybinds());
  const [prevScreen, setPrevScreen] = useState(SCREENS.START);
  const [tournament, setTournament] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);

  useEffect(() => {
    // Load keybinds on mount
    const loaded = loadKeybinds();
    setKeybinds(loaded);

    // Escape key for settings
    const handleEsc = (e) => {
      if (e.code !== 'Escape' || e.repeat || e.defaultPrevented) return;

      const inMatch = screen === SCREENS.GAME || screen === SCREENS.TOURNAMENT_GAME;
      if (inMatch) {
        setPauseOpen((open) => !open);
        return;
      }

      if (settingsOpen) {
        setSettingsOpen(false);
        return;
      }

      if (screen !== SCREENS.START && screen !== SCREENS.END) {
        setSettingsOpen(true);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [screen, settingsOpen]);

  const startMode = useCallback((nextMode) => {
    setMode(nextMode);
    setResult(null);
    setPlayerChar(null);
    setEnemyChar(null);
    setStoryQueue([]);
    setStoryIndex(0);
    setPauseOpen(false);
    setScreen(SCREENS.SELECT);
  }, []);

  const handleSelect = useCallback((charId) => {
    setPlayerChar(charId);
    if (mode === 'story') {
      const queue = buildStoryQueue(charId);
      setStoryQueue(queue);
      setStoryIndex(0);
      setEnemyChar(queue[0]);
      setSelectedStage('battlefield');
      setScreen(SCREENS.STORY_INTRO);
      return;
    }
    if (mode === 'quick') {
      setEnemyChar(pickRandom(Object.keys(CHARACTERS), charId));
      setSelectedStage(pickRandom(STAGE_LIST.map((stage) => stage.id)));
      setMatchSeed((seed) => seed + 1);
      setScreen(SCREENS.GAME);
      return;
    }
    if (mode === 'training') {
      const pool = Object.keys(CHARACTERS).filter((c) => c !== charId);
      setEnemyChar(pool[Math.floor(Math.random() * pool.length)]);
      setScreen(SCREENS.STAGE_SELECT);
    }
  }, [mode]);

  const handleStageSelect = useCallback((stage) => {
    setSelectedStage(stage);
    setMatchSeed((seed) => seed + 1);
    setScreen(SCREENS.GAME);
  }, []);

  const handleGameOver = useCallback((winner) => {
    setResult(winner);
    setScreen(SCREENS.END);
  }, []);

  const handleRestart = useCallback(() => {
    if (mode === 'story' && result === 'player') {
      const nextIndex = storyIndex + 1;
      if (nextIndex < storyQueue.length) {
        setStoryIndex(nextIndex);
        setEnemyChar(storyQueue[nextIndex]);
        setResult(null);
        setScreen(SCREENS.STORY_INTRO);
        return;
      }
    }
    setResult(null);
    setPlayerChar(null);
    setEnemyChar(null);
    setScreen(SCREENS.SELECT);
  }, [storyIndex, storyQueue, mode, result]);

  const handleRestartMatch = useCallback(() => {
    setPauseOpen(false);
    setMatchSeed((seed) => seed + 1);
  }, []);

  const handleHome = useCallback(() => {
    setResult(null);
    setPlayerChar(null);
    setEnemyChar(null);
    setTournament(null);
    setStoryQueue([]);
    setStoryIndex(0);
    setPauseOpen(false);
    setSettingsOpen(false);
    setScreen(SCREENS.START);
  }, []);

  const handleOpenSettings = useCallback((fromScreen) => {
    setPrevScreen(fromScreen);
    setSettingsOpen(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setSettingsOpen(false);
  }, []);

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
        {screen === SCREENS.START && (
          <StartScreen
            onStory={() => startMode('story')}
            onQuickSmash={() => startMode('quick')}
            onTraining={() => startMode('training')}
            onCharacters={() => setScreen(SCREENS.CHARACTERS)}
            onMaps={() => setScreen(SCREENS.MAPS)}
            onSettings={() => handleOpenSettings(SCREENS.START)}
            onHelp={handleOpenHelp}
          />
        )}
        {screen === SCREENS.SELECT && (
          <CharacterSelect
            onSelect={handleSelect}
            onSettings={() => handleOpenSettings(SCREENS.SELECT)}
            onBack={() => setScreen(SCREENS.START)}
            title={mode === 'story' ? 'STORY MODE' : mode === 'training' ? 'TRAINING' : 'QUICK SMASH'}
            subtitle={mode === 'story' ? 'Fight a rising roster ladder with short rival scenes' : mode === 'training' ? 'Pick a fighter to practice abilities freely' : 'Pick your fighter. Opponent and map are random.'}
            actionLabel={mode === 'story' ? 'Begin Story' : mode === 'training' ? 'Choose Training Map' : 'Start Quick Smash'}
          />
        )}
        {screen === SCREENS.STORY_INTRO && (
          <StoryIntroScreen
            playerChar={playerChar}
            enemyChar={enemyChar}
            index={storyIndex}
            total={storyQueue.length}
            onContinue={() => { setMatchSeed((seed) => seed + 1); setScreen(SCREENS.GAME); }}
            onBack={handleHome}
          />
        )}
        {screen === SCREENS.STAGE_SELECT && <StageSelect onSelect={handleStageSelect} onBack={() => setScreen(SCREENS.SELECT)} />}
        {screen === SCREENS.CHARACTERS && (
          <CharacterSelect
            onBack={() => setScreen(SCREENS.START)}
            title="CHARACTERS"
            subtitle="Full roster grouped by archetype"
            readOnly
          />
        )}
        {screen === SCREENS.MAPS && <StageSelect previewOnly onBack={() => setScreen(SCREENS.START)} />}
        {screen === SCREENS.TOURNAMENT && <TournamentScreen onStart={handleStartTournament} onBack={() => setScreen(SCREENS.START)} />}
        {screen === SCREENS.GAME && (
          <GameScreen
            key={`${mode}-${matchSeed}`}
            playerChar={playerChar}
            enemyChar={enemyChar}
            stage={selectedStage}
            onGameOver={handleGameOver}
            keybinds={keybinds}
            paused={settingsOpen || pauseOpen}
            mode={mode === 'quick' ? 'smash' : mode}
            aiDifficulty={mode === 'story' ? 1 + storyIndex * 0.035 : 1}
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
            paused={settingsOpen || pauseOpen}
          />
        )}
        {screen === SCREENS.END && (
          <EndScreen
            result={result}
            onRestart={tournament ? handleTournamentRestart : handleRestart}
            onHome={handleHome}
            isTournament={!!tournament}
            tournamentWinner={tournament?.winner}
            primaryLabelOverride={mode === 'story' && result === 'player' && storyIndex < storyQueue.length - 1 ? 'Next Rival →' : undefined}
            subOverride={mode === 'story' && result === 'player'
              ? (storyIndex < storyQueue.length - 1 ? `Story clear ${storyIndex + 1}/${storyQueue.length}` : 'Entire roster defeated')
              : undefined}
          />
        )}
        {pauseOpen && (screen === SCREENS.GAME || screen === SCREENS.TOURNAMENT_GAME) && (
          <PauseMenu
            onResume={() => setPauseOpen(false)}
            onRestart={handleRestartMatch}
            onHome={handleHome}
          />
        )}
        {settingsOpen && (
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
