import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../utils/audio';
import { Play, RotateCcw, Crosshair, Trophy, Timer } from 'lucide-react';

interface Target {
  id: number;
  x: number;
  y: number;
  radius: number;
  spawnTime: number;
  duration: number;
  color: string;
}

export const SpeedReflex: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hits, setHits] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const nextTargetId = useRef(0);
  const targetColors = ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6'];

  useEffect(() => {
    const saved = localStorage.getItem('speed_reflex_high');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const spawnTarget = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const radius = Math.floor(Math.random() * 15) + 20; // 20 - 35px
    const pad = radius + 20;
    const x = Math.random() * (rect.width - pad * 2) + pad;
    const y = Math.random() * (rect.height - pad * 2) + pad;

    const newTarget: Target = {
      id: nextTargetId.current++,
      x,
      y,
      radius,
      spawnTime: Date.now(),
      duration: Math.max(900, 1600 - hits * 15),
      color: targetColors[Math.floor(Math.random() * targetColors.length)]
    };

    setTargets(prev => [...prev.slice(-3), newTarget]);
  }, [hits]);

  const startGame = () => {
    sound.playClick();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHits(0);
    setClicks(0);
    setTimeLeft(30);
    setTargets([]);
    setGameState('playing');
  };

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setGameState('gameover');
            sound.playGameOver();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Target spawner interval
  useEffect(() => {
    let spawner: NodeJS.Timeout;
    if (gameState === 'playing') {
      spawnTarget();
      spawner = setInterval(() => {
        spawnTarget();
      }, 650);
    }
    return () => clearInterval(spawner);
  }, [gameState, spawnTarget]);

  // Check high score on game over
  useEffect(() => {
    if (gameState === 'gameover') {
      const cur = parseInt(localStorage.getItem('speed_reflex_high') || '0', 10);
      if (score > cur) {
        localStorage.setItem('speed_reflex_high', String(score));
        setHighScore(score);
      }
    }
  }, [gameState, score]);

  const handleTargetClick = (targetId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameState !== 'playing') return;

    sound.playPoint();
    setClicks(c => c + 1);
    setHits(h => h + 1);
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);

    // Multiplier based on combo
    const pts = 100 + newCombo * 15;
    setScore(s => s + pts);

    setTargets(prev => prev.filter(t => t.id !== targetId));
  };

  const handleMissClick = () => {
    if (gameState !== 'playing') return;
    setClicks(c => c + 1);
    setCombo(0);
    sound.playHit();
  };

  const accuracy = clicks > 0 ? Math.round((hits / clicks) * 100) : 100;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto select-none">
      {/* HUD Bar */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-3 flex items-center justify-between font-gaming text-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400 text-xs">SCORE: </span>
            <span className="text-emerald-400 font-bold text-base">{score}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs">COMBO: </span>
            <span className="text-amber-400 font-bold">{combo}x</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs">ACC: </span>
            <span className="text-cyan-400 font-bold">{accuracy}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-rose-400 font-bold">
            <Timer className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Target Arena */}
      <div
        ref={containerRef}
        onClick={handleMissClick}
        className="relative w-full aspect-[4/3] bg-[#07120e] overflow-hidden border-x border-b border-slate-800 rounded-b-xl shadow-2xl cursor-crosshair relative"
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966910_1px,transparent_1px),linear-gradient(to_bottom,#05966910_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Targets */}
        {gameState === 'playing' &&
          targets.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={(e) => handleTargetClick(t.id, e)}
              style={{
                left: `${t.x}px`,
                top: `${t.y}px`,
                width: `${t.radius * 2}px`,
                height: `${t.radius * 2}px`,
                transform: 'translate(-50%, -50%)',
                backgroundColor: t.color
              }}
              className="absolute rounded-full border-2 border-white/80 shadow-lg active:scale-90 transition-transform flex items-center justify-center animate-ping-once"
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </button>
          ))}

        {/* Overlays */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-6 text-center">
            <Crosshair className="w-12 h-12 text-emerald-400 mb-3" />
            <h3 className="text-2xl font-bold font-gaming text-white mb-2">SPEED REFLEX</h3>
            <p className="text-sm text-slate-300 max-w-sm mb-5">
              Click appearing holographic targets as quickly as possible. Build combo streaks for massive scores!
            </p>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold font-gaming rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 text-base active:scale-95 transition-transform"
            >
              <Play className="w-5 h-5 fill-current" />
              START CHALLENGE
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center p-6 text-center">
            <Trophy className="w-12 h-12 text-amber-400 mb-2" />
            <h3 className="text-2xl font-bold font-gaming text-white mb-1">TIME IS UP!</h3>
            <div className="flex gap-4 my-3 text-sm font-gaming">
              <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-xs block">SCORE</span>
                <span className="text-emerald-400 font-bold text-lg">{score}</span>
              </div>
              <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-xs block">MAX COMBO</span>
                <span className="text-amber-400 font-bold text-lg">{maxCombo}x</span>
              </div>
              <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-xs block">ACCURACY</span>
                <span className="text-cyan-400 font-bold text-lg">{accuracy}%</span>
              </div>
            </div>
            <button
              type="button"
              onClick={startGame}
              className="mt-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold font-gaming rounded-xl shadow-lg flex items-center gap-2 text-base active:scale-95 transition-transform"
            >
              <RotateCcw className="w-5 h-5" />
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
