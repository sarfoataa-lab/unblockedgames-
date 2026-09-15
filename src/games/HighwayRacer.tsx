import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sound } from '../utils/audio';
import { TouchController } from '../components/TouchController';
import { Play, RotateCcw, Volume2, VolumeX, Zap } from 'lucide-react';

export const HighwayRacer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [nitro, setNitro] = useState(100);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [soundMuted, setSoundMuted] = useState(!sound.enabled);

  const stateRef = useRef({
    player: { lane: 1, x: 200, y: 340, width: 34, height: 56, speed: 4, targetX: 200 },
    traffic: [] as { x: number; y: number; width: number; height: number; speed: number; color: string }[],
    pickups: [] as { x: number; y: number; type: 'nitro' | 'coin'; collected: boolean }[],
    roadOffset: 0,
    baseSpeed: 5,
    isBoosting: false,
    nitro: 100,
    score: 0,
    distance: 0,
    state: 'idle' as 'idle' | 'playing' | 'gameover',
    lastTrafficSpawn: 0
  });

  const LANES = [110, 200, 290]; // 3 lane centers on a 400px canvas

  useEffect(() => {
    const saved = localStorage.getItem('highway_racer_high');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const changeLane = (dir: 'left' | 'right') => {
    const st = stateRef.current;
    if (st.state !== 'playing') return;
    if (dir === 'left' && st.player.lane > 0) {
      st.player.lane--;
      sound.playClick();
    } else if (dir === 'right' && st.player.lane < 2) {
      st.player.lane++;
      sound.playClick();
    }
    st.player.targetX = LANES[st.player.lane];
  };

  const startGame = useCallback(() => {
    sound.playClick();
    const st = stateRef.current;
    st.player.lane = 1;
    st.player.x = LANES[1];
    st.player.targetX = LANES[1];
    st.traffic = [];
    st.pickups = [];
    st.nitro = 100;
    st.score = 0;
    st.distance = 0;
    st.baseSpeed = 5;
    st.state = 'playing';

    setScore(0);
    setNitro(100);
    setGameState('playing');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'A', 'd', 'D', 'w', 'W', ' '].includes(e.key)) {
        e.preventDefault();
      }
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') changeLane('left');
      if (k === 'arrowright' || k === 'd') changeLane('right');
      if (k === 'arrowup' || k === 'w') stateRef.current.isBoosting = true;
      if (e.key === ' ' || e.key === 'Spacebar') {
        if (stateRef.current.state !== 'playing') startGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') stateRef.current.isBoosting = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startGame]);

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
        const boostMultiplier = st.isBoosting && st.nitro > 0 ? 1.8 : 1;
        if (st.isBoosting && st.nitro > 0) {
          st.nitro = Math.max(0, st.nitro - 0.4);
          setNitro(Math.floor(st.nitro));
        }

        const currentSpeed = st.baseSpeed * boostMultiplier;
        st.roadOffset = (st.roadOffset + currentSpeed) % 40;
        st.distance += currentSpeed * 0.1;
        st.score = Math.floor(st.distance);
        setScore(st.score);

        // Smooth lane transition
        st.player.x += (st.player.targetX - st.player.x) * 0.25;

        // Spawn traffic cars
        if (timestamp - st.lastTrafficSpawn > Math.max(700, 1600 - st.distance * 0.05)) {
          st.lastTrafficSpawn = timestamp;
          const laneIdx = Math.floor(Math.random() * 3);
          const colors = ['#64748b', '#3b82f6', '#10b981', '#a855f7'];
          st.traffic.push({
            x: LANES[laneIdx],
            y: -70,
            width: 32,
            height: 52,
            speed: 2 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)]
          });

          // Spawn pickup
          if (Math.random() < 0.35) {
            const pickupLane = (laneIdx + 1 + Math.floor(Math.random() * 2)) % 3;
            st.pickups.push({
              x: LANES[pickupLane],
              y: -50,
              type: Math.random() < 0.4 ? 'nitro' : 'coin',
              collected: false
            });
          }
        }

        // Update traffic
        for (let i = st.traffic.length - 1; i >= 0; i--) {
          const car = st.traffic[i];
          car.y += currentSpeed - car.speed;

          // Check collision with player
          const pLeft = st.player.x - st.player.width / 2;
          const pRight = st.player.x + st.player.width / 2;
          const pTop = st.player.y - st.player.height / 2;
          const pBottom = st.player.y + st.player.height / 2;

          const cLeft = car.x - car.width / 2;
          const cRight = car.x + car.width / 2;
          const cTop = car.y - car.height / 2;
          const cBottom = car.y + car.height / 2;

          if (pRight > cLeft && pLeft < cRight && pBottom > cTop && pTop < cBottom) {
            st.state = 'gameover';
            setGameState('gameover');
            sound.playHit();
            sound.playGameOver();
            const curHigh = parseInt(localStorage.getItem('highway_racer_high') || '0', 10);
            if (st.score > curHigh) {
              localStorage.setItem('highway_racer_high', String(st.score));
              setHighScore(st.score);
            }
          }

          if (car.y > H + 80) st.traffic.splice(i, 1);
        }

        // Update pickups
        for (let i = st.pickups.length - 1; i >= 0; i--) {
          const item = st.pickups[i];
          item.y += currentSpeed;

          const dist = Math.hypot(st.player.x - item.x, st.player.y - item.y);
          if (dist < 32 && !item.collected) {
            item.collected = true;
            sound.playPoint();
            if (item.type === 'nitro') {
              st.nitro = Math.min(100, st.nitro + 30);
              setNitro(Math.floor(st.nitro));
            } else {
              st.distance += 100;
            }
            st.pickups.splice(i, 1);
            continue;
          }

          if (item.y > H + 40) st.pickups.splice(i, 1);
        }
      }

      // Draw
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, W, H);

      // Road boundaries
      const roadLeft = 55;
      const roadRight = 345;
      ctx.fillStyle = '#181216';
      ctx.fillRect(roadLeft, 0, roadRight - roadLeft, H);

      // Road curbs
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(roadLeft - 6, 0, 6, H);
      ctx.fillRect(roadRight, 0, 6, H);

      // Road lane markers (dashed)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -st.roadOffset;

      // 2 lane dividers
      ctx.beginPath();
      ctx.moveTo(155, 0);
      ctx.lineTo(155, H);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(245, 0);
      ctx.lineTo(245, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Pickups
      for (const item of st.pickups) {
        if (item.type === 'nitro') {
          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(item.x, item.y, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px Inter';
          ctx.textAlign = 'center';
          ctx.fillText('N2O', item.x, item.y + 3);
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(item.x, item.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw Traffic Cars
      for (const car of st.traffic) {
        ctx.fillStyle = car.color;
        ctx.beginPath();
        ctx.roundRect(car.x - car.width / 2, car.y - car.height / 2, car.width, car.height, 6);
        ctx.fill();
        // Windshield
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(car.x - car.width / 2 + 4, car.y - 10, car.width - 8, 10);
        // Taillights
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(car.x - car.width / 2 + 3, car.y + car.height / 2 - 4, 6, 3);
        ctx.fillRect(car.x + car.width / 2 - 9, car.y + car.height / 2 - 4, 6, 3);
      }

      // Draw Player Car
      const pX = st.player.x;
      const pY = st.player.y;
      const pW = st.player.width;
      const pH = st.player.height;

      // Exhaust flame when boosting
      if (st.isBoosting && st.nitro > 0) {
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(pX - 8, pY + pH / 2);
        ctx.lineTo(pX, pY + pH / 2 + 16 + Math.random() * 6);
        ctx.lineTo(pX + 8, pY + pH / 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Car body
      const playerGrad = ctx.createLinearGradient(pX - pW / 2, 0, pX + pW / 2, 0);
      playerGrad.addColorStop(0, '#dc2626');
      playerGrad.addColorStop(0.5, '#ef4444');
      playerGrad.addColorStop(1, '#dc2626');
      ctx.fillStyle = playerGrad;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(pX - pW / 2, pY - pH / 2, pW, pH, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Windshield & roof
      ctx.fillStyle = '#020617';
      ctx.fillRect(pX - pW / 2 + 4, pY - 8, pW - 8, 12);

      // Headlights
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(pX - pW / 2 + 3, pY - pH / 2 + 2, 6, 4);
      ctx.fillRect(pX + pW / 2 - 9, pY - pH / 2 + 2, 6, 4);

      // Overlays
      if (st.state === 'idle') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 24px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CYBER HIGHWAY RACER', W / 2, H / 2 - 25);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Steer with Left/Right or A/D. Up to Nitro!', W / 2, H / 2 + 10);
      } else if (st.state === 'gameover') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 28px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('VEHICLE WRECKED', W / 2, H / 2 - 25);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '16px "Chakra Petch", sans-serif';
        ctx.fillText(`Distance Reached: ${st.score}m`, W / 2, H / 2 + 5);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleTouchDirection = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (dir === 'left') changeLane('left');
    if (dir === 'right') changeLane('right');
    if (dir === 'up') {
      stateRef.current.isBoosting = true;
      setTimeout(() => { stateRef.current.isBoosting = false; }, 800);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto select-none">
      {/* HUD Header */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-2.5 flex items-center justify-between font-gaming text-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400 text-xs">DIST: </span>
            <span className="text-red-400 font-bold text-base">{score}m</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs">BEST: </span>
            <span className="text-amber-400 font-bold">{highScore}m</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Nitro gauge */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-current" />
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-75"
                style={{ width: `${nitro}%` }}
              />
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
      </div>

      {/* Canvas */}
      <div className="relative w-full aspect-[4/5] bg-[#0f172a] overflow-hidden border-x border-b border-slate-800 rounded-b-xl shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={500}
          className="w-full h-full object-contain"
        />

        {gameState !== 'playing' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold font-gaming rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 text-lg active:scale-95 transition-all"
            >
              {gameState === 'idle' ? (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  START RACE
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

      {/* Mobile Touch Controller */}
      <div className="w-full">
        <TouchController
          onDirection={handleTouchDirection}
          onAction={() => {
            stateRef.current.isBoosting = true;
            setTimeout(() => { stateRef.current.isBoosting = false; }, 800);
          }}
          onActionName="NITRO"
          onSecondary={startGame}
          onSecondaryName="RETRY"
        />
      </div>
    </div>
  );
};
