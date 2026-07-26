import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGame } from './game/config';
import TouchControls from './components/TouchControls';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      gameRef.current = createGame(containerRef.current);
    }
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100dvw',
        height: '100dvh',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
      <TouchControls />
    </div>
  );
}

export default App;
