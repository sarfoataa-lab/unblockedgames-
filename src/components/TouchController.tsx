import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface TouchControllerProps {
  onDirection: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onAction?: () => void;
  onActionName?: string;
  onSecondary?: () => void;
  onSecondaryName?: string;
}

export const TouchController: React.FC<TouchControllerProps> = ({
  onDirection,
  onAction,
  onActionName = 'ACTION',
  onSecondary,
  onSecondaryName = 'RESET'
}) => {
  return (
    <div className="w-full select-none galaxy-glass border border-indigo-500/20 p-3.5 flex items-center justify-between gap-4 max-w-xl mx-auto rounded-2xl mt-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {/* Directional Pad */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Up */}
        <button
          type="button"
          aria-label="Up"
          onPointerDown={(e) => { e.preventDefault(); onDirection('up'); }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-11 h-11 bg-white/[0.06] active:bg-cyan-500 rounded-xl flex items-center justify-center text-slate-200 active:text-slate-950 shadow border border-indigo-500/30 active:scale-95 transition-all touch-none hover:border-cyan-400/50 hover:bg-white/[0.1]"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        {/* Down */}
        <button
          type="button"
          aria-label="Down"
          onPointerDown={(e) => { e.preventDefault(); onDirection('down'); }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-11 h-11 bg-white/[0.06] active:bg-cyan-500 rounded-xl flex items-center justify-center text-slate-200 active:text-slate-950 shadow border border-indigo-500/30 active:scale-95 transition-all touch-none hover:border-cyan-400/50 hover:bg-white/[0.1]"
        >
          <ArrowDown className="w-6 h-6" />
        </button>

        {/* Left */}
        <button
          type="button"
          aria-label="Left"
          onPointerDown={(e) => { e.preventDefault(); onDirection('left'); }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/[0.06] active:bg-cyan-500 rounded-xl flex items-center justify-center text-slate-200 active:text-slate-950 shadow border border-indigo-500/30 active:scale-95 transition-all touch-none hover:border-cyan-400/50 hover:bg-white/[0.1]"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Right */}
        <button
          type="button"
          aria-label="Right"
          onPointerDown={(e) => { e.preventDefault(); onDirection('right'); }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/[0.06] active:bg-cyan-500 rounded-xl flex items-center justify-center text-slate-200 active:text-slate-950 shadow border border-indigo-500/30 active:scale-95 transition-all touch-none hover:border-cyan-400/50 hover:bg-white/[0.1]"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Center hub */}
        <div className="w-7 h-7 rounded-full bg-[#050917] border border-indigo-500/30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {onSecondary && (
          <button
            type="button"
            onPointerDown={(e) => { e.preventDefault(); onSecondary(); }}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-white/[0.06] active:bg-white/[0.15] border border-indigo-500/30 text-slate-300 text-[10px] font-gaming font-semibold active:scale-95 transition-all touch-none shadow-md hover:border-indigo-400/50"
          >
            <RefreshCw className="w-4 h-4 mb-0.5" />
            <span>{onSecondaryName}</span>
          </button>
        )}

        {onAction && (
          <button
            type="button"
            onPointerDown={(e) => { e.preventDefault(); onAction(); }}
            className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 active:from-cyan-400 active:to-indigo-500 text-white font-gaming font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.45)] active:scale-95 transition-all touch-none border border-cyan-400/40 hover:scale-105"
          >
            <Zap className="w-6 h-6 fill-current mb-0.5" />
            <span>{onActionName}</span>
          </button>
        )}
      </div>
    </div>
  );
};
