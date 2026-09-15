import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sound } from '../utils/audio';
import { Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

export const CyberFlappy: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [soundMuted, setSoundMuted] = useState(!sound.enabled);

  const stateRef = useRef({
    bird: { x: 80, y: 200, vy: 0, radius: 14, gravity: 0.38, jump: -6.5 },
    pipes: [] as { x: number; topH: number; bottomY: number; width: number; passed: boolean }[],
    score: 0,
    state: 'idle' as 'idle' | 'playing' | 'gameover',
    lastPipeSpawn: 0,
    pipeGap: 130
  });

  useEffect(() => {
    const saved = localStorage.getItem('cyber_flappy_high');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const jump = useCallback(() => {
    const st = stateRef.current;
    if (st.state === 'playing') {
      st.bird.vy = st.bird.jump;
      sound.playJump();
    } else if (st.state === 'idle' || st.state === 'gameover') {
      startGame();
    }
  }, []);

  const startGame = useCallback(() => {
    sound.playClick();
    const st = stateRef.current;
    st.bird.y = 200;
    st.bird.vy = 0;
    st.pipes = [];
    st.score = 0;
    st.lastPipeSpawn = 0;
    st.state = 'playing';

    setScore(0);
    setGameState('playing');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ([' ', 'ArrowUp', 'w', 'W'].includes(e.key)) {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const loop = (timestamp: number) => {
      const st = stateRef.current;

      if (st.state === 'playing') {
        // Physics update
        st.bird.vy += st.bird.gravity;
        st.bird.y += st.bird.vy;

        // Ground/ceiling collision
        if (st.bird.y + st.bird.radius >= H - 20 || st.bird.y - st.bird.radius <= 0) {
          st.state = 'gameover';
          setGameState('gameover');
          sound.playHit();
          sound.playGameOver();
          const curHigh = parseInt(localStorage.getItem('cyber_flappy_high') || '0', 10);
          if (st.score > curHigh) {
            localStorage.setItem('cyber_flappy_high', String(st.score));
            setHighScore(st.score);
          }
        }

        // Spawn pipes
        if (timestamp - st.lastPipeSpawn > 1600) {
          st.lastPipeSpawn = timestamp;
          const minH = 60;
          const maxH = H - st.pipeGap - minH - 30;
          const topH = Math.floor(Math.random() * (maxH - minH + 1)) + minH;
          st.pipes.push({
            x: W,
            topH: topH,
            bottomY: topH + st.pipeGap,
            width: 48,
            passed: false
          });
        }

        // Move pipes
        for (let i = st.pipes.length - 1; i >= 0; i--) {
          const p = st.pipes[i];
          p.x -= 2.6;

          // Check passed for score
          if (!p.passed && p.x + p.width < st.bird.x) {
            p.passed = true;
            st.score += 1;
            setScore(st.score);
            sound.playPoint();
          }

          // Check collision
          const birdLeft = st.bird.x - st.bird.radius;
          const birdRight = st.bird.x + st.bird.radius;
          const birdTop = st.bird.y - st.bird.radius;
          const birdBottom = st.bird.y + st.bird.radius;

          if (birdRight > p.x && birdLeft < p.x + p.width) {
            if (birdTop < p.topH || birdBottom > p.bottomY) {
              st.state = 'gameover';
              setGameState('gameover');
              sound.playHit();
              sound.playGameOver();
              const curHigh = parseInt(localStorage.getItem('cyber_flappy_high') || '0', 10);
              if (st.score > curHigh) {
                localStorage.setItem('cyber_flappy_high', String(st.score));
                setHighScore(st.score);
              }
            }
          }

          // Remove offscreen
          if (p.x + p.width < -10) {
            st.pipes.splice(i, 1);
          }
        }
      }

      // Render
      ctx.fillStyle = '#0a0a1f';
      ctx.fillRect(0, 0, W, H);

      // City Skyline Background
      ctx.fillStyle = '#121235';
      const buildingWidth = 35;
      for (let b = 0; b < W / buildingWidth + 2; b++) {
        const h = 80 + ((b * 47) % 110);
        ctx.fillRect(b * buildingWidth, H - h - 20, buildingWidth - 3, h);
        // Yellow windows
        ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
        for (let w = 0; w < h - 20; w += 18) {
          ctx.fillRect(b * buildingWidth + 6, H - 20 - w, 6, 8);
        }
        ctx.fillStyle = '#121235';
      }

      // Draw Pipes (Neon laser gates)
      for (const p of st.pipes) {
        // Top pipe
        const gradTop = ctx.createLinearGradient(p.x, 0, p.x + p.width, 0);
        gradTop.addColorStop(0, '#06b6d4');
        gradTop.addColorStop(1, '#0284c7');
        ctx.fillStyle = gradTop;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.fillRect(p.x, 0, p.width, p.topH);

        // Top pipe collar
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(p.x - 3, p.topH - 12, p.width + 6, 12);

        // Bottom pipe
        const gradBot = ctx.createLinearGradient(p.x, 0, p.x + p.width, 0);
        gradBot.addColorStop(0, '#06b6d4');
        gradBot.addColorStop(1, '#0284c7');
        ctx.fillStyle = gradBot;
        ctx.fillRect(p.x, p.bottomY, p.width, H - p.bottomY);

        // Bottom pipe collar
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(p.x - 3, p.bottomY, p.width + 6, 12);
        ctx.shadowBlur = 0;
      }

      // Ground
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, H - 20, W, 20);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, H - 20, W, 2);

      // Draw Cyber Flappy Bird
      ctx.save();
      ctx.translate(st.bird.x, st.bird.y);
      const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (st.bird.vy * 0.08)));
      ctx.rotate(angle);

      // Body
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(0, 0, st.bird.radius, st.bird.radius * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(6, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.arc(8, -4, 2, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(-4, 2, 6, 4, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(st.bird.radius - 2, -2);
      ctx.lineTo(st.bird.radius + 6, 0);
      ctx.lineTo(st.bird.radius - 2, 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Overlays
      if (st.state === 'idle') {
        ctx.fillStyle = 'rgba(10, 10, 31, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 24px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CYBER FLAPPY', W / 2, H / 2 - 25);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Click, Tap, or press Spacebar to flap', W / 2, H / 2 + 10);
      } else if (st.state === 'gameover') {
        ctx.fillStyle = 'rgba(10, 10, 31, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 28px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('DRONE CRASHED', W / 2, H / 2 - 30);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '16px "Chakra Petch", sans-serif';
        ctx.fillText(`Gates Passed: ${st.score}`, W / 2, H / 2);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Click, Tap, or press Spacebar to reboot', W / 2, H / 2 + 35);
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
            <span className="text-amber-400 font-bold text-base">{score}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs">BEST: </span>
            <span className="text-cyan-400 font-bold">{highScore}</span>
          </div>
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

      {/* Canvas */}
      <div
        className="relative w-full aspect-[4/3] bg-[#0a0a1f] overflow-hidden border-x border-b border-slate-800 rounded-b-xl shadow-2xl flex items-center justify-center cursor-pointer"
        onPointerDown={(e) => {
          e.preventDefault();
          jump();
        }}
      >
        <canvas
          ref={canvasRef}
          width={480}
          height={360}
          className="w-full h-full object-contain"
        />

        {gameState !== 'playing' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <button
              type="button"
              onClick={jump}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold font-gaming rounded-xl shadow-lg shadow-amber-500/30 flex items-center gap-2 text-lg active:scale-95 transition-all"
            >
              {gameState === 'idle' ? (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  FLAP TO FLY
                </>
              ) : (
                <>
                  <RotateCcw className="w-5 h-5" />
                  TRY AGAIN
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Tap hint button for mobile */}
      <div className="w-full mt-3 flex justify-center">
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            jump();
          }}
          className="w-full max-w-sm py-3.5 bg-slate-800 active:bg-amber-600 rounded-xl border border-slate-700 font-bold font-gaming text-slate-200 active:text-slate-950 text-base shadow-md active:scale-95 transition-all touch-none"
        >
          TAP TO THRUST 🚀
        </button>
      </div>
    </div>
  );
};
