import React, { useState, useEffect, useCallback } from 'react';
import { sound } from '../utils/audio';
import { RotateCcw, Flag, Timer, Bomb } from 'lucide-react';

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacentMines: number;
}

export const Minesweeper: React.FC = () => {
  const [rows, setRows] = useState(9);
  const [cols, setCols] = useState(9);
  const [minesCount, setMinesCount] = useState(10);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [flagsLeft, setFlagsLeft] = useState(10);
  const [flagMode, setFlagMode] = useState(false);
  const [time, setTime] = useState(0);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');

  // Initialize empty grid
  const initBoard = useCallback(() => {
    const newGrid: Cell[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          r,
          c,
          isMine: false,
          revealed: false,
          flagged: false,
          adjacentMines: 0
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setFlagsLeft(minesCount);
    setTime(0);
    setGameStatus('idle');
  }, [rows, cols, minesCount]);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  // Timer
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (gameStatus === 'playing') {
      timerId = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [gameStatus]);

  // Plant mines safely avoiding first clicked cell
  const plantMines = (startR: number, startC: number, currentGrid: Cell[][]) => {
    let planted = 0;
    const g = currentGrid.map(row => row.map(cell => ({ ...cell })));

    while (planted < minesCount) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      // Safe zone around first click
      if (Math.abs(r - startR) <= 1 && Math.abs(c - startC) <= 1) continue;
      if (!g[r][c].isMine) {
        g[r][c].isMine = true;
        planted++;
      }
    }

    // Calculate adjacent counts
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!g[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc].isMine) {
                count++;
              }
            }
          }
          g[r][c].adjacentMines = count;
        }
      }
    }
    return g;
  };

  const revealCell = (r: number, c: number) => {
    if (gameStatus === 'lost' || gameStatus === 'won') return;

    let currentGrid = grid;
    if (gameStatus === 'idle') {
      currentGrid = plantMines(r, c, grid);
      setGameStatus('playing');
    }

    const cell = currentGrid[r][c];
    if (cell.revealed || cell.flagged) return;

    sound.playClick();
    const g = currentGrid.map(row => row.map(cl => ({ ...cl })));

    if (g[r][c].isMine) {
      // Boom!
      sound.playHit();
      sound.playGameOver();
      // Reveal all mines
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (g[row][col].isMine) g[row][col].revealed = true;
        }
      }
      setGrid(g);
      setGameStatus('lost');
      return;
    }

    // Flood fill zero adjacent cells
    const queue = [{ r, c }];
    g[r][c].revealed = true;

    while (queue.length > 0) {
      const cur = queue.shift()!;
      if (g[cur.r][cur.c].adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = cur.r + dr;
            const nc = cur.c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              const nCell = g[nr][nc];
              if (!nCell.revealed && !nCell.flagged && !nCell.isMine) {
                nCell.revealed = true;
                if (nCell.adjacentMines === 0) {
                  queue.push({ r: nr, c: nc });
                }
              }
            }
          }
        }
      }
    }

    // Check victory
    let unrevealedSafe = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!g[row][col].isMine && !g[row][col].revealed) {
          unrevealedSafe++;
        }
      }
    }

    if (unrevealedSafe === 0) {
      sound.playPoint();
      setGameStatus('won');
    }

    setGrid(g);
  };

  const toggleFlag = (r: number, c: number, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (gameStatus === 'lost' || gameStatus === 'won') return;

    const cell = grid[r][c];
    if (cell.revealed) return;

    sound.playClick();
    const g = grid.map(row => row.map(cl => ({ ...cl })));
    const target = g[r][c];

    if (target.flagged) {
      target.flagged = false;
      setFlagsLeft(f => f + 1);
    } else if (flagsLeft > 0) {
      target.flagged = true;
      setFlagsLeft(f => f - 1);
    }
    setGrid(g);
  };

  const handleCellClick = (r: number, c: number) => {
    if (flagMode) {
      toggleFlag(r, c);
    } else {
      revealCell(r, c);
    }
  };

  const getNumberColor = (num: number) => {
    switch (num) {
      case 1: return 'text-cyan-400';
      case 2: return 'text-emerald-400';
      case 3: return 'text-rose-400';
      case 4: return 'text-purple-400';
      case 5: return 'text-amber-400';
      case 6: return 'text-teal-400';
      default: return 'text-red-500';
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto select-none">
      {/* HUD Bar */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 flex items-center gap-1 text-sm font-gaming text-red-400">
            <Bomb className="w-4 h-4 text-red-500" />
            <span>{flagsLeft}</span>
          </div>

          <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 flex items-center gap-1 text-sm font-gaming text-amber-400">
            <Timer className="w-4 h-4 text-amber-500" />
            <span>{time}s</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFlagMode(!flagMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-gaming flex items-center gap-1 transition-all ${
              flagMode
                ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            FLAG MODE
          </button>

          <button
            type="button"
            onClick={initBoard}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Canvas Frame */}
      <div className="w-full bg-[#0d1117] p-3 border-x border-b border-slate-800 rounded-b-xl shadow-2xl flex flex-col items-center">
        <div
          className="grid gap-1 bg-slate-950/80 p-2 rounded-xl border border-slate-800"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => handleCellClick(r, c)}
                onContextMenu={(e) => toggleFlag(r, c, e)}
                className={`w-8 h-8 md:w-9 md:h-9 rounded-md font-gaming font-bold text-xs md:text-sm flex items-center justify-center transition-all ${
                  cell.revealed
                    ? cell.isMine
                      ? 'bg-red-600/60 border border-red-500 text-white shadow-[0_0_8px_#ef4444]'
                      : 'bg-slate-900 border border-slate-800'
                    : 'bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 shadow-sm text-slate-400'
                }`}
              >
                {cell.revealed ? (
                  cell.isMine ? (
                    '💣'
                  ) : cell.adjacentMines > 0 ? (
                    <span className={getNumberColor(cell.adjacentMines)}>
                      {cell.adjacentMines}
                    </span>
                  ) : (
                    ''
                  )
                ) : cell.flagged ? (
                  <span className="text-red-400 text-sm">🚩</span>
                ) : (
                  ''
                )}
              </button>
            ))
          )}
        </div>

        {/* Status notice */}
        {gameStatus === 'won' && (
          <div className="mt-3 p-2.5 bg-emerald-950/80 border border-emerald-500 rounded-lg text-emerald-300 text-center font-gaming text-sm w-full">
            🎉 MINEFIELD CLEARED IN {time} SECONDS!
          </div>
        )}
        {gameStatus === 'lost' && (
          <div className="mt-3 p-2.5 bg-red-950/80 border border-red-500 rounded-lg text-red-300 text-center font-gaming text-sm w-full">
            💥 MINE DETONATED! Click reset to try again.
          </div>
        )}
      </div>

      <div className="text-xs text-slate-400 mt-2 text-center">
        Tip: Right-click or enable Flag Mode to mark suspicious squares.
      </div>
    </div>
  );
};
