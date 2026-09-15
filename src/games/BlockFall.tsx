import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sound } from '../utils/audio';
import { Play, RotateCcw, Volume2, VolumeX, ArrowDown, RotateCw, ArrowLeft, ArrowRight } from 'lucide-react';

type Board = (string | null)[][];

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24;

const SHAPES: { shape: number[][]; color: string }[] = [
  { shape: [[1, 1, 1, 1]], color: '#06b6d4' }, // I (cyan)
  { shape: [[1, 1], [1, 1]], color: '#f59e0b' }, // O (yellow)
  { shape: [[0, 1, 0], [1, 1, 1]], color: '#a855f7' }, // T (purple)
  { shape: [[1, 0, 0], [1, 1, 1]], color: '#3b82f6' }, // J (blue)
  { shape: [[0, 0, 1], [1, 1, 1]], color: '#f97316' }, // L (orange)
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#10b981' }, // S (green)
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#ef4444' }  // Z (red)
];

export const BlockFall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [soundMuted, setSoundMuted] = useState(!sound.enabled);

  const stateRef = useRef({
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)) as Board,
    currentPiece: null as { shape: number[][]; color: string; x: number; y: number } | null,
    score: 0,
    lines: 0,
    state: 'idle' as 'idle' | 'playing' | 'gameover',
    lastDrop: 0,
    dropInterval: 700
  });

  useEffect(() => {
    const saved = localStorage.getItem('block_fall_high');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const spawnPiece = () => {
    const piece = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
      shape: piece.shape,
      color: piece.color,
      x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2),
      y: 0
    };
  };

  const checkCollision = (shape: number[][], posX: number, posY: number, board: Board): boolean => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newX = posX + c;
          const newY = posY + r;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && board[newY][newX] !== null) return true;
        }
      }
    }
    return false;
  };

  const rotatePiece = () => {
    const st = stateRef.current;
    if (!st.currentPiece || st.state !== 'playing') return;
    const orig = st.currentPiece.shape;
    // Transpose and reverse rows
    const rotated = orig[0].map((_, colIdx) => orig.map(row => row[colIdx]).reverse());
    if (!checkCollision(rotated, st.currentPiece.x, st.currentPiece.y, st.board)) {
      st.currentPiece.shape = rotated;
      sound.playClick();
    }
  };

  const moveHorizontal = (dx: number) => {
    const st = stateRef.current;
    if (!st.currentPiece || st.state !== 'playing') return;
    if (!checkCollision(st.currentPiece.shape, st.currentPiece.x + dx, st.currentPiece.y, st.board)) {
      st.currentPiece.x += dx;
      sound.playClick();
    }
  };

  const dropDown = () => {
    const st = stateRef.current;
    if (!st.currentPiece || st.state !== 'playing') return;
    if (!checkCollision(st.currentPiece.shape, st.currentPiece.x, st.currentPiece.y + 1, st.board)) {
      st.currentPiece.y += 1;
    } else {
      // Lock piece into board
      for (let r = 0; r < st.currentPiece.shape.length; r++) {
        for (let c = 0; c < st.currentPiece.shape[r].length; c++) {
          if (st.currentPiece.shape[r][c]) {
            const by = st.currentPiece.y + r;
            const bx = st.currentPiece.x + c;
            if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
              st.board[by][bx] = st.currentPiece.color;
            }
          }
        }
      }

      sound.playHit();

      // Check line clears
      let cleared = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (st.board[r].every(cell => cell !== null)) {
          st.board.splice(r, 1);
          st.board.unshift(Array(COLS).fill(null));
          cleared++;
          r++; // check same row again
        }
      }

      if (cleared > 0) {
        sound.playPoint();
        const pts = cleared === 1 ? 100 : cleared === 2 ? 300 : cleared === 3 ? 500 : 800;
        st.score += pts;
        st.lines += cleared;
        setScore(st.score);
        setLines(st.lines);
        st.dropInterval = Math.max(200, 700 - Math.floor(st.lines / 5) * 60);
      }

      // Spawn next piece
      const nextPiece = spawnPiece();
      if (checkCollision(nextPiece.shape, nextPiece.x, nextPiece.y, st.board)) {
        // Game over
        st.state = 'gameover';
        setGameState('gameover');
        sound.playGameOver();
        const curHigh = parseInt(localStorage.getItem('block_fall_high') || '0', 10);
        if (st.score > curHigh) {
          localStorage.setItem('block_fall_high', String(st.score));
          setHighScore(st.score);
        }
      } else {
        st.currentPiece = nextPiece;
      }
    }
  };

  const hardDrop = () => {
    const st = stateRef.current;
    if (!st.currentPiece || st.state !== 'playing') return;
    while (!checkCollision(st.currentPiece.shape, st.currentPiece.x, st.currentPiece.y + 1, st.board)) {
      st.currentPiece.y += 1;
    }
    dropDown();
  };

  const startGame = useCallback(() => {
    sound.playClick();
    const st = stateRef.current;
    st.board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    st.score = 0;
    st.lines = 0;
    st.dropInterval = 700;
    st.currentPiece = spawnPiece();
    st.state = 'playing';

    setScore(0);
    setLines(0);
    setGameState('playing');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveHorizontal(-1);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveHorizontal(1);
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') rotatePiece();
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') dropDown();
      if (e.key === ' ' || e.key === 'Spacebar') {
        if (stateRef.current.state === 'playing') hardDrop();
        else startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startGame]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = (timestamp: number) => {
      const st = stateRef.current;

      if (st.state === 'playing') {
        if (timestamp - st.lastDrop > st.dropInterval) {
          st.lastDrop = timestamp;
          dropDown();
        }
      }

      // Draw
      const W = canvas.width;
      const H = canvas.height;

      ctx.fillStyle = '#0a0d18';
      ctx.fillRect(0, 0, W, H);

      // Grid background lines
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
      ctx.lineWidth = 1;
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * BLOCK_SIZE, 0);
        ctx.lineTo(c * BLOCK_SIZE, H);
        ctx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * BLOCK_SIZE);
        ctx.lineTo(W, r * BLOCK_SIZE);
        ctx.stroke();
      }

      // Draw locked board blocks
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const color = st.board[r][c];
          if (color) {
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.roundRect(c * BLOCK_SIZE + 1, r * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2, 3);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Draw current active piece
      if (st.currentPiece) {
        ctx.fillStyle = st.currentPiece.color;
        ctx.shadowColor = st.currentPiece.color;
        ctx.shadowBlur = 10;
        const sh = st.currentPiece.shape;
        for (let r = 0; r < sh.length; r++) {
          for (let c = 0; c < sh[r].length; c++) {
            if (sh[r][c]) {
              const drawX = (st.currentPiece.x + c) * BLOCK_SIZE;
              const drawY = (st.currentPiece.y + r) * BLOCK_SIZE;
              ctx.beginPath();
              ctx.roundRect(drawX + 1, drawY + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2, 3);
              ctx.fill();
            }
          }
        }
        ctx.shadowBlur = 0;
      }

      // Overlays
      if (st.state === 'idle') {
        ctx.fillStyle = 'rgba(10, 13, 24, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 20px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('BLOCK FALL', W / 2, H / 2 - 25);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('Arrows to move & rotate. Space to drop.', W / 2, H / 2 + 10);
      } else if (st.state === 'gameover') {
        ctx.fillStyle = 'rgba(10, 13, 24, 0.85)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 22px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GRID OVERFLOW', W / 2, H / 2 - 25);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '14px "Chakra Petch", sans-serif';
        ctx.fillText(`Score: ${st.score} | Lines: ${st.lines}`, W / 2, H / 2 + 5);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto select-none">
      {/* HUD */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-2.5 flex items-center justify-between font-gaming text-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400 text-xs">SCORE: </span>
            <span className="text-blue-400 font-bold text-base">{score}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs">LINES: </span>
            <span className="text-emerald-400 font-bold">{lines}</span>
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
      <div className="relative w-full max-w-[240px] aspect-[10/20] bg-[#0a0d18] overflow-hidden border-x border-b border-slate-800 rounded-b-xl shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={COLS * BLOCK_SIZE}
          height={ROWS * BLOCK_SIZE}
          className="w-full h-full object-contain"
        />

        {gameState !== 'playing' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <button
              type="button"
              onClick={startGame}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold font-gaming rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 text-sm active:scale-95 transition-all"
            >
              {gameState === 'idle' ? (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  START GAME
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  RETRY
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch controls */}
      <div className="w-full max-w-[320px] grid grid-cols-4 gap-2 mt-3">
        <button
          type="button"
          onClick={() => moveHorizontal(-1)}
          className="py-3 bg-slate-800 active:bg-blue-600 rounded-xl text-white flex items-center justify-center font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={rotatePiece}
          className="py-3 bg-slate-800 active:bg-blue-600 rounded-xl text-white flex items-center justify-center font-bold"
        >
          <RotateCw className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={dropDown}
          className="py-3 bg-slate-800 active:bg-blue-600 rounded-xl text-white flex items-center justify-center font-bold"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => moveHorizontal(1)}
          className="py-3 bg-slate-800 active:bg-blue-600 rounded-xl text-white flex items-center justify-center font-bold"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      <button
        type="button"
        onClick={hardDrop}
        className="w-full max-w-[320px] mt-2 py-2.5 bg-blue-600 active:bg-blue-500 rounded-xl text-white font-gaming text-xs font-bold shadow"
      >
        HARD DROP (SPACE)
      </button>
    </div>
  );
};
