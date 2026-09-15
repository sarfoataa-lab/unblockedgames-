import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Play, RotateCcw, Brain, Trophy } from 'lucide-react';

export const MemoryMatrix: React.FC = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [bestRound, setBestRound] = useState(1);
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'player' | 'gameover'>('idle');

  useEffect(() => {
    const saved = localStorage.getItem('memory_matrix_high');
    if (saved) setBestRound(parseInt(saved, 10));
  }, []);

  const TILES = [
    { id: 0, color: '#06b6d4', glow: 'shadow-[0_0_24px_#06b6d4]', name: 'CYAN' },
    { id: 1, color: '#ec4899', glow: 'shadow-[0_0_24px_#ec4899]', name: 'MAGENTA' },
    { id: 2, color: '#10b981', glow: 'shadow-[0_0_24px_#10b981]', name: 'EMERALD' },
    { id: 3, color: '#f59e0b', glow: 'shadow-[0_0_24px_#f59e0b]', name: 'AMBER' },
  ];

  const playSequence = (seq: number[]) => {
    setGameState('showing');
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < seq.length) {
        const tileId = seq[idx];
        setActiveTile(tileId);
        sound.playLaser();
        setTimeout(() => {
          setActiveTile(null);
        }, 380);
        idx++;
      } else {
        clearInterval(interval);
        setGameState('player');
        setPlayerInput([]);
      }
    }, 650);
  };

  const startGame = () => {
    sound.playClick();
    const firstTile = Math.floor(Math.random() * 4);
    const initialSeq = [firstTile];
    setSequence(initialSeq);
    setRound(1);
    setGameState('showing');
    setTimeout(() => {
      playSequence(initialSeq);
    }, 500);
  };

  const handleTileClick = (id: number) => {
    if (gameState !== 'player') return;

    sound.playLaser();
    setActiveTile(id);
    setTimeout(() => setActiveTile(null), 250);

    const newInput = [...playerInput, id];
    setPlayerInput(newInput);

    const currentIndex = newInput.length - 1;
    if (newInput[currentIndex] !== sequence[currentIndex]) {
      // Mistake!
      sound.playHit();
      sound.playGameOver();
      setGameState('gameover');
      if (round > bestRound) {
        setBestRound(round);
        localStorage.setItem('memory_matrix_high', String(round));
      }
      return;
    }

    // Completed current sequence!
    if (newInput.length === sequence.length) {
      sound.playPoint();
      const nextRound = round + 1;
      setRound(nextRound);
      if (nextRound > bestRound) {
        setBestRound(nextRound);
        localStorage.setItem('memory_matrix_high', String(nextRound));
      }

      const nextTile = Math.floor(Math.random() * 4);
      const nextSeq = [...sequence, nextTile];
      setSequence(nextSeq);
      setTimeout(() => {
        playSequence(nextSeq);
      }, 800);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto select-none">
      {/* HUD */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400 text-xs">ROUND: </span>
            <span className="font-gaming text-indigo-400 font-bold text-base">{round}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs">BEST: </span>
            <span className="font-gaming text-amber-400 font-bold text-base">{bestRound}</span>
          </div>
        </div>

        <div className="text-xs font-gaming font-semibold">
          {gameState === 'showing' && (
            <span className="text-cyan-400 animate-pulse">WATCH PATTERN...</span>
          )}
          {gameState === 'player' && (
            <span className="text-emerald-400">YOUR TURN ({playerInput.length}/{sequence.length})</span>
          )}
          {gameState === 'gameover' && (
            <span className="text-rose-400">SEQUENCE FAILED</span>
          )}
        </div>
      </div>

      {/* 4 Quadrants Matrix */}
      <div className="relative w-full aspect-square bg-[#0b0c1b] p-6 border-x border-b border-slate-800 rounded-b-xl shadow-2xl flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 w-full h-full max-w-[320px] max-h-[320px]">
          {TILES.map(t => {
            const isActive = activeTile === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTileClick(t.id)}
                disabled={gameState !== 'player'}
                style={{
                  backgroundColor: isActive ? t.color : `${t.color}22`,
                  borderColor: t.color
                }}
                className={`w-full h-full rounded-2xl border-2 transition-all duration-150 flex items-center justify-center active:scale-95 ${
                  isActive ? `${t.glow} scale-102` : 'opacity-70 hover:opacity-90'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 transition-colors ${
                    isActive ? 'bg-white border-white' : 'border-current opacity-40'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Center Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/80 rounded-b-xl flex flex-col items-center justify-center p-6 text-center">
            <Brain className="w-12 h-12 text-indigo-400 mb-2" />
            <h3 className="text-2xl font-bold font-gaming text-white mb-1">MEMORY MATRIX</h3>
            <p className="text-xs text-slate-300 max-w-xs mb-5">
              Watch the sequence of glowing cyber tiles and reproduce the pattern without fault!
            </p>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold font-gaming rounded-xl shadow-lg shadow-indigo-500/30 flex items-center gap-2 text-base active:scale-95 transition-transform"
            >
              <Play className="w-5 h-5 fill-current" />
              START TEST
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/85 rounded-b-xl flex flex-col items-center justify-center p-6 text-center">
            <Trophy className="w-12 h-12 text-amber-400 mb-2" />
            <h3 className="text-2xl font-bold font-gaming text-white mb-1">PATTERN BROKEN</h3>
            <p className="text-sm text-slate-300 mb-4">You reached Round {round}</p>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold font-gaming rounded-xl shadow-lg flex items-center gap-2 text-sm active:scale-95 transition-transform"
            >
              <RotateCcw className="w-4 h-4" />
              TRY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
