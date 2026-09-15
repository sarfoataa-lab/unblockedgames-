import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sound } from '../utils/audio';
import { Play, RotateCcw, Volume2, VolumeX, Users, User } from 'lucide-react';

export const RetroPong: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [gameMode, setGameMode] = useState<'1p' | '2p'>('1p');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [winner, setWinner] = useState<string | null>(null);
  const [soundMuted, setSoundMuted] = useState(!sound.enabled);

  const stateRef = useRef({
    paddle1: { y: 150, height: 70, width: 10, speed: 6 },
    paddle2: { y: 150, height: 70, width: 10, speed: 5.2 },
    ball: { x: 300, y: 180, radius: 6, vx: 4.5, vy: 3, speed: 5.5 },
    keys: { w: false, s: false, up: false, down: false },
    score1: 0,
    score2: 0,
    state: 'idle' as 'idle' | 'playing' | 'gameover',
    mode: '1p' as '1p' | '2p'
  });

  const resetBall = (direction: number) => {
    const st = stateRef.current;
    st.ball.x = 300;
    st.ball.y = 180;
    st.ball.speed = 5.5;
    const angle = (Math.random() - 0.5) * (Math.PI / 3);
    st.ball.vx = direction * st.ball.speed * Math.cos(angle);
    st.ball.vy = st.ball.speed * Math.sin(angle);
  };

  const startGame = useCallback(() => {
    sound.playClick();
    const st = stateRef.current;
    st.score1 = 0;
    st.score2 = 0;
    st.paddle1.y = 150;
    st.paddle2.y = 150;
    st.mode = gameMode;
    resetBall(Math.random() > 0.5 ? 1 : -1);
    st.state = 'playing';

    setScore1(0);
    setScore2(0);
    setWinner(null);
    setGameState('playing');
  }, [gameMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'w', 'W', 's', 'S', ' '].includes(e.key)) {
        e.preventDefault();
      }
      const st = stateRef.current;
      if (e.key === 'w' || e.key === 'W') st.keys.w = true;
      if (e.key === 's' || e.key === 'S') st.keys.s = true;
      if (e.key === 'ArrowUp') st.keys.up = true;
      if (e.key === 'ArrowDown') st.keys.down = true;
      if (e.key === ' ' || e.key === 'Spacebar') {
        if (st.state !== 'playing') startGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const st = stateRef.current;
      if (e.key === 'w' || e.key === 'W') st.keys.w = false;
      if (e.key === 's' || e.key === 'S') st.keys.s = false;
      if (e.key === 'ArrowUp') st.keys.up = false;
      if (e.key === 'ArrowDown') st.keys.down = false;
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

    const loop = () => {
      const st = stateRef.current;

      if (st.state === 'playing') {
        // Player 1 movement (W/S)
        if (st.keys.w) st.paddle1.y -= st.paddle1.speed;
        if (st.keys.s) st.paddle1.y += st.paddle1.speed;
        st.paddle1.y = Math.max(10, Math.min(H - st.paddle1.height - 10, st.paddle1.y));

        // Player 2 or AI movement
        if (st.mode === '2p') {
          if (st.keys.up) st.paddle2.y -= st.paddle2.speed;
          if (st.keys.down) st.paddle2.y += st.paddle2.speed;
        } else {
          // AI tracking ball
          const targetY = st.ball.y - st.paddle2.height / 2;
          if (st.paddle2.y < targetY - 4) {
            st.paddle2.y += st.paddle2.speed;
          } else if (st.paddle2.y > targetY + 4) {
            st.paddle2.y -= st.paddle2.speed;
          }
        }
        st.paddle2.y = Math.max(10, Math.min(H - st.paddle2.height - 10, st.paddle2.y));

        // Ball movement
        st.ball.x += st.ball.vx;
        st.ball.y += st.ball.vy;

        // Top and bottom bounce
        if (st.ball.y - st.ball.radius <= 0) {
          st.ball.y = st.ball.radius;
          st.ball.vy = Math.abs(st.ball.vy);
          sound.playHit();
        } else if (st.ball.y + st.ball.radius >= H) {
          st.ball.y = H - st.ball.radius;
          st.ball.vy = -Math.abs(st.ball.vy);
          sound.playHit();
        }

        // Left paddle collision
        const p1X = 25;
        if (
          st.ball.x - st.ball.radius <= p1X + st.paddle1.width &&
          st.ball.x + st.ball.radius >= p1X &&
          st.ball.y >= st.paddle1.y &&
          st.ball.y <= st.paddle1.y + st.paddle1.height
        ) {
          const hit = (st.ball.y - (st.paddle1.y + st.paddle1.height / 2)) / (st.paddle1.height / 2);
          st.ball.speed = Math.min(10, st.ball.speed + 0.3);
          st.ball.vx = Math.abs(st.ball.speed * Math.cos(hit * (Math.PI / 3)));
          st.ball.vy = st.ball.speed * Math.sin(hit * (Math.PI / 3));
          sound.playLaser();
        }

        // Right paddle collision
        const p2X = W - 25 - st.paddle2.width;
        if (
          st.ball.x + st.ball.radius >= p2X &&
          st.ball.x - st.ball.radius <= p2X + st.paddle2.width &&
          st.ball.y >= st.paddle2.y &&
          st.ball.y <= st.paddle2.y + st.paddle2.height
        ) {
          const hit = (st.ball.y - (st.paddle2.y + st.paddle2.height / 2)) / (st.paddle2.height / 2);
          st.ball.speed = Math.min(10, st.ball.speed + 0.3);
          st.ball.vx = -Math.abs(st.ball.speed * Math.cos(hit * (Math.PI / 3)));
          st.ball.vy = st.ball.speed * Math.sin(hit * (Math.PI / 3));
          sound.playLaser();
        }

        // Point score
        if (st.ball.x < 0) {
          st.score2 += 1;
          setScore2(st.score2);
          sound.playPoint();
          if (st.score2 >= 7) {
            st.state = 'gameover';
            setGameState('gameover');
            setWinner(st.mode === '2p' ? 'Player 2' : 'Computer AI');
            sound.playGameOver();
          } else {
            resetBall(1);
          }
        } else if (st.ball.x > W) {
          st.score1 += 1;
          setScore1(st.score1);
          sound.playPoint();
          if (st.score1 >= 7) {
            st.state = 'gameover';
            setGameState('gameover');
            setWinner(st.mode === '2p' ? 'Player 1' : 'Player');
            sound.playGameOver();
          } else {
            resetBall(-1);
          }
        }
      }

      // Render
      ctx.fillStyle = '#061312';
      ctx.fillRect(0, 0, W, H);

      // Center court line
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Paddles
      ctx.fillStyle = '#2dd4bf';
      ctx.shadowColor = '#2dd4bf';
      ctx.shadowBlur = 8;

      // P1
      ctx.beginPath();
      ctx.roundRect(25, st.paddle1.y, st.paddle1.width, st.paddle1.height, 4);
      ctx.fill();

      // P2
      ctx.beginPath();
      ctx.roundRect(W - 25 - st.paddle2.width, st.paddle2.y, st.paddle2.width, st.paddle2.height, 4);
      ctx.fill();

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
        ctx.fillStyle = 'rgba(6, 19, 18, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#2dd4bf';
        ctx.font = 'bold 24px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('RETRO PONG 1V1', W / 2, H / 2 - 25);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('First to 7 Points Wins. Spacebar to start.', W / 2, H / 2 + 10);
      } else if (st.state === 'gameover') {
        ctx.fillStyle = 'rgba(6, 19, 18, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#2dd4bf';
        ctx.font = 'bold 28px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${winner?.toUpperCase()} WINS!`, W / 2, H / 2 - 25);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '16px "Chakra Petch", sans-serif';
        ctx.fillText(`Final Match Score: ${st.score1} - ${st.score2}`, W / 2, H / 2 + 10);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [winner]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto select-none">
      {/* HUD Header */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-2.5 flex items-center justify-between font-gaming text-sm">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400 text-xs">P1: </span>
            <span className="text-teal-400 font-bold text-lg">{score1}</span>
          </div>
          <div className="text-slate-600 font-bold">:</div>
          <div>
            <span className="text-slate-400 text-xs">{gameMode === '1p' ? 'AI: ' : 'P2: '}</span>
            <span className="text-teal-400 font-bold text-lg">{score2}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => { setGameMode('1p'); stateRef.current.mode = '1p'; }}
              className={`px-2 py-1 rounded flex items-center gap-1 ${
                gameMode === '1p' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" /> vs AI
            </button>
            <button
              onClick={() => { setGameMode('2p'); stateRef.current.mode = '2p'; }}
              className={`px-2 py-1 rounded flex items-center gap-1 ${
                gameMode === '2p' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3 h-3" /> 2 Players
            </button>
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
      <div className="relative w-full aspect-[5/3] bg-[#061312] overflow-hidden border-x border-b border-slate-800 rounded-b-xl shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={360}
          className="w-full h-full object-contain"
        />

        {gameState !== 'playing' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold font-gaming rounded-xl shadow-lg shadow-teal-500/30 flex items-center gap-2 text-lg active:scale-95 transition-all"
            >
              {gameState === 'idle' ? (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  START MATCH
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

      {/* Mobile Controls */}
      <div className="w-full mt-3 flex justify-between gap-4 md:hidden">
        <div className="flex-1 flex flex-col gap-2">
          <span className="text-[10px] text-slate-400 text-center font-bold">P1 CONTROLS</span>
          <div className="flex gap-2">
            <button
              type="button"
              onPointerDown={() => { stateRef.current.paddle1.y -= 25; }}
              className="flex-1 py-3 bg-slate-800 active:bg-teal-600 rounded-lg text-white font-bold"
            >
              ▲ UP
            </button>
            <button
              type="button"
              onPointerDown={() => { stateRef.current.paddle1.y += 25; }}
              className="flex-1 py-3 bg-slate-800 active:bg-teal-600 rounded-lg text-white font-bold"
            >
              ▼ DOWN
            </button>
          </div>
        </div>

        {gameMode === '2p' && (
          <div className="flex-1 flex flex-col gap-2">
            <span className="text-[10px] text-slate-400 text-center font-bold">P2 CONTROLS</span>
            <div className="flex gap-2">
              <button
                type="button"
                onPointerDown={() => { stateRef.current.paddle2.y -= 25; }}
                className="flex-1 py-3 bg-slate-800 active:bg-teal-600 rounded-lg text-white font-bold"
              >
                ▲ UP
              </button>
              <button
                type="button"
                onPointerDown={() => { stateRef.current.paddle2.y += 25; }}
                className="flex-1 py-3 bg-slate-800 active:bg-teal-600 rounded-lg text-white font-bold"
              >
                ▼ DOWN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
