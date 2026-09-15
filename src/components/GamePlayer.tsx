import React, { useRef, useState } from 'react';
import { Game } from '../types';
import { GAMES_LIST } from '../data/games';
import { GameCard } from './GameCard';
import {
  ArrowLeft,
  Heart,
  Maximize2,
  Share2,
  Check,
  Star,
  Gamepad2,
  Keyboard,
  Info,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/audio';

// Built-in game components
import { GalaxyDefender } from '../games/GalaxyDefender';
import { RetroSnake } from '../games/RetroSnake';
import { CyberFlappy } from '../games/CyberFlappy';
import { BrickBreaker } from '../games/BrickBreaker';
import { Game2048 } from '../games/Game2048';
import { HighwayRacer } from '../games/HighwayRacer';
import { RetroPong } from '../games/RetroPong';
import { BlockFall } from '../games/BlockFall';
import { Minesweeper } from '../games/Minesweeper';
import { SpeedReflex } from '../games/SpeedReflex';
import { CosmicAsteroids } from '../games/CosmicAsteroids';
import { MemoryMatrix } from '../games/MemoryMatrix';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
  onSelectGame: (game: Game) => void;
  favorites: string[];
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
  favorites
}) => {
  const gameFrameRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'controls' | 'instructions'>('controls');

  const toggleFullscreen = () => {
    if (!gameFrameRef.current) return;
    sound.playClick();
    if (!document.fullscreenElement) {
      gameFrameRef.current.requestFullscreen().catch(err => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleShare = () => {
    sound.playClick();
    const url = window.location.href;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Render the matching game component
  const renderGame = () => {
    switch (game.id) {
      case 'galaxy-defender':
        return <GalaxyDefender />;
      case 'retro-snake':
        return <RetroSnake />;
      case 'cyber-flappy':
        return <CyberFlappy />;
      case 'brick-breaker':
        return <BrickBreaker />;
      case '2048-cyber':
        return <Game2048 />;
      case 'highway-racer':
        return <HighwayRacer />;
      case 'retro-pong':
        return <RetroPong />;
      case 'block-fall':
        return <BlockFall />;
      case 'minesweeper':
        return <Minesweeper />;
      case 'speed-reflex':
        return <SpeedReflex />;
      case 'cosmic-asteroids':
        return <CosmicAsteroids />;
      case 'memory-matrix':
        return <MemoryMatrix />;
      default:
        return <GalaxyDefender />;
    }
  };

  // Filter recommendations
  const relatedGames = GAMES_LIST.filter(g => g.id !== game.id).slice(0, 4);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumbs & Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0d1220] p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs sm:text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Games</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-gaming text-lg sm:text-2xl font-bold text-white">
                {game.title}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-xs font-bold font-gaming uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {game.category}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                {game.rating}
              </span>
              <span>•</span>
              <span>{(game.plays / 1000).toFixed(1)}k plays</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">100% Unblocked</span>
            </div>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2">
          {/* Favorite */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onToggleFavorite(game.id);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs sm:text-sm font-semibold transition-colors"
            title="Copy Game Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 hover:border-emerald-400 text-xs sm:text-sm font-bold font-gaming transition-all"
            title="Play in Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Embedded HTML5 Game Screen */}
      <div
        ref={gameFrameRef}
        className="w-full bg-[#070a14] rounded-2xl border border-slate-800 p-3 sm:p-6 shadow-2xl flex flex-col items-center justify-center overflow-hidden"
      >
        {renderGame()}
      </div>

      {/* Game Information & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Controls & How to Play */}
        <div className="lg:col-span-2 bg-[#0d1220] rounded-2xl border border-slate-800 p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('controls')}
                className={`px-3 py-1.5 rounded-lg font-gaming text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'controls'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Keyboard className="w-4 h-4" />
                CONTROLS & KEYS
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('instructions')}
                className={`px-3 py-1.5 rounded-lg font-gaming text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'instructions'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Info className="w-4 h-4" />
                HOW TO PLAY
              </button>
            </div>
          </div>

          {activeTab === 'controls' ? (
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {game.controls.map((ctrl, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
                  >
                    <span className="text-xs text-slate-300 font-medium">
                      {ctrl.action}
                    </span>
                    <kbd className="px-2.5 py-1 rounded bg-slate-800 text-emerald-300 font-mono text-xs border border-slate-700 shadow-xs font-semibold">
                      {ctrl.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 pt-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Playing on mobile? On-screen touch buttons will automatically appear below the game canvas!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <ul className="space-y-2 text-sm text-slate-300">
                {game.instructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-gaming text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right 1 Col: Game Overview Card */}
        <div className="bg-[#0d1220] rounded-2xl border border-slate-800 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-gaming text-base font-bold text-white mb-2 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              ABOUT THIS GAME
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {game.description}
            </p>

            <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
              <div className="flex justify-between text-slate-400">
                <span>Category</span>
                <span className="text-slate-200 capitalize font-medium">{game.category}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Engine</span>
                <span className="text-slate-200 font-medium">HTML5 Canvas (Zero Latency)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Rating</span>
                <span className="text-amber-400 font-medium">{game.rating} / 5.0</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Compatibility</span>
                <span className="text-emerald-400 font-medium">Desktop & Mobile</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-1.5">
            {game.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Games Grid */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-gaming text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            MORE UNBLOCKED GAMES
          </h2>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-gaming font-semibold text-emerald-400 hover:text-emerald-300"
          >
            VIEW ALL →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedGames.map(rel => (
            <GameCard
              key={rel.id}
              game={rel}
              isFavorite={favorites.includes(rel.id)}
              onToggleFavorite={onToggleFavorite}
              onPlay={onSelectGame}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
