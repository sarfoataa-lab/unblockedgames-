import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sound } from '../utils/audio';
import { TouchController } from '../components/TouchController';
import { Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface Asteroid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  vertices: number;
  offsets: number[];
}

export const CosmicAsteroids: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [soundMuted, setSoundMuted] = useState(!sound.enabled);

  const stateRef = useRef({
    ship: { x: 300, y: 200, angle: -Math.PI / 2, vx: 0, vy: 0, radius: 12, thrusting: false },
    lasers: [] as { x: number; y: number; vx: number; vy: number; life: number }[],
    asteroids: [] as Asteroid[],
    keys: { left: false, right: false, up: false },
    score: 0,
    lives: 3,
    state: 'idle' as 'idle' | 'playing' | 'gameover'
  });

  useEffect(() => {
    const saved = localStorage.getItem('cosmic_asteroids_high');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const createAsteroid = (x: number, y: number, radius: number): Asteroid => {
    const vertices = Math.floor(Math.random() * 4) + 8;
    const offsets = [];
    for (let i = 0; i < vertices; i++) {
      offsets.push(0.8 + Math.random() * 0.4);
    }
    const angle = Math.random() * Math.PI * 2;
    const speed = (60 / radius) * (0.8 + Math.random() * 0.6);
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius,
      vertices,
      offsets
    };
  };

  const initAsteroids = () => {
    const asts: Asteroid[] = [];
    for (let i = 0; i < 5; i++) {
      let x = Math.random() * 600;
      let y = Math.random() * 400;
      while (Math.hypot(x - 300, y - 200) < 100) {
        x = Math.random() * 600;
        y = Math.random() * 400;
      }
      asts.push(createAsteroid(x, y, 36));
    }
    return asts;
  };

  const shootLaser = useCallback(() => {
    const st = stateRef.current;
    if (st.state !== 'playing') return;
    const speed = 8;
    st.lasers.push({
      x: st.ship.x + Math.cos(st.ship.angle) * st.ship.radius,
      y: st.ship.y + Math.sin(st.ship.angle) * st.ship.radius,
      vx: Math.cos(st.ship.angle) * speed + st.ship.vx * 0.4,
      vy: Math.sin(st.ship.angle) * speed + st.ship.vy * 0.4,
      life: 50
    });
    sound.playLaser();
  }, []);

  const startGame = useCallback(() => {
    sound.playClick();
    const st = stateRef.current;
    st.ship = { x: 300, y: 200, angle: -Math.PI / 2, vx: 0, vy: 0, radius: 12, thrusting: false };
    st.lasers = [];
    st.asteroids = initAsteroids();
    st.score = 0;
    st.lives = 3;
    st.state = 'playing';

    setScore(0);
    setLives(3);
    setGameState('playing');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'a', 'A', 'd', 'D', 'w', 'W', ' '].includes(e.key)) {
        e.preventDefault();
      }
      const st = stateRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') st.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') st.keys.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') st.keys.up = true;
      if (e.key === ' ' || e.key === 'Spacebar') {
        if (st.state === 'playing') shootLaser();
        else startGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const st = stateRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') st.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') st.keys.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') st.keys.up = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [shootLaser, startGame]);

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
        // Ship controls
        if (st.keys.left) st.ship.angle -= 0.08;
        if (st.keys.right) st.ship.angle += 0.08;
        if (st.keys.up) {
          st.ship.vx += Math.cos(st.ship.angle) * 0.15;
          st.ship.vy += Math.sin(st.ship.angle) * 0.15;
          st.ship.thrusting = true;
        } else {
          st.ship.thrusting = false;
        }

        // Friction
        st.ship.vx *= 0.985;
        st.ship.vy *= 0.985;
        st.ship.x += st.ship.vx;
        st.ship.y += st.ship.vy;

        // Screen wrap ship
        if (st.ship.x < 0) st.ship.x = W;
        else if (st.ship.x > W) st.ship.x = 0;
        if (st.ship.y < 0) st.ship.y = H;
        else if (st.ship.y > H) st.ship.y = 0;

        // Lasers
        for (let i = st.lasers.length - 1; i >= 0; i--) {
          const l = st.lasers[i];
          l.x += l.vx;
          l.y += l.vy;
          l.life -= 1;

          if (l.x < 0) l.x = W;
          else if (l.x > W) l.x = 0;
          if (l.y < 0) l.y = H;
          else if (l.y > H) l.y = 0;

          if (l.life <= 0) {
            st.lasers.splice(i, 1);
            continue;
          }

          // Check laser hit asteroid
          let hit = false;
          for (let a = st.asteroids.length - 1; a >= 0; a--) {
            const ast = st.asteroids[a];
            if (Math.hypot(l.x - ast.x, l.y - ast.y) < ast.radius) {
              sound.playHit();
              sound.playPoint();
              st.score += Math.round(100 - ast.radius);
              setScore(st.score);

              // Split asteroid
              if (ast.radius > 16) {
                st.asteroids.push(createAsteroid(ast.x, ast.y, ast.radius / 2));
                st.asteroids.push(createAsteroid(ast.x, ast.y, ast.radius / 2));
              }
              st.asteroids.splice(a, 1);
              hit = true;
              break;
            }
          }

          if (hit) {
            st.lasers.splice(i, 1);
          }
        }

        // Asteroids move & collision with ship
        for (const ast of st.asteroids) {
          ast.x += ast.vx;
          ast.y += ast.vy;

          if (ast.x < 0) ast.x = W;
          else if (ast.x > W) ast.x = 0;
          if (ast.y < 0) ast.y = H;
          else if (ast.y > H) ast.y = 0;

          // Hit player ship
          if (Math.hypot(st.ship.x - ast.x, st.ship.y - ast.y) < ast.radius + st.ship.radius) {
            sound.playHit();
            st.lives -= 1;
            setLives(st.lives);

            // Reset ship to center
            st.ship.x = W / 2;
            st.ship.y = H / 2;
            st.ship.vx = 0;
            st.ship.vy = 0;

            if (st.lives <= 0) {
              st.state = 'gameover';
              setGameState('gameover');
              sound.playGameOver();
              const curHigh = parseInt(localStorage.getItem('cosmic_asteroids_high') || '0', 10);
              if (st.score > curHigh) {
                localStorage.setItem('cosmic_asteroids_high', String(st.score));
                setHighScore(st.score);
              }
            }
          }
        }

        // Respawn wave if all asteroids destroyed
        if (st.asteroids.length === 0) {
          st.asteroids = initAsteroids();
        }
      }

      // Render
      ctx.fillStyle = '#080511';
      ctx.fillRect(0, 0, W, H);

      // Starfield
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 67) % W;
        const sy = (i * 41) % H;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw Asteroids
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 6;
      for (const ast of st.asteroids) {
        ctx.beginPath();
        for (let i = 0; i < ast.vertices; i++) {
          const a = (i / ast.vertices) * Math.PI * 2;
          const r = ast.radius * ast.offsets[i];
          const px = ast.x + Math.cos(a) * r;
          const py = ast.y + Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Draw Lasers
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      for (const l of st.lasers) {
        ctx.beginPath();
        ctx.arc(l.x, l.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Draw Ship
      if (st.lives > 0) {
        ctx.save();
        ctx.translate(st.ship.x, st.ship.y);
        ctx.rotate(st.ship.angle);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(st.ship.radius, 0);
        ctx.lineTo(-st.ship.radius, -st.ship.radius * 0.7);
        ctx.lineTo(-st.ship.radius * 0.6, 0);
        ctx.lineTo(-st.ship.radius, st.ship.radius * 0.7);
        ctx.closePath();
        ctx.stroke();

        // Thrust flame
        if (st.ship.thrusting) {
          ctx.strokeStyle = '#f97316';
          ctx.beginPath();
          ctx.moveTo(-st.ship.radius * 0.7, -4);
          ctx.lineTo(-st.ship.radius * 1.5 - Math.random() * 5, 0);
          ctx.lineTo(-st.ship.radius * 0.7, 4);
          ctx.stroke();
        }

        ctx.restore();
      }

      // Overlays
      if (st.state === 'idle') {
        ctx.fillStyle = 'rgba(8, 5, 17, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 24px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('COSMIC ASTEROIDS', W / 2, H / 2 - 25);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Rotate with Left/Right. Up to thrust. Space to fire.', W / 2, H / 2 + 10);
      } else if (st.state === 'gameover') {
        ctx.fillStyle = 'rgba(8, 5, 17, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 28px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SHIP DESTROYED', W / 2, H / 2 - 25);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '16px "Chakra Petch", sans-serif';
        ctx.fillText(`Final Bounty: ${st.score}`, W / 2, H / 2 + 5);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleTouchDirection = (dir: 'up' | 'down' | 'left' | 'right') => {
    const st = stateRef.current;
    if (dir === 'left') st.ship.angle -= 0.4;
    if (dir === 'right') st.ship.angle += 0.4;
    if (dir === 'up') {
      st.ship.vx += Math.cos(st.ship.angle) * 1.5;
      st.ship.vy += Math.sin(st.ship.angle) * 1.5;
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto select-none">
      {/* HUD Bar */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-2.5 flex items-center justify-between font-gaming text-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400 text-xs">SCORE: </span>
            <span className="text-purple-400 font-bold text-base">{score}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs">BEST: </span>
            <span className="text-pink-400 font-bold">{highScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-xs mr-1">SHIPS:</span>
            {Array.from({ length: 3 }).map((_, idx) => (
              <span
                key={idx}
                className={`text-base ${idx < lives ? 'text-cyan-400' : 'text-slate-700 opacity-40'}`}
              >
                ▲
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
      <div className="relative w-full aspect-[3/2] bg-[#080511] overflow-hidden border-x border-b border-slate-800 rounded-b-xl shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-full object-contain"
        />

        {gameState !== 'playing' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold font-gaming rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 text-lg active:scale-95 transition-all"
            >
              {gameState === 'idle' ? (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  LAUNCH SHIP
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

      {/* Touch Controller */}
      <div className="w-full md:hidden">
        <TouchController
          onDirection={handleTouchDirection}
          onAction={shootLaser}
          onActionName="BLAST"
          onSecondary={startGame}
          onSecondaryName="RETRY"
        />
      </div>
    </div>
  );
};
