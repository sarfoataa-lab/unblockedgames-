import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sound } from '../utils/audio';
import { TouchController } from '../components/TouchController';
import { Play, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export const RetroSnake: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [soundMuted, setSoundMuted] = useState(!sound.enabled);
  const [speed, setSpeed] = useState<'normal' | 'fast' | 'hyper'>('normal');

  const GRID_SIZE = 20;
  const COLS = 28;
  const ROWS = 22;

  const stateRef = useRef({
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ] as Point[],
    direction: { x: 1, y: 0 } as Point,
    nextDirection: { x: 1, y: 0 } as Point,
    food: { x: 18, y: 10 } as Point,
    bonusFood: null as { x: number; y: number; timer: number } | null,
    score: 0,
    state: 'idle' as 'idle' | 'playing' | 'gameover',
    lastMoveTime: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('retro_snake_high');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const spawnFood = (snake: Point[]): Point => {
    let newFood: Point;
    let collision = true;
    while (collision) {
      newFood = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS)
      };
      collision = snake.some(s => s.x === newFood.x && s.y === newFood.y);
      if (!collision) return newFood;
    }
    return { x: 5, y: 5 };
  };

  const startGame = useCallback(() => {
    sound.playClick();
    const st = stateRef.current;
    st.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    st.direction = { x: 1, y: 0 };
    st.nextDirection = { x: 1, y: 0 };
    st.food = spawnFood(st.snake);
    st.bonusFood = null;
    st.score = 0;
    st.state = 'playing';

    setScore(0);
    setGameState('playing');
  }, []);

  // Direction setter
  const setDir = useCallback((newDir: Point) => {
    const current = stateRef.current.direction;
    // Disallow 180-degree reverse
    if (current.x + newDir.x === 0 && current.y + newDir.y === 0) return;
    stateRef.current.nextDirection = newDir;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') setDir({ x: 0, y: -1 });
      if (k === 'arrowdown' || k === 's') setDir({ x: 0, y: 1 });
      if (k === 'arrowleft' || k === 'a') setDir({ x: -1, y: 0 });
      if (k === 'arrowright' || k === 'd') setDir({ x: 1, y: 0 });
      if (e.key === ' ' || e.key === 'Spacebar') {
        if (stateRef.current.state !== 'playing') {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setDir, startGame]);

  // Game Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const interval = speed === 'normal' ? 110 : speed === 'fast' ? 80 : 55;

    const loop = (timestamp: number) => {
      const st = stateRef.current;

      if (st.state === 'playing') {
        if (timestamp - st.lastMoveTime > interval) {
          st.lastMoveTime = timestamp;
          st.direction = st.nextDirection;

          const head = {
            x: st.snake[0].x + st.direction.x,
            y: st.snake[0].y + st.direction.y
          };

          // Wall collision
          if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
            st.state = 'gameover';
            setGameState('gameover');
            sound.playGameOver();
            const curHigh = parseInt(localStorage.getItem('retro_snake_high') || '0', 10);
            if (st.score > curHigh) {
              localStorage.setItem('retro_snake_high', String(st.score));
              setHighScore(st.score);
            }
          } else if (st.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
            // Self collision
            st.state = 'gameover';
            setGameState('gameover');
            sound.playGameOver();
            const curHigh = parseInt(localStorage.getItem('retro_snake_high') || '0', 10);
            if (st.score > curHigh) {
              localStorage.setItem('retro_snake_high', String(st.score));
              setHighScore(st.score);
            }
          } else {
            st.snake.unshift(head);

            // Check food
            if (head.x === st.food.x && head.y === st.food.y) {
              sound.playPoint();
              st.score += 10;
              setScore(st.score);
              st.food = spawnFood(st.snake);

              // Chance of bonus food
              if (!st.bonusFood && Math.random() < 0.25) {
                st.bonusFood = {
                  ...spawnFood(st.snake),
                  timer: 60
                };
              }
            } else if (st.bonusFood && head.x === st.bonusFood.x && head.y === st.bonusFood.y) {
              sound.playPoint();
              st.score += 50;
              setScore(st.score);
              st.bonusFood = null;
            } else {
              st.snake.pop();
            }

            // Tick bonus food timer
            if (st.bonusFood) {
              st.bonusFood.timer -= 1;
              if (st.bonusFood.timer <= 0) st.bonusFood = null;
            }
          }
        }
      }

      // Draw
      const W = canvas.width;
      const H = canvas.height;

      // Dark background
      ctx.fillStyle = '#06130d';
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * GRID_SIZE, 0);
        ctx.lineTo(x * GRID_SIZE, H);
        ctx.stroke();
      }
      for (let y = 0; y < ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * GRID_SIZE);
        ctx.lineTo(W, y * GRID_SIZE);
        ctx.stroke();
      }

      // Draw Normal Food (Glowing Apple)
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(
        st.food.x * GRID_SIZE + GRID_SIZE / 2,
        st.food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Bonus Food if active
      if (st.bonusFood) {
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(
          st.bonusFood.x * GRID_SIZE + GRID_SIZE / 2,
          st.bonusFood.y * GRID_SIZE + GRID_SIZE / 2,
          GRID_SIZE / 2.2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Snake
      st.snake.forEach((seg, idx) => {
        if (idx === 0) {
          // Head
          ctx.fillStyle = '#34d399';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 12;
        } else {
          // Body gradient
          const ratio = idx / st.snake.length;
          ctx.fillStyle = idx % 2 === 0 ? '#10b981' : '#059669';
          ctx.shadowBlur = 0;
        }

        const radius = idx === 0 ? 5 : 3;
        const pad = 1.5;
        ctx.beginPath();
        ctx.roundRect(
          seg.x * GRID_SIZE + pad,
          seg.y * GRID_SIZE + pad,
          GRID_SIZE - pad * 2,
          GRID_SIZE - pad * 2,
          radius
        );
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Overlay if not playing
      if (st.state === 'idle') {
        ctx.fillStyle = 'rgba(6, 19, 13, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 24px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('RETRO SNAKE NEON', W / 2, H / 2 - 25);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Use Arrow Keys or WASD to navigate. Spacebar to start.', W / 2, H / 2 + 10);
      } else if (st.state === 'gameover') {
        ctx.fillStyle = 'rgba(6, 19, 13, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 28px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', W / 2, H / 2 - 30);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '16px "Chakra Petch", sans-serif';
        ctx.fillText(`Final Length: ${st.snake.length} | Score: ${st.score}`, W / 2, H / 2);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Press SPACEBAR or click Play Again to retry', W / 2, H / 2 + 35);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  const handleTouchDirection = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (dir === 'up') setDir({ x: 0, y: -1 });
    if (dir === 'down') setDir({ x: 0, y: 1 });
    if (dir === 'left') setDir({ x: -1, y: 0 });
    if (dir === 'right') setDir({ x: 1, y: 0 });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto select-none">
      {/* HUD Header */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-2.5 flex items-center justify-between font-gaming text-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400 text-xs">SCORE: </span>
            <span className="text-emerald-400 font-bold text-base">{score}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs">HIGH: </span>
            <span className="text-amber-400 font-bold">{highScore}</span>
          </div>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            {(['normal', 'fast', 'hyper'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded capitalize ${
                  speed === s ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSoundMuted(!sound.toggleSound())}
            className="p-1 rounded text-slate-400 hover:text-white"
            title="Toggle Sound"
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Canvas container */}
      <div className="relative w-full aspect-[28/22] bg-[#06130d] overflow-hidden border-x border-b border-slate-800 rounded-b-xl shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={COLS * GRID_SIZE}
          height={ROWS * GRID_SIZE}
          className="w-full h-full object-contain cursor-pointer"
          onClick={() => {
            if (gameState !== 'playing') startGame();
          }}
        />

        {gameState !== 'playing' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold font-gaming rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 text-lg active:scale-95 transition-all"
            >
              {gameState === 'idle' ? (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  START SNAKE
                </>
              ) : (
                <>
                  <RotateCcw className="w-5 h-5" />
                  PLAY AGAIN
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Controller */}
      <div className="w-full md:hidden">
        <TouchController
          onDirection={handleTouchDirection}
          onAction={startGame}
          onActionName="START"
          onSecondary={startGame}
          onSecondaryName="RETRY"
        />
      </div>
    </div>
  );
};
