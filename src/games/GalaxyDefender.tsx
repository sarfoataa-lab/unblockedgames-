import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sound } from '../utils/audio';
import { TouchController } from '../components/TouchController';
import { Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface GalaxyDefenderProps {
  onGameOver?: (score: number) => void;
}

export const GalaxyDefender: React.FC<GalaxyDefenderProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'victory'>('idle');
  const [soundMuted, setSoundMuted] = useState(!sound.enabled);

  const gameStateRef = useRef({
    player: { x: 280, y: 360, width: 34, height: 20, speed: 6, dx: 0 },
    lasers: [] as { x: number; y: number; width: number; height: number; speed: number; isEnemy?: boolean }[],
    enemies: [] as { x: number; y: number; width: number; height: number; row: number; alive: boolean; color: string }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    shields: [] as { x: number; y: number; hp: number }[],
    enemyDirection: 1,
    enemyStepDown: false,
    enemySpeed: 1,
    lastEnemyShot: 0,
    keys: { left: false, right: false, space: false },
    score: 0,
    lives: 3,
    wave: 1,
    state: 'idle' as 'idle' | 'playing' | 'gameover' | 'victory'
  });

  useEffect(() => {
    const saved = localStorage.getItem('galaxy_defender_high');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const initEnemies = (currentWave: number) => {
    const enemies = [];
    const rows = 4;
    const cols = 8;
    const colors = ['#ec4899', '#a855f7', '#06b6d4', '#10b981'];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        enemies.push({
          x: 60 + c * 56,
          y: 45 + r * 38,
          width: 32,
          height: 22,
          row: r,
          alive: true,
          color: colors[r % colors.length]
        });
      }
    }
    return enemies;
  };

  const initShields = () => {
    const shields = [];
    const bunkerX = [100, 240, 380, 500];
    for (const bx of bunkerX) {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          shields.push({
            x: bx + c * 10,
            y: 310 + r * 8,
            hp: 3
          });
        }
      }
    }
    return shields;
  };

  const startGame = useCallback(() => {
    sound.playClick();
    const g = gameStateRef.current;
    g.score = 0;
    g.lives = 3;
    g.wave = 1;
    g.player.x = 280;
    g.player.dx = 0;
    g.lasers = [];
    g.particles = [];
    g.enemies = initEnemies(1);
    g.shields = initShields();
    g.enemyDirection = 1;
    g.enemySpeed = 1;
    g.state = 'playing';

    setScore(0);
    setLives(3);
    setWave(1);
    setGameState('playing');
  }, []);

  const shootLaser = useCallback(() => {
    const g = gameStateRef.current;
    if (g.state !== 'playing') return;
    
    // Allow up to 3 player lasers on screen
    const playerLasers = g.lasers.filter(l => !l.isEnemy);
    if (playerLasers.length < 3) {
      g.lasers.push({
        x: g.player.x + g.player.width / 2 - 2,
        y: g.player.y - 6,
        width: 4,
        height: 12,
        speed: 9
      });
      sound.playLaser();
    }
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'A', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
      }
      const g = gameStateRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') g.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') g.keys.right = true;
      if (e.key === ' ' || e.key === 'Spacebar') {
        if (g.state === 'playing') {
          shootLaser();
        } else if (g.state === 'idle' || g.state === 'gameover' || g.state === 'victory') {
          startGame();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const g = gameStateRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') g.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') g.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [shootLaser, startGame]);

  // Main game loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = (timestamp: number) => {
      const g = gameStateRef.current;
      const W = canvas.width;
      const H = canvas.height;

      // Update
      if (g.state === 'playing') {
        // Player movement
        if (g.keys.left) g.player.x -= g.player.speed;
        if (g.keys.right) g.player.x += g.player.speed;
        g.player.x = Math.max(10, Math.min(W - g.player.width - 10, g.player.x));

        // Lasers movement
        for (let i = g.lasers.length - 1; i >= 0; i--) {
          const l = g.lasers[i];
          if (l.isEnemy) {
            l.y += l.speed;
            if (l.y > H) {
              g.lasers.splice(i, 1);
              continue;
            }

            // Check hit player
            if (
              l.x + l.width >= g.player.x &&
              l.x <= g.player.x + g.player.width &&
              l.y + l.height >= g.player.y &&
              l.y <= g.player.y + g.player.height
            ) {
              g.lasers.splice(i, 1);
              sound.playHit();
              g.lives -= 1;
              setLives(g.lives);

              // Explosion particles on player
              for (let p = 0; p < 16; p++) {
                g.particles.push({
                  x: g.player.x + g.player.width / 2,
                  y: g.player.y + g.player.height / 2,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  life: 25,
                  color: '#38bdf8'
                });
              }

              if (g.lives <= 0) {
                g.state = 'gameover';
                setGameState('gameover');
                sound.playGameOver();
                // Update high score
                const curHigh = parseInt(localStorage.getItem('galaxy_defender_high') || '0', 10);
                if (g.score > curHigh) {
                  localStorage.setItem('galaxy_defender_high', String(g.score));
                  setHighScore(g.score);
                }
              }
              continue;
            }

            // Check hit shields
            for (let s = g.shields.length - 1; s >= 0; s--) {
              const sh = g.shields[s];
              if (
                l.x + l.width >= sh.x &&
                l.x <= sh.x + 10 &&
                l.y + l.height >= sh.y &&
                l.y <= sh.y + 8
              ) {
                g.lasers.splice(i, 1);
                sh.hp -= 1;
                if (sh.hp <= 0) g.shields.splice(s, 1);
                break;
              }
            }
          } else {
            // Player laser
            l.y -= l.speed;
            if (l.y < 0) {
              g.lasers.splice(i, 1);
              continue;
            }

            // Check hit enemies
            let hitEnemy = false;
            for (const enemy of g.enemies) {
              if (
                enemy.alive &&
                l.x + l.width >= enemy.x &&
                l.x <= enemy.x + enemy.width &&
                l.y <= enemy.y + enemy.height &&
                l.y + l.height >= enemy.y
              ) {
                enemy.alive = false;
                hitEnemy = true;
                sound.playPoint();
                g.score += (4 - enemy.row) * 20;
                setScore(g.score);

                // Spawn explosion particles
                for (let p = 0; p < 12; p++) {
                  g.particles.push({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height / 2,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,
                    life: 20,
                    color: enemy.color
                  });
                }
                break;
              }
            }

            if (hitEnemy) {
              g.lasers.splice(i, 1);
              continue;
            }

            // Check hit shields
            for (let s = g.shields.length - 1; s >= 0; s--) {
              const sh = g.shields[s];
              if (
                l.x + l.width >= sh.x &&
                l.x <= sh.x + 10 &&
                l.y <= sh.y + 8 &&
                l.y + l.height >= sh.y
              ) {
                g.lasers.splice(i, 1);
                sh.hp -= 1;
                if (sh.hp <= 0) g.shields.splice(s, 1);
                break;
              }
            }
          }
        }

        // Enemies movement
        let moveDown = false;
        const aliveEnemies = g.enemies.filter(e => e.alive);

        if (aliveEnemies.length === 0) {
          // Next wave!
          g.wave += 1;
          setWave(g.wave);
          g.enemies = initEnemies(g.wave);
          g.enemySpeed = 1 + g.wave * 0.3;
          sound.playPoint();
        } else {
          for (const enemy of aliveEnemies) {
            if (
              (g.enemyDirection === 1 && enemy.x + enemy.width >= W - 15) ||
              (g.enemyDirection === -1 && enemy.x <= 15)
            ) {
              moveDown = true;
              break;
            }
          }

          if (moveDown) {
            g.enemyDirection *= -1;
            for (const enemy of aliveEnemies) {
              enemy.y += 12;
              if (enemy.y + enemy.height >= g.player.y) {
                g.state = 'gameover';
                setGameState('gameover');
                sound.playGameOver();
              }
            }
          } else {
            const currentSpd = g.enemySpeed * (1 + (1 - aliveEnemies.length / 32) * 1.5);
            for (const enemy of aliveEnemies) {
              enemy.x += g.enemyDirection * currentSpd;
            }
          }

          // Enemy shooting
          if (timestamp - g.lastEnemyShot > Math.max(600, 1500 - g.wave * 120)) {
            g.lastEnemyShot = timestamp;
            const shooters = aliveEnemies.filter(e => {
              // Only bottom-most in each column
              return !aliveEnemies.some(other => other.alive && Math.abs(other.x - e.x) < 20 && other.y > e.y);
            });
            if (shooters.length > 0) {
              const shooter = shooters[Math.floor(Math.random() * shooters.length)];
              g.lasers.push({
                x: shooter.x + shooter.width / 2 - 2,
                y: shooter.y + shooter.height,
                width: 4,
                height: 10,
                speed: 4 + g.wave * 0.4,
                isEnemy: true
              });
            }
          }
        }

        // Particles
        for (let p = g.particles.length - 1; p >= 0; p--) {
          const part = g.particles[p];
          part.x += part.vx;
          part.y += part.vy;
          part.life -= 1;
          if (part.life <= 0) g.particles.splice(p, 1);
        }
      }

      // Render
      ctx.fillStyle = '#070b14';
      ctx.fillRect(0, 0, W, H);

      // Starfield background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let s = 0; s < 30; s++) {
        const sx = ((s * 47) + timestamp * 0.02) % W;
        const sy = (s * 33) % H;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw Shields
      for (const sh of g.shields) {
        ctx.fillStyle = sh.hp === 3 ? '#10b981' : sh.hp === 2 ? '#34d399' : '#059669';
        ctx.fillRect(sh.x, sh.y, 9, 7);
      }

      // Draw Enemies
      for (const e of g.enemies) {
        if (!e.alive) continue;
        ctx.fillStyle = e.color;
        // Pixel-art alien shape
        ctx.fillRect(e.x + 4, e.y, e.width - 8, 4);
        ctx.fillRect(e.x, e.y + 4, e.width, 10);
        ctx.fillRect(e.x + 4, e.y + 14, e.width - 8, 4);
        // Alien eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(e.x + 6, e.y + 6, 4, 4);
        ctx.fillRect(e.x + e.width - 10, e.y + 6, 4, 4);
      }

      // Draw Lasers
      for (const l of g.lasers) {
        if (l.isEnemy) {
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 6;
          ctx.fillRect(l.x, l.y, l.width, l.height);
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.fillRect(l.x, l.y, l.width, l.height);
          ctx.shadowBlur = 0;
        }
      }

      // Draw Particles
      for (const p of g.particles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2.5, 2.5);
      }

      // Draw Player Ship
      if (g.lives > 0) {
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(g.player.x + g.player.width / 2, g.player.y);
        ctx.lineTo(g.player.x + g.player.width, g.player.y + g.player.height);
        ctx.lineTo(g.player.x, g.player.y + g.player.height);
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(g.player.x + g.player.width / 2 - 2, g.player.y + 4, 4, 8);
      }

      // Overlay if not playing
      if (g.state === 'idle') {
        ctx.fillStyle = 'rgba(7, 11, 20, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GALAXY DEFENDER', W / 2, H / 2 - 30);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Press SPACEBAR or TAP PLAY to engage orbit defense', W / 2, H / 2 + 10);
      } else if (g.state === 'gameover') {
        ctx.fillStyle = 'rgba(7, 11, 20, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 28px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('MISSION FAILED', W / 2, H / 2 - 35);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '16px "Chakra Petch", sans-serif';
        ctx.fillText(`Final Score: ${g.score} | Wave: ${g.wave}`, W / 2, H / 2);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Press SPACEBAR or click Restart to launch again', W / 2, H / 2 + 35);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleTouchDirection = (dir: 'up' | 'down' | 'left' | 'right') => {
    const g = gameStateRef.current;
    if (dir === 'left') {
      g.player.x -= 20;
    } else if (dir === 'right') {
      g.player.x += 20;
    } else if (dir === 'up') {
      shootLaser();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto select-none">
      {/* HUD Header */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-2.5 flex items-center justify-between font-gaming text-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400 text-xs">SCORE: </span>
            <span className="text-cyan-400 font-bold text-base">{score}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs">WAVE: </span>
            <span className="text-purple-400 font-bold">{wave}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-xs mr-1">LIVES:</span>
            {Array.from({ length: 3 }).map((_, idx) => (
              <span
                key={idx}
                className={`text-base ${idx < lives ? 'text-red-500' : 'text-slate-700 opacity-40'}`}
              >
                ♥
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

      {/* Canvas container */}
      <div className="relative w-full aspect-[4/3] bg-black overflow-hidden border-x border-b border-slate-800 rounded-b-xl shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full object-contain cursor-crosshair"
          onClick={() => {
            if (gameState === 'playing') shootLaser();
            else startGame();
          }}
        />

        {gameState !== 'playing' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-gaming rounded-xl shadow-lg shadow-cyan-500/30 flex items-center gap-2 text-lg active:scale-95 transition-all"
            >
              {gameState === 'idle' ? (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  START GAME
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
          onAction={shootLaser}
          onActionName="FIRE"
          onSecondary={startGame}
          onSecondaryName="RESTART"
        />
      </div>
    </div>
  );
};
