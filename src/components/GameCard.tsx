import React from 'react';
import { Game } from '../types';
import { GameThumbnail } from './GameThumbnail';
import { Play, Heart, Star, Users } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
  onPlay: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlay
}) => {
  return (
    <div className="group relative galaxy-glass galaxy-glass-hover rounded-2xl border border-indigo-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_24px_rgba(6,182,212,0.22)] shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 flex flex-col overflow-hidden">
      {/* Thumbnail Header with Play overlay */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950/80">
        <GameThumbnail
          iconType={game.iconType}
          accentColor={game.accentColor}
          title={game.title}
        />

        {/* Badge (HOT, POPULAR, etc.) */}
        {game.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-black font-gaming tracking-wider uppercase border shadow-md ${
                game.badge === 'HOT'
                  ? 'bg-rose-500/90 text-white border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                  : game.badge === 'POPULAR'
                  ? 'bg-amber-500/90 text-slate-950 border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                  : game.badge === 'NEW'
                  ? 'bg-emerald-500/90 text-slate-950 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  : 'bg-cyan-500/90 text-slate-950 border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              }`}
            >
              {game.badge}
            </span>
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            onToggleFavorite(game.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-xl backdrop-blur-md transition-all duration-200 active:scale-90 border hover:scale-110 ${
            isFavorite
              ? 'bg-rose-500/80 text-white border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]'
              : 'bg-slate-950/60 text-slate-300 hover:text-white border-white/10 hover:bg-slate-900/80 hover:border-rose-400/40'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Play Hover Overlay */}
        <div
          onClick={() => {
            sound.playClick();
            onPlay(game);
          }}
          className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center cursor-pointer z-10"
        >
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold font-gaming flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.5)] transform scale-90 group-hover:scale-100 transition-all duration-200 hover:shadow-[0_0_25px_rgba(99,102,241,0.7)]"
          >
            <Play className="w-4 h-4 fill-current text-white" />
            PLAY NOW
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="capitalize font-semibold text-cyan-400 font-gaming tracking-wide">
              {game.category}
            </span>
            <div className="flex items-center gap-1 text-amber-300 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{game.rating}</span>
            </div>
          </div>

          {/* Game Title */}
          <h3
            onClick={() => {
              sound.playClick();
              onPlay(game);
            }}
            className="font-gaming text-base font-bold text-slate-100 hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1 mb-1"
          >
            {game.title}
          </h3>

          {/* Brief description */}
          <p className="text-xs text-slate-300/80 font-sans line-clamp-2 leading-relaxed mb-3">
            {game.description}
          </p>
        </div>

        {/* Footer info & Play Button */}
        <div className="pt-2 border-t border-indigo-500/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-sans">
            <Users className="w-3 h-3 text-slate-500" />
            <span>{(game.plays / 1000).toFixed(1)}k plays</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onPlay(game);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 hover:border-cyan-400 font-gaming font-bold text-xs flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(6,182,212,0.15)] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <Play className="w-3 h-3 fill-current" />
            Play
          </button>
        </div>
      </div>
    </div>
  );
};
