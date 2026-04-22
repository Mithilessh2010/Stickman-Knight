import React, { useState } from 'react'
import StartScreen from './components/StartScreen.jsx'
import CharacterSelect from './components/CharacterSelect.jsx'
import GameScreen from './components/GameScreen.jsx'
import EndScreen from './components/EndScreen.jsx'

export default function App() {
  const [screen, setScreen] = useState('start') // start | select | game | end
  const [selectedChar, setSelectedChar] = useState(null)
  const [result, setResult] = useState(null) // 'win' | 'lose'

  const handleStart = () => setScreen('select')

  const handleSelectChar = (charId) => {
    setSelectedChar(charId)
    setScreen('game')
  }

  const handleGameEnd = (outcome) => {
    setResult(outcome)
    setScreen('end')
  }

  const handleRestart = () => {
    setResult(null)
    setSelectedChar(null)
    setScreen('select')
  }

  const handleHome = () => {
    setResult(null)
    setSelectedChar(null)
    setScreen('start')
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#080c14' }}>
      {screen === 'start' && <StartScreen onStart={handleStart} />}
      {screen === 'select' && <CharacterSelect onSelect={handleSelectChar} onBack={handleHome} />}
      {screen === 'game' && (
        <GameScreen
          selectedChar={selectedChar}
          onGameEnd={handleGameEnd}
        />
      )}
      {screen === 'end' && (
        <EndScreen
          result={result}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}
    </div>
  )
}
