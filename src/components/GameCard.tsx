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
    <div className="group relative bg-[#0f1422] rounded-2xl border border-slate-800/80 hover:border-emerald-500/50 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] transition-all duration-250 flex flex-col overflow-hidden">
      {/* Thumbnail Header with Play overlay */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
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
                  ? 'bg-rose-500/90 text-white border-rose-400'
                  : game.badge === 'POPULAR'
                  ? 'bg-amber-500/90 text-slate-950 border-amber-300'
                  : game.badge === 'NEW'
                  ? 'bg-emerald-500/90 text-slate-950 border-emerald-300'
                  : 'bg-cyan-500/90 text-slate-950 border-cyan-300'
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
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-xl backdrop-blur-md transition-transform active:scale-90 border ${
            isFavorite
              ? 'bg-rose-500/80 text-white border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]'
              : 'bg-slate-950/60 text-slate-300 hover:text-white border-white/10 hover:bg-slate-900/80'
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
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-10"
        >
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold font-gaming flex items-center gap-2 shadow-xl shadow-emerald-500/30 transform scale-90 group-hover:scale-100 transition-transform"
          >
            <Play className="w-4 h-4 fill-current" />
            PLAY NOW
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="capitalize font-medium text-emerald-400 font-gaming">
              {game.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
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
            className="font-gaming text-base font-bold text-slate-100 hover:text-emerald-400 transition-colors cursor-pointer line-clamp-1 mb-1"
          >
            {game.title}
          </h3>

          {/* Brief description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {game.description}
          </p>
        </div>

        {/* Footer info & Play Button */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Users className="w-3 h-3 text-slate-500" />
            <span>{(game.plays / 1000).toFixed(1)}k plays</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onPlay(game);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 hover:border-emerald-400 font-gaming font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Play className="w-3 h-3 fill-current" />
            Play
          </button>
        </div>
      </div>
    </div>
  );
};
