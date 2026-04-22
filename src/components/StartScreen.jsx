import React, { useEffect } from 'react';

export default function StartScreen({ onStart }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') onStart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onStart]);

  return (
    <div className="screen">
      <h1 className="title">Stickman<br />Duel Arena</h1>
      <div className="subtitle">A 1v1 fighting game</div>
      <div className="start-prompt" onClick={onStart} style={{ cursor: 'pointer' }}>
        Press Space to Begin
      </div>
      <div className="controls-hint">
        <span>A</span><span>D</span> Move &nbsp;·&nbsp;
        <span>W</span> Jump &nbsp;·&nbsp;
        <span>J</span> Attack &nbsp;·&nbsp;
        <span>K</span> Ability 1 &nbsp;·&nbsp;
        <span>L</span> Ability 2 &nbsp;·&nbsp;
        <span>U</span> Ultimate
      </div>
    </div>
  );
}
