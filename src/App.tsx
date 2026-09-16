import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Game, GameCategory, ModalType } from './types';
import { GAMES_LIST } from './data/games';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { CategoryBar } from './components/CategoryBar';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { WebSection } from './components/WebSection';
import { Footer } from './components/Footer';
import { GalaxyBackground } from './components/GalaxyBackground';
import { sound } from './utils/audio';
import {
  Gamepad2,
  Sparkles,
  Heart,
  TrendingUp,
  Flame,
  Star,
  SearchX,
  Play,
  Globe
} from 'lucide-react';

export default function App() {
  const [currentSection, setCurrentSection] = useState<'portal' | 'games'>('portal');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeSiteUrl, setActiveSiteUrl] = useState<string>('');
  const [incomingSite, setIncomingSite] = useState<{ url: string; name: string; timestamp: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [sortFilter, setSortFilter] = useState<'featured' | 'popular' | 'rating' | 'new'>('featured');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);

  // Dismiss initial HTML loading screen as soon as App component renders
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof (window as unknown as { dismissLoadingScreen?: () => void }).dismissLoadingScreen === 'function') {
      try {
        (window as unknown as { dismissLoadingScreen: () => void }).dismissLoadingScreen();
      } catch (e) {
        console.warn('Error calling dismissLoadingScreen from App:', e);
      }
    }
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('akwasi_games_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not access localStorage for favorites:', e);
    }
  }, []);

  // Sync favorites to localStorage
  const handleToggleFavorite = useCallback((gameId: string) => {
    setFavorites(prev => {
      let updated: string[];
      if (prev.includes(gameId)) {
        updated = prev.filter(id => id !== gameId);
      } else {
        updated = [...prev, gameId];
      }
      try {
        localStorage.setItem('akwasi_games_favorites', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
      return updated;
    });
  }, []);

  // Sound toggle
  const handleToggleSound = () => {
    const newState = sound.toggleSound();
    setSoundEnabled(newState);
  };

  // Quick Random Game picker
  const handleRandomGame = () => {
    sound.playClick();
    setCurrentSection('games');
    const randomIndex = Math.floor(Math.random() * GAMES_LIST.length);
    setSelectedGame(GAMES_LIST[randomIndex]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate category counts
  const gameCounts = useMemo(() => {
    const counts: Record<GameCategory, number> = {
      all: GAMES_LIST.length,
      arcade: 0,
      action: 0,
      puzzle: 0,
      retro: 0,
      racing: 0,
      sports: 0,
      strategy: 0
    };

    GAMES_LIST.forEach(g => {
      if (counts[g.category] !== undefined) {
        counts[g.category]++;
      }
    });

    return counts;
  }, []);

  // Filter and sort games
  const filteredGames = useMemo(() => {
    return GAMES_LIST.filter(game => {
      // Favorites filter
      if (activeTab === 'favorites' && !favorites.includes(game.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && game.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = game.title.toLowerCase().includes(query);
        const matchDesc = game.description.toLowerCase().includes(query);
        const matchCat = game.category.toLowerCase().includes(query);
        const matchTags = game.tags.some(t => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchCat && !matchTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortFilter === 'popular') return b.plays - a.plays;
      if (sortFilter === 'rating') return b.rating - a.rating;
      if (sortFilter === 'new') return (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0);
      return 0; // default featured order
    });
  }, [activeTab, favorites, selectedCategory, searchQuery, sortFilter]);

  // Featured game for the hero banner
  const featuredGame = useMemo(() => {
    return GAMES_LIST.find(g => g.id === 'galaxy-defender') || GAMES_LIST[0];
  }, []);

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-transparent text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Animated Galaxy Background with stars, nebula clouds, and space lighting */}
      <GalaxyBackground />

      {/* Top Navigation */}
      <Navbar
        activeUrl={activeSiteUrl}
        onSelectSite={(url, name) => {
          setCurrentSection('portal');
          setSelectedGame(null);
          setActiveSiteUrl(url);
          setIncomingSite({ url, name, timestamp: Date.now() });
        }}
        onGoHome={() => {
          sound.playClick();
          setCurrentSection('portal');
          setSelectedGame(null);
          setActiveSiteUrl('');
          setIncomingSite({ url: '', name: 'Portal Home & Search', timestamp: Date.now() });
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10">
        {currentSection === 'portal' ? (
          /* Web Portal & Search View */
          <WebSection
            incomingSite={incomingSite}
            activeUrl={activeSiteUrl}
            onUrlChange={setActiveSiteUrl}
            onBackToGames={() => {
              sound.playClick();
              setCurrentSection('games');
            }}
          />
        ) : selectedGame ? (
          /* Game Page View */
          <GamePlayer
            game={selectedGame}
            onBack={() => {
              sound.playClick();
              setSelectedGame(null);
            }}
            isFavorite={favorites.includes(selectedGame.id)}
            onToggleFavorite={handleToggleFavorite}
            onSelectGame={handleSelectGame}
            favorites={favorites}
          />
        ) : (
          /* Homepage View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
            {/* Hero Section with Galaxy Glass & Space Lighting */}
            <div className="relative overflow-hidden rounded-3xl galaxy-glass border border-indigo-500/25 p-6 sm:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.6)]">
              {/* Background ambient cosmic accents */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 animate-nebula-slow" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20 animate-nebula-reverse" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Left Text */}
                <div className="text-center lg:text-left max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-cyan-300 text-xs font-gaming font-semibold mb-4 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    FAST & LIGHTWEIGHT UNBLOCKED GAMING HUB
                  </div>

                  <h1 className="font-gaming text-3xl sm:text-5xl font-extrabold text-white tracking-wide leading-tight drop-shadow-[0_0_25px_rgba(99,102,241,0.3)]">
                    Akwasi{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                      Unblocked Games
                    </span>
                  </h1>

                  <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl font-sans">
                    Play the best retro, arcade, and puzzle games unblocked directly in your browser. No downloads, no plugins, zero lag.
                  </p>

                  {/* Feature Pills & Web CTA with subtle hover animations */}
                  <div className="mt-5 flex flex-wrap justify-center lg:justify-start gap-2.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setCurrentSection('portal');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-gaming font-bold flex items-center gap-2 transition-all duration-200 shadow-[0_0_18px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95"
                    >
                      <Globe className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>RETURN TO WEB PORTAL</span>
                    </button>
                    <span className="px-3 py-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-indigo-500/20 text-slate-200 hover:border-cyan-400/40 hover:scale-105 transition-all duration-200">
                      ⚡ 100% Free
                    </span>
                    <span className="px-3 py-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-indigo-500/20 text-slate-200 hover:border-cyan-400/40 hover:scale-105 transition-all duration-200">
                      🕹️ Native HTML5 Engines
                    </span>
                    <span className="px-3 py-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-indigo-500/20 text-slate-200 hover:border-cyan-400/40 hover:scale-105 transition-all duration-200">
                      📱 Mobile & PC Ready
                    </span>
                  </div>
                </div>

                {/* Right Featured Game Card */}
                {featuredGame && (
                  <div className="w-full sm:w-80 shrink-0 galaxy-glass border border-indigo-500/30 rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-bold font-gaming text-cyan-300 flex items-center gap-1 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        FEATURED GAME
                      </span>
                      <span className="text-[10px] bg-indigo-950/80 text-slate-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">
                        {(featuredGame.plays / 1000).toFixed(1)}k plays
                      </span>
                    </div>

                    <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 border border-indigo-500/25">
                      <GameCard
                        game={featuredGame}
                        isFavorite={favorites.includes(featuredGame.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onPlay={handleSelectGame}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="py-2">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                resultCount={filteredGames.length}
              />
            </div>

            {/* Category Navigation Bar */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CategoryBar
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    sound.playClick();
                    setSelectedCategory(cat);
                  }}
                  gameCounts={gameCounts}
                />
              </div>

              {/* Sorting & Filter bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-gaming font-semibold text-white">
                    {activeTab === 'favorites' ? 'YOUR FAVORITES' : 'GAME CATALOG'}
                  </span>
                  <span>•</span>
                  <span>Showing {filteredGames.length} games</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 hidden sm:inline mr-1 font-gaming">Sort by:</span>
                  {(['featured', 'popular', 'rating'] as const).map((filter) => {
                    const isActive = sortFilter === filter;
                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => { sound.playClick(); setSortFilter(filter); }}
                        className={`px-3 py-1 rounded-lg font-gaming text-xs capitalize transition-all duration-200 hover:scale-105 active:scale-95 ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)] border border-cyan-400/50'
                            : 'bg-white/[0.04] text-slate-300 hover:text-white border border-indigo-500/20 hover:border-cyan-400/40'
                        }`}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Games Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredGames.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onPlay={handleSelectGame}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="py-16 text-center bg-[#0d1220] rounded-2xl border border-slate-800 p-8">
                {activeTab === 'favorites' ? (
                  <div className="max-w-md mx-auto space-y-3">
                    <Heart className="w-12 h-12 text-rose-500/60 mx-auto" />
                    <h3 className="font-gaming text-lg font-bold text-white">No Favorite Games Yet</h3>
                    <p className="text-xs text-slate-400">
                      Click the heart icon on any game card to bookmark your favorites here for instant access!
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('all')}
                      className="mt-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-gaming font-bold text-xs rounded-xl transition-all"
                    >
                      BROWSE ALL GAMES
                    </button>
                  </div>
                ) : (
                  <div className="max-w-md mx-auto space-y-3">
                    <SearchX className="w-12 h-12 text-slate-500 mx-auto" />
                    <h3 className="font-gaming text-lg font-bold text-white">No Games Found</h3>
                    <p className="text-xs text-slate-400">
                      We couldn&apos;t find any games matching &quot;{searchQuery}&quot;. Try a different search term or category.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-gaming font-bold text-xs rounded-xl transition-all"
                    >
                      RESET SEARCH FILTERS
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenModal={(type) => setActiveModal(type)}
        activeModal={activeModal}
        onCloseModal={() => setActiveModal(null)}
      />
    </div>
  );
}
