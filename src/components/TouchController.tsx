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
    <div className="w-full select-none bg-slate-900/90 border-t border-slate-800 p-3 flex items-center justify-between gap-4 max-w-xl mx-auto rounded-xl mt-3 shadow-lg">
      {/* Directional Pad */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Up */}
        <button
          type="button"
          aria-label="Up"
          onPointerDown={(e) => { e.preventDefault(); onDirection('up'); }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-11 h-11 bg-slate-800 active:bg-cyan-600 rounded-lg flex items-center justify-center text-slate-200 shadow border border-slate-700 active:scale-95 transition-transform touch-none"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        {/* Down */}
        <button
          type="button"
          aria-label="Down"
          onPointerDown={(e) => { e.preventDefault(); onDirection('down'); }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-11 h-11 bg-slate-800 active:bg-cyan-600 rounded-lg flex items-center justify-center text-slate-200 shadow border border-slate-700 active:scale-95 transition-transform touch-none"
        >
          <ArrowDown className="w-6 h-6" />
        </button>

        {/* Left */}
        <button
          type="button"
          aria-label="Left"
          onPointerDown={(e) => { e.preventDefault(); onDirection('left'); }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 bg-slate-800 active:bg-cyan-600 rounded-lg flex items-center justify-center text-slate-200 shadow border border-slate-700 active:scale-95 transition-transform touch-none"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Right */}
        <button
          type="button"
          aria-label="Right"
          onPointerDown={(e) => { e.preventDefault(); onDirection('right'); }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 bg-slate-800 active:bg-cyan-600 rounded-lg flex items-center justify-center text-slate-200 shadow border border-slate-700 active:scale-95 transition-transform touch-none"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Center hub */}
        <div className="w-7 h-7 rounded-full bg-slate-950/80 border border-slate-800 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {onSecondary && (
          <button
            type="button"
            onPointerDown={(e) => { e.preventDefault(); onSecondary(); }}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-slate-800 active:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-semibold active:scale-95 transition-transform touch-none shadow-md"
          >
            <RefreshCw className="w-4 h-4 mb-0.5" />
            <span>{onSecondaryName}</span>
          </button>
        )}

        {onAction && (
          <button
            type="button"
            onPointerDown={(e) => { e.preventDefault(); onAction(); }}
            className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 active:from-emerald-500 active:to-teal-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 transition-transform touch-none border border-emerald-300/40"
          >
            <Zap className="w-6 h-6 fill-current mb-0.5" />
            <span>{onActionName}</span>
          </button>
        )}
      </div>
    </div>
  );
};
