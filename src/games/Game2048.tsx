import React, { useState, useEffect, useCallback, useRef } from 'react';
import { sound } from '../utils/audio';
import { RotateCcw, Undo2, Trophy, Sparkles } from 'lucide-react';

type Grid = number[][];

export const Game2048: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(() => [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [previousState, setPreviousState] = useState<{ grid: Grid; score: number } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('2048_cyber_high');
    if (saved) setBestScore(parseInt(saved, 10));
    initGame();
  }, []);

  const addRandomTile = (currentGrid: Grid): Grid => {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return currentGrid;

    const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map(row => [...row]);
    newGrid[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  };

  const initGame = () => {
    let newGrid: Grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setPreviousState(null);
    setGameOver(false);
    setWon(false);
  };

  const checkGameOver = (g: Grid): boolean => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (g[r][c] === 0) return false;
        if (c < 3 && g[r][c] === g[r][c + 1]) return false;
        if (r < 3 && g[r][c] === g[r + 1][c]) return false;
      }
    }
    return true;
  };

  const move = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    let moved = false;
    let addedScore = 0;
    const newGrid = grid.map(row => [...row]);

    const slideRow = (row: number[]): number[] => {
      const filtered = row.filter(val => val !== 0);
      const res: number[] = [];
      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          const merged = filtered[i] * 2;
          res.push(merged);
          addedScore += merged;
          if (merged === 2048) setWon(true);
          i++; // skip merged
        } else {
          res.push(filtered[i]);
        }
      }
      while (res.length < 4) res.push(0);
      return res;
    };

    if (direction === 'left') {
      for (let r = 0; r < 4; r++) {
        const original = [...newGrid[r]];
        newGrid[r] = slideRow(newGrid[r]);
        if (newGrid[r].some((val, idx) => val !== original[idx])) moved = true;
      }
    } else if (direction === 'right') {
      for (let r = 0; r < 4; r++) {
        const original = [...newGrid[r]];
        const reversed = [...newGrid[r]].reverse();
        const slid = slideRow(reversed).reverse();
        newGrid[r] = slid;
        if (newGrid[r].some((val, idx) => val !== original[idx])) moved = true;
      }
    } else if (direction === 'up') {
      for (let c = 0; c < 4; c++) {
        const col = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]];
        const slid = slideRow(col);
        for (let r = 0; r < 4; r++) {
          if (newGrid[r][c] !== slid[r]) moved = true;
          newGrid[r][c] = slid[r];
        }
      }
    } else if (direction === 'down') {
      for (let c = 0; c < 4; c++) {
        const col = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]];
        const reversed = col.reverse();
        const slid = slideRow(reversed).reverse();
        for (let r = 0; r < 4; r++) {
          if (newGrid[r][c] !== slid[r]) moved = true;
          newGrid[r][c] = slid[r];
        }
      }
    }

    if (moved) {
      sound.playClick();
      setPreviousState({ grid: grid.map(r => [...r]), score });
      const gridWithTile = addRandomTile(newGrid);
      const newScore = score + addedScore;
      setGrid(gridWithTile);
      setScore(newScore);

      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048_cyber_high', String(newScore));
      }

      if (checkGameOver(gridWithTile)) {
        setGameOver(true);
        sound.playGameOver();
      }
    }
  }, [grid, score, bestScore, gameOver]);

  const undo = () => {
    if (!previousState) return;
    setGrid(previousState.grid);
    setScore(previousState.score);
    setPreviousState(null);
    setGameOver(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowLeft') move('left');
        if (e.key === 'ArrowRight') move('right');
        if (e.key === 'ArrowUp') move('up');
        if (e.key === 'ArrowDown') move('down');
      }
      if (e.key === 'u' || e.key === 'U') undo();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) {
        if (dx > 0) move('right');
        else move('left');
      }
    } else {
      if (Math.abs(dy) > 30) {
        if (dy > 0) move('down');
        else move('up');
      }
    }
  };

  // Tile styling colors
  const getTileStyle = (val: number) => {
    switch (val) {
      case 2: return 'bg-slate-800 text-slate-100 border-slate-700';
      case 4: return 'bg-slate-700 text-slate-100 border-slate-600';
      case 8: return 'bg-amber-600 text-white border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]';
      case 16: return 'bg-orange-600 text-white border-orange-500 shadow-[0_0_8px_rgba(234,88,12,0.4)]';
      case 32: return 'bg-rose-600 text-white border-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.4)]';
      case 64: return 'bg-pink-600 text-white border-pink-500 shadow-[0_0_10px_rgba(219,39,119,0.5)]';
      case 128: return 'bg-purple-600 text-white border-purple-400 font-extrabold shadow-[0_0_12px_rgba(147,51,234,0.5)]';
      case 256: return 'bg-indigo-600 text-white border-indigo-400 font-extrabold shadow-[0_0_12px_rgba(79,70,229,0.6)]';
      case 512: return 'bg-cyan-600 text-white border-cyan-400 font-extrabold shadow-[0_0_14px_rgba(6,182,212,0.6)]';
      case 1024: return 'bg-emerald-600 text-white border-emerald-400 font-extrabold shadow-[0_0_16px_rgba(16,185,129,0.7)]';
      case 2048: return 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 border-amber-200 font-black shadow-[0_0_20px_rgba(245,158,11,0.9)]';
      default: return 'bg-slate-900/60 text-transparent border-slate-800/40';
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto select-none">
      {/* Top Scores & Action Bar */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-center">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">SCORE</span>
            <span className="font-gaming text-pink-400 font-bold text-base">{score}</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-center">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
              <Trophy className="w-2.5 h-2.5 text-amber-400" /> BEST
            </span>
            <span className="font-gaming text-amber-400 font-bold text-base">{bestScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {previousState && (
            <button
              type="button"
              onClick={undo}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Undo Move (U)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={initGame}
            className="px-3 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-bold font-gaming flex items-center gap-1 transition-colors shadow-md shadow-pink-600/30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            NEW
          </button>
        </div>
      </div>

      {/* Grid Canvas Frame */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-square bg-[#0f101d] p-3.5 border-x border-b border-slate-800 rounded-b-xl shadow-2xl flex items-center justify-center touch-none"
      >
        <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-2.5">
          {grid.map((row, rIdx) =>
            row.map((val, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`flex items-center justify-center rounded-xl border font-gaming text-xl md:text-2xl transition-all duration-100 ${getTileStyle(val)}`}
              >
                {val > 0 ? val : ''}
              </div>
            ))
          )}
        </div>

        {/* Game Over / Won Overlay */}
        {(gameOver || won) && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs rounded-b-xl flex flex-col items-center justify-center p-6 text-center z-20">
            <h3 className="text-2xl font-bold font-gaming mb-2 text-white">
              {won ? '🎉 2048 UNLOCKED!' : 'NO MORE MOVES'}
            </h3>
            <p className="text-sm text-slate-300 mb-5">
              {won ? 'You reached the 2048 Core!' : `Final Score: ${score}`}
            </p>
            <div className="flex gap-3">
              {previousState && !won && (
                <button
                  type="button"
                  onClick={undo}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-sm"
                >
                  Undo Move
                </button>
              )}
              <button
                type="button"
                onClick={initGame}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-bold font-gaming text-sm shadow-lg"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch swipe directions buttons */}
      <div className="w-full grid grid-cols-4 gap-2 mt-3">
        <button
          type="button"
          onClick={() => move('left')}
          className="py-3 bg-slate-900 border border-slate-800 active:bg-pink-600 rounded-xl font-gaming text-sm text-slate-200"
        >
          ← LEFT
        </button>
        <button
          type="button"
          onClick={() => move('up')}
          className="py-3 bg-slate-900 border border-slate-800 active:bg-pink-600 rounded-xl font-gaming text-sm text-slate-200"
        >
          ↑ UP
        </button>
        <button
          type="button"
          onClick={() => move('down')}
          className="py-3 bg-slate-900 border border-slate-800 active:bg-pink-600 rounded-xl font-gaming text-sm text-slate-200"
        >
          ↓ DOWN
        </button>
        <button
          type="button"
          onClick={() => move('right')}
          className="py-3 bg-slate-900 border border-slate-800 active:bg-pink-600 rounded-xl font-gaming text-sm text-slate-200"
        >
          RIGHT →
        </button>
      </div>
    </div>
  );
};
