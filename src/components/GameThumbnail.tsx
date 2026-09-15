import React from 'react';

interface GameThumbnailProps {
  iconType: string;
  accentColor: string;
  title: string;
  className?: string;
}

export const GameThumbnail: React.FC<GameThumbnailProps> = ({
  iconType,
  accentColor,
  title,
  className = 'w-full h-full'
}) => {
  switch (iconType) {
    case 'rocket': // Galaxy Defender
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-b from-[#0a1128] via-[#0f172a] to-[#040814] overflow-hidden ${className}`}>
          {/* Starfield */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/30 via-transparent to-transparent" />
          <div className="absolute top-3 left-6 w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute top-12 right-8 w-1.5 h-1.5 bg-cyan-300 rounded-full" />
          <div className="absolute bottom-6 left-12 w-1 h-1 bg-white rounded-full opacity-60" />
          <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full opacity-80" />

          {/* Alien Formation */}
          <div className="absolute top-4 flex gap-4 opacity-80">
            <svg width="24" height="20" viewBox="0 0 24 20" fill="#ec4899">
              <path d="M4 0h16v4H4zM0 4h24v4H0zM0 8h8v4H0zm16 0h8v4H16zm-8 4h8v4H8zm-4 4h4v4H4zm12 0h4v4h-4z" />
            </svg>
            <svg width="24" height="20" viewBox="0 0 24 20" fill="#a855f7">
              <path d="M4 0h16v4H4zM0 4h24v4H0zM0 8h8v4H0zm16 0h8v4H16zm-8 4h8v4H8zm-4 4h4v4H4zm12 0h4v4h-4z" />
            </svg>
            <svg width="24" height="20" viewBox="0 0 24 20" fill="#06b6d4">
              <path d="M4 0h16v4H4zM0 4h24v4H0zM0 8h8v4H0zm16 0h8v4H16zm-8 4h8v4H8zm-4 4h4v4H4zm12 0h4v4h-4z" />
            </svg>
          </div>

          {/* Player Rocket */}
          <div className="relative z-10 flex flex-col items-center">
            <svg width="46" height="54" viewBox="0 0 46 54" fill="none">
              {/* Laser shots */}
              <rect x="15" y="0" width="3" height="12" rx="1.5" fill="#38bdf8" />
              <rect x="28" y="0" width="3" height="12" rx="1.5" fill="#38bdf8" />
              {/* Ship Body */}
              <polygon points="23,12 36,44 10,44" fill="#0284c7" />
              <polygon points="23,12 28,44 18,44" fill="#38bdf8" />
              <polygon points="10,44 2,50 14,46" fill="#0369a1" />
              <polygon points="36,44 44,50 32,46" fill="#0369a1" />
              {/* Thruster Flame */}
              <polygon points="19,46 23,54 27,46" fill="#f97316" />
            </svg>
          </div>
        </div>
      );

    case 'snake': // Retro Snake
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-br from-[#061e14] via-[#091510] to-[#040d08] overflow-hidden ${className}`}>
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          {/* Apple */}
          <div className="absolute top-6 right-8 w-5 h-5 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-red-200 rounded-full" />
          </div>

          {/* Glowing Snake Body */}
          <div className="relative z-10 flex items-center">
            <div className="flex flex-col gap-1.5 items-end">
              <div className="flex gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-emerald-700" />
                <div className="w-4 h-4 rounded-sm bg-emerald-600" />
                <div className="w-4 h-4 rounded-sm bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              </div>
              <div className="flex gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-emerald-400" />
                <div className="w-4 h-4 rounded-sm bg-emerald-400" />
                {/* Snake Head with eyes */}
                <div className="relative w-5 h-5 rounded-sm bg-emerald-300 shadow-[0_0_14px_#34d399] flex items-center justify-around px-0.5">
                  <div className="w-1 h-1 bg-black rounded-full" />
                  <div className="w-1 h-1 bg-black rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'bird': // Cyber Flappy
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-b from-[#180e29] via-[#101026] to-[#070716] overflow-hidden ${className}`}>
          {/* Laser Pillars / Pipes */}
          <div className="absolute top-0 right-7 w-8 h-14 bg-gradient-to-b from-cyan-600 to-cyan-400 rounded-b-md border-b-4 border-cyan-200 shadow-[0_0_10px_#06b6d4]" />
          <div className="absolute bottom-0 right-7 w-8 h-16 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-md border-t-4 border-cyan-200 shadow-[0_0_10px_#06b6d4]" />
          
          {/* Cyber Flappy Robot */}
          <div className="relative z-10 flex items-center gap-1">
            <div className="relative w-9 h-7 rounded-full bg-amber-400 border-2 border-amber-300 shadow-[0_0_12px_#f59e0b] flex items-center justify-center">
              {/* Eye */}
              <div className="absolute top-1.5 right-2 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
              {/* Wing */}
              <div className="w-3.5 h-2.5 bg-amber-500 rounded-full border border-amber-600" />
              {/* Beak */}
              <div className="absolute -right-2 top-2.5 w-3 h-2 bg-orange-500 rounded-r-md" />
            </div>
            {/* Jet Thrust particles */}
            <div className="flex gap-1">
              <div className="w-2 h-1.5 bg-cyan-400 rounded-full opacity-80 animate-pulse" />
              <div className="w-1.5 h-1 bg-cyan-200 rounded-full opacity-50" />
            </div>
          </div>
        </div>
      );

    case 'bricks': // Neon Brick Breaker
      return (
        <div className={`relative flex flex-col items-center justify-between p-4 bg-gradient-to-b from-[#140b2b] via-[#110e21] to-[#070512] overflow-hidden ${className}`}>
          {/* Top Bricks Matrix */}
          <div className="w-full flex flex-col gap-1.5 pt-1">
            <div className="grid grid-cols-4 gap-1.5">
              <div className="h-3 rounded-xs bg-pink-500 shadow-[0_0_6px_#ec4899]" />
              <div className="h-3 rounded-xs bg-purple-500 shadow-[0_0_6px_#a855f7]" />
              <div className="h-3 rounded-xs bg-indigo-500 shadow-[0_0_6px_#6366f1]" />
              <div className="h-3 rounded-xs bg-pink-500 shadow-[0_0_6px_#ec4899]" />
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <div className="h-3 rounded-xs bg-cyan-500 shadow-[0_0_6px_#06b6d4]" />
              <div className="h-3 rounded-xs bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              <div className="h-3 rounded-xs bg-yellow-500 shadow-[0_0_6px_#eab308]" />
              <div className="h-3 rounded-xs bg-cyan-500 shadow-[0_0_6px_#06b6d4]" />
            </div>
          </div>

          {/* Energy Ball */}
          <div className="relative self-center my-auto">
            <div className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_#ffffff,0_0_18px_#c084fc]" />
          </div>

          {/* Paddle */}
          <div className="w-20 h-3 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 shadow-[0_0_12px_#c084fc]" />
        </div>
      );

    case 'grid': // 2048
      return (
        <div className={`relative flex items-center justify-center p-3 bg-gradient-to-br from-[#200918] via-[#170c1e] to-[#0d0510] overflow-hidden ${className}`}>
          <div className="grid grid-cols-2 gap-2">
            <div className="w-11 h-11 rounded-lg bg-pink-500/30 border border-pink-500/50 flex items-center justify-center font-bold text-pink-300 text-sm shadow-[0_0_8px_rgba(236,72,153,0.3)]">
              512
            </div>
            <div className="w-11 h-11 rounded-lg bg-rose-500/40 border border-rose-500/60 flex items-center justify-center font-bold text-rose-200 text-sm shadow-[0_0_10px_rgba(244,63,94,0.4)]">
              1024
            </div>
            <div className="w-11 h-11 rounded-lg bg-purple-500/30 border border-purple-500/50 flex items-center justify-center font-bold text-purple-300 text-sm shadow-[0_0_8px_rgba(168,85,247,0.3)]">
              256
            </div>
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 border border-amber-300 flex items-center justify-center font-extrabold text-slate-950 text-sm shadow-[0_0_16px_rgba(245,158,11,0.6)]">
              2048
            </div>
          </div>
        </div>
      );

    case 'car': // Highway Racer
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-b from-[#180a0a] via-[#12080a] to-[#080203] overflow-hidden ${className}`}>
          {/* Road markings */}
          <div className="absolute inset-y-0 w-24 bg-[#1e1315] border-x-2 border-red-500/30 flex justify-around">
            <div className="w-1 h-full bg-[linear-gradient(to_bottom,#ef4444_50%,transparent_50%)] bg-[size:4px_24px] opacity-40" />
            <div className="w-1 h-full bg-[linear-gradient(to_bottom,#ef4444_50%,transparent_50%)] bg-[size:4px_24px] opacity-40" />
          </div>

          {/* Enemy Car ahead */}
          <div className="absolute top-4 left-1/3 w-6 h-10 rounded-sm bg-slate-500 border border-slate-400 flex flex-col justify-between py-1 items-center opacity-80">
            <div className="w-4 h-1.5 bg-slate-800 rounded-xs" />
            <div className="flex justify-between w-4 px-0.5">
              <div className="w-1 h-1 bg-red-400 rounded-full" />
              <div className="w-1 h-1 bg-red-400 rounded-full" />
            </div>
          </div>

          {/* Player Cyber Racer */}
          <div className="relative z-10 w-7 h-12 rounded-md bg-gradient-to-t from-red-600 via-rose-500 to-red-400 border border-red-300 shadow-[0_0_14px_#ef4444] flex flex-col justify-between p-1 items-center">
            {/* Front Headlights */}
            <div className="flex justify-between w-full px-0.5">
              <div className="w-1.5 h-1 bg-cyan-300 rounded-xs shadow-[0_0_6px_#67e8f9]" />
              <div className="w-1.5 h-1 bg-cyan-300 rounded-xs shadow-[0_0_6px_#67e8f9]" />
            </div>
            <div className="w-4 h-3 bg-slate-950 rounded-xs border border-red-300/40" />
            {/* Rear Exhaust Boost */}
            <div className="flex gap-1 -mb-2.5">
              <div className="w-1.5 h-3 bg-orange-400 rounded-full shadow-[0_0_8px_#f97316]" />
              <div className="w-1.5 h-3 bg-orange-400 rounded-full shadow-[0_0_8px_#f97316]" />
            </div>
          </div>
        </div>
      );

    case 'pong': // Retro Pong
      return (
        <div className={`relative flex items-center justify-between px-6 bg-gradient-to-b from-[#061816] via-[#091515] to-[#030d0d] overflow-hidden ${className}`}>
          {/* Center Net line */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 border-r-2 border-dashed border-teal-500/40" />
          
          {/* Left Paddle */}
          <div className="w-2.5 h-12 rounded-sm bg-teal-400 shadow-[0_0_10px_#2dd4bf]" />

          {/* Glowing Ball */}
          <div className="relative -ml-4 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />

          {/* Right Paddle */}
          <div className="w-2.5 h-12 rounded-sm bg-teal-400 shadow-[0_0_10px_#2dd4bf]" />
        </div>
      );

    case 'blocks': // Tetris / Block Fall
      return (
        <div className={`relative flex items-center justify-center p-3 bg-gradient-to-b from-[#091629] via-[#081220] to-[#030912] overflow-hidden ${className}`}>
          <div className="flex flex-col gap-1 items-center">
            {/* T-Piece Falling */}
            <div className="flex flex-col items-center mb-3">
              <div className="w-4 h-4 bg-purple-500 rounded-xs shadow-[0_0_6px_#a855f7] border border-purple-300/50" />
              <div className="flex">
                <div className="w-4 h-4 bg-purple-500 rounded-xs shadow-[0_0_6px_#a855f7] border border-purple-300/50" />
                <div className="w-4 h-4 bg-purple-500 rounded-xs shadow-[0_0_6px_#a855f7] border border-purple-300/50" />
                <div className="w-4 h-4 bg-purple-500 rounded-xs shadow-[0_0_6px_#a855f7] border border-purple-300/50" />
              </div>
            </div>

            {/* Bottom Stack */}
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-cyan-500 rounded-xs shadow-[0_0_6px_#06b6d4] border border-cyan-300/50" />
              <div className="w-4 h-4 bg-cyan-500 rounded-xs shadow-[0_0_6px_#06b6d4] border border-cyan-300/50" />
              <div className="w-4 h-4 bg-amber-500 rounded-xs shadow-[0_0_6px_#f59e0b] border border-amber-300/50" />
              <div className="w-4 h-4 bg-amber-500 rounded-xs shadow-[0_0_6px_#f59e0b] border border-amber-300/50" />
              <div className="w-4 h-4 bg-emerald-500 rounded-xs shadow-[0_0_6px_#10b981] border border-emerald-300/50" />
            </div>
          </div>
        </div>
      );

    case 'asteroid': // Cosmic Asteroids
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-b from-[#180d28] via-[#12081f] to-[#07030e] overflow-hidden ${className}`}>
          {/* Big Asteroid */}
          <div className="absolute top-3 left-4 w-12 h-12 rounded-full border border-purple-400/60 bg-purple-900/30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-purple-400/20" />
          </div>

          {/* Small Asteroid */}
          <div className="absolute bottom-4 right-6 w-8 h-8 rounded-full border border-purple-400/60 bg-purple-900/30 flex items-center justify-center" />

          {/* Laser Projectile */}
          <div className="absolute top-1/2 left-1/2 w-3 h-1 bg-cyan-300 rounded-full shadow-[0_0_8px_#67e8f9]" />

          {/* Vector Spaceship */}
          <div className="relative z-10 rotate-45">
            <svg width="28" height="34" viewBox="0 0 28 34">
              <polygon points="14,2 26,30 14,24 2,30" fill="none" stroke="#c084fc" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      );

    case 'bomb': // Minesweeper
      return (
        <div className={`relative flex items-center justify-center p-3 bg-gradient-to-br from-[#1c1809] via-[#141006] to-[#0a0802] overflow-hidden ${className}`}>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="w-8 h-8 rounded-sm bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-xs font-bold text-yellow-300">
              1
            </div>
            <div className="w-8 h-8 rounded-sm bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-xs font-bold text-emerald-400">
              2
            </div>
            {/* Flagged */}
            <div className="w-8 h-8 rounded-sm bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-sm">
              🚩
            </div>
            <div className="w-8 h-8 rounded-sm bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xs text-slate-400">
              •
            </div>
            {/* Cyber Mine */}
            <div className="w-8 h-8 rounded-sm bg-amber-500/30 border border-amber-500 flex items-center justify-center text-amber-300 text-sm shadow-[0_0_8px_#f59e0b]">
              💣
            </div>
            <div className="w-8 h-8 rounded-sm bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-xs font-bold text-yellow-300">
              1
            </div>
          </div>
        </div>
      );

    case 'target': // Speed Reflex
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-br from-[#061e16] via-[#091712] to-[#040e0a] overflow-hidden ${className}`}>
          {/* Target Ring */}
          <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-emerald-500/60 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-emerald-400/80 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              </div>
            </div>
            {/* Crosshair Lines */}
            <div className="absolute w-24 h-0.5 bg-emerald-400/40" />
            <div className="absolute h-24 w-0.5 bg-emerald-400/40" />
          </div>
        </div>
      );

    case 'brain': // Memory Matrix
    default:
      return (
        <div className={`relative flex items-center justify-center p-3 bg-gradient-to-br from-[#121028] via-[#0f0e20] to-[#060610] overflow-hidden ${className}`}>
          <div className="grid grid-cols-2 gap-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/30 border border-indigo-500/40 shadow-[0_0_10px_#6366f1]" />
            <div className="w-9 h-9 rounded-lg bg-pink-500/20 border border-pink-500/30" />
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/30" />
            <div className="w-9 h-9 rounded-lg bg-indigo-500/40 border border-indigo-400 shadow-[0_0_12px_#818cf8]" />
          </div>
        </div>
      );
  }
};
