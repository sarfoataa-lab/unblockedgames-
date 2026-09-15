import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sound } from '../utils/audio';
import { Play, RotateCcw, Volume2, VolumeX, ArrowLeft, ArrowRight } from 'lucide-react';

export const BrickBreaker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'victory'>('idle');
  const [soundMuted, setSoundMuted] = useState(!sound.enabled);

  const stateRef = useRef({
    paddle: { x: 230, y: 390, width: 85, height: 12, speed: 7 },
    ball: { x: 270, y: 375, radius: 6, vx: 3.5, vy: -3.5, attached: true },
    bricks: [] as { x: number; y: number; width: number; height: number; color: string; points: number; alive: boolean }[],
    keys: { left: false, right: false },
    score: 0,
    lives: 3,
    state: 'idle' as 'idle' | 'playing' | 'gameover' | 'victory'
  });

  useEffect(() => {
    const saved = localStorage.getItem('brick_breaker_high');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const initBricks = () => {
    const bricks = [];
    const rows = 5;
    const cols = 8;
    const brickW = 60;
    const brickH = 18;
    const pad = 6;
    const offX = 35;
    const offY = 50;

    const rowColors = ['#ec4899', '#a855f7', '#3b82f6', '#10b981', '#f59e0b'];
    const rowPoints = [50, 40, 30, 20, 10];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: offX + c * (brickW + pad),
          y: offY + r * (brickH + pad),
          width: brickW,
          height: brickH,
          color: rowColors[r],
          points: rowPoints[r],
          alive: true
        });
      }
    }
    return bricks;
  };

  const startGame = useCallback(() => {
    sound.playClick();
    const st = stateRef.current;
    st.paddle.x = 230;
    st.ball.x = 270;
    st.ball.y = 375;
    st.ball.vx = (Math.random() > 0.5 ? 1 : -1) * 3.8;
    st.ball.vy = -3.8;
    st.ball.attached = false;
    st.bricks = initBricks();
    st.score = 0;
    st.lives = 3;
    st.state = 'playing';

    setScore(0);
    setLives(3);
    setGameState('playing');
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D', ' '].includes(e.key)) {
        e.preventDefault();
      }
      const st = stateRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') st.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') st.keys.right = true;
      if (e.key === ' ' || e.key === 'Spacebar') {
        if (st.state !== 'playing') startGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const st = stateRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') st.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') st.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startGame]);

  // Mouse / Pointer move for paddle
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const st = stateRef.current;
    st.paddle.x = Math.max(10, Math.min(canvas.width - st.paddle.width - 10, mouseX - st.paddle.width / 2));
  };

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const loop = () => {
      const st = stateRef.current;

      if (st.state === 'playing') {
        // Paddle movement by keys
        if (st.keys.left) st.paddle.x -= st.paddle.speed;
        if (st.keys.right) st.paddle.x += st.paddle.speed;
        st.paddle.x = Math.max(10, Math.min(W - st.paddle.width - 10, st.paddle.x));

        // Ball movement
        st.ball.x += st.ball.vx;
        st.ball.y += st.ball.vy;

        // Wall collisions
        if (st.ball.x - st.ball.radius <= 0) {
          st.ball.x = st.ball.radius;
          st.ball.vx = Math.abs(st.ball.vx);
          sound.playHit();
        } else if (st.ball.x + st.ball.radius >= W) {
          st.ball.x = W - st.ball.radius;
          st.ball.vx = -Math.abs(st.ball.vx);
          sound.playHit();
        }

        if (st.ball.y - st.ball.radius <= 0) {
          st.ball.y = st.ball.radius;
          st.ball.vy = Math.abs(st.ball.vy);
          sound.playHit();
        } else if (st.ball.y + st.ball.radius >= H) {
          // Ball lost!
          st.lives -= 1;
          setLives(st.lives);
          sound.playHit();

          if (st.lives <= 0) {
            st.state = 'gameover';
            setGameState('gameover');
            sound.playGameOver();
            const curHigh = parseInt(localStorage.getItem('brick_breaker_high') || '0', 10);
            if (st.score > curHigh) {
              localStorage.setItem('brick_breaker_high', String(st.score));
              setHighScore(st.score);
            }
          } else {
            // Reset ball position
            st.ball.x = st.paddle.x + st.paddle.width / 2;
            st.ball.y = st.paddle.y - st.ball.radius - 2;
            st.ball.vx = (Math.random() > 0.5 ? 1 : -1) * 3.8;
            st.ball.vy = -3.8;
          }
        }

        // Paddle collision
        if (
          st.ball.y + st.ball.radius >= st.paddle.y &&
          st.ball.y - st.ball.radius <= st.paddle.y + st.paddle.height &&
          st.ball.x >= st.paddle.x &&
          st.ball.x <= st.paddle.x + st.paddle.width
        ) {
          // Bounce with angle based on hit location
          const hitPoint = (st.ball.x - (st.paddle.x + st.paddle.width / 2)) / (st.paddle.width / 2);
          const speed = Math.sqrt(st.ball.vx * st.ball.vx + st.ball.vy * st.ball.vy);
          const maxAngle = (Math.PI / 3); // 60 degrees
          const bounceAngle = hitPoint * maxAngle;
          
          st.ball.vx = speed * Math.sin(bounceAngle);
          st.ball.vy = -Math.abs(speed * Math.cos(bounceAngle));
          sound.playHit();
        }

        // Brick collisions
        let remainingBricks = 0;
        for (const b of st.bricks) {
          if (!b.alive) continue;
          remainingBricks++;

          if (
            st.ball.x + st.ball.radius >= b.x &&
            st.ball.x - st.ball.radius <= b.x + b.width &&
            st.ball.y + st.ball.radius >= b.y &&
            st.ball.y - st.ball.radius <= b.y + b.height
          ) {
            b.alive = false;
            st.score += b.points;
            setScore(st.score);
            sound.playPoint();

            // Reverse velocity based on side of hit
            const prevX = st.ball.x - st.ball.vx;
            if (prevX < b.x || prevX > b.x + b.width) {
              st.ball.vx = -st.ball.vx;
            } else {
              st.ball.vy = -st.ball.vy;
            }
            break;
          }
        }

        if (remainingBricks === 0) {
          st.state = 'victory';
          setGameState('victory');
          sound.playPoint();
        }
      }

      // Draw
      ctx.fillStyle = '#0a0815';
      ctx.fillRect(0, 0, W, H);

      // Draw Bricks
      for (const b of st.bricks) {
        if (!b.alive) continue;
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.width, b.height, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Paddle
      const paddleGrad = ctx.createLinearGradient(st.paddle.x, 0, st.paddle.x + st.paddle.width, 0);
      paddleGrad.addColorStop(0, '#c084fc');
      paddleGrad.addColorStop(0.5, '#e879f9');
      paddleGrad.addColorStop(1, '#c084fc');
      ctx.fillStyle = paddleGrad;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(st.paddle.x, st.paddle.y, st.paddle.width, st.paddle.height, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Ball
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(st.ball.x, st.ball.y, st.ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Overlays
      if (st.state === 'idle') {
        ctx.fillStyle = 'rgba(10, 8, 21, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 24px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('NEON BRICK BREAKER', W / 2, H / 2 - 25);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Move with mouse or Arrow keys. Break all bricks!', W / 2, H / 2 + 10);
      } else if (st.state === 'gameover') {
        ctx.fillStyle = 'rgba(10, 8, 21, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 28px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', W / 2, H / 2 - 25);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '16px "Chakra Petch", sans-serif';
        ctx.fillText(`Final Score: ${st.score}`, W / 2, H / 2 + 5);
      } else if (st.state === 'victory') {
        ctx.fillStyle = 'rgba(10, 8, 21, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 28px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('STAGE CLEARED! ★★★', W / 2, H / 2 - 25);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '16px "Chakra Petch", sans-serif';
        ctx.fillText(`Victory Score: ${st.score}`, W / 2, H / 2 + 5);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto select-none">
      {/* HUD */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-2.5 flex items-center justify-between font-gaming text-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400 text-xs">SCORE: </span>
            <span className="text-purple-400 font-bold text-base">{score}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs">HIGH: </span>
            <span className="text-pink-400 font-bold">{highScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-xs mr-1">LIVES:</span>
            {Array.from({ length: 3 }).map((_, idx) => (
              <span
                key={idx}
                className={`text-base ${idx < lives ? 'text-purple-400' : 'text-slate-700 opacity-40'}`}
              >
                ●
              </span>
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

      {/* Canvas */}
      <div className="relative w-full aspect-[4/3] bg-[#0a0815] overflow-hidden border-x border-b border-slate-800 rounded-b-xl shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={560}
          height={420}
          onPointerMove={handlePointerMove}
          className="w-full h-full object-contain cursor-ew-resize touch-none"
        />

        {gameState !== 'playing' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-slate-950 font-bold font-gaming rounded-xl shadow-lg shadow-purple-500/30 flex items-center gap-2 text-lg active:scale-95 transition-all"
            >
              {gameState === 'idle' ? (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  START BREAKOUT
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

      {/* Mobile left/right paddle touch buttons */}
      <div className="w-full mt-3 flex justify-center gap-3 md:hidden">
        <button
          type="button"
          onPointerDown={() => { stateRef.current.paddle.x -= 30; }}
          className="flex-1 py-4 bg-slate-800 active:bg-purple-600 rounded-xl border border-slate-700 font-bold text-white flex items-center justify-center touch-none"
        >
          <ArrowLeft className="w-6 h-6 mr-1" /> LEFT
        </button>
        <button
          type="button"
          onPointerDown={() => { stateRef.current.paddle.x += 30; }}
          className="flex-1 py-4 bg-slate-800 active:bg-purple-600 rounded-xl border border-slate-700 font-bold text-white flex items-center justify-center touch-none"
        >
          RIGHT <ArrowRight className="w-6 h-6 ml-1" />
        </button>
      </div>
    </div>
  );
};
