import React, { useState } from 'react';
import {
  Gamepad2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  EyeOff,
  Flame,
  Star,
  Users,
  Compass,
  Zap,
  Globe,
  Play
} from 'lucide-react';
import { GamingSite, GAMING_SITES } from '../data/gamingSites';
import {
  PokiLogo,
  SoccerBrosLogo,
  FootballBrosLogo,
  WrestleBrosLogo,
  TwoVTwoLogo,
  OzGamesLogo
} from './BrandLogos';
import { sound } from '../utils/audio';
import { openAboutBlankCloak, launchDirectSafe } from '../utils/proxyLauncher';

interface GamingSectionProps {
  onOpenInPortal?: (url: string, name: string) => void;
}

export const GamingSection: React.FC<GamingSectionProps> = ({ onOpenInPortal }) => {
  const [selectedSite, setSelectedSite] = useState<GamingSite | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [launchMessage, setLaunchMessage] = useState<string | null>(null);

  const getSiteLogo = (key: GamingSite['iconKey'], size = 28) => {
    switch (key) {
      case 'poki':
        return <PokiLogo className="w-7 h-7" size={size} />;
      case 'soccerbros':
        return <SoccerBrosLogo className="w-7 h-7" size={size} />;
      case 'footballbros':
        return <FootballBrosLogo className="w-7 h-7" size={size} />;
      case 'wrestlebros':
        return <WrestleBrosLogo className="w-7 h-7" size={size} />;
      case '2v2io':
        return <TwoVTwoLogo className="w-7 h-7" size={size} />;
      case 'ozgames':
        return <OzGamesLogo className="w-7 h-7" size={size} />;
      default:
        return <Gamepad2 className="w-7 h-7 text-cyan-400" />;
    }
  };

  const handlePlayDirect = (site: GamingSite) => {
    sound.playClick();
    setLaunchMessage(`Opening ${site.name} directly...`);
    setTimeout(() => setLaunchMessage(null), 3000);
    launchDirectSafe(site.url);
  };

  const handlePlayCloaked = (site: GamingSite) => {
    sound.playClick();
    setLaunchMessage(`Launching ${site.name} in stealth cloaked window...`);
    setTimeout(() => setLaunchMessage(null), 3500);
    openAboutBlankCloak(site.url, `${site.name} – Classes`);
  };

  const handlePlayInPortal = (site: GamingSite) => {
    sound.playClick();
    if (onOpenInPortal) {
      onOpenInPortal(site.url, site.name);
    } else {
      launchDirectSafe(site.url);
    }
  };

  const filteredSites = GAMING_SITES.filter(site => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'bros') return site.id.includes('bros');
    if (activeFilter === 'pvp') return site.category.includes('PvP') || site.genre.includes('2v2');
    if (activeFilter === 'hubs') return site.category.includes('Hub');
    return true;
  });

  return (
    <section id="gaming-section" className="space-y-6 pt-2">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl galaxy-glass border border-cyan-500/25 p-6 sm:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.6)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 animate-nebula-slow" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16 animate-nebula-reverse" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-gaming font-semibold mb-3 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
              OFFICIAL GAMING SECTION & WEB TITLES
            </div>
            <h2 className="font-gaming text-2xl sm:text-4xl font-extrabold text-white tracking-wide leading-tight">
              Featured{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                Gaming Hubs & Games
              </span>
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Direct access to Poki, the entire Bros sports series, 2v2.io arenas, and OZ Games unblocked. Direct links, stealth tab cloaking, and zero filter limits.
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {[
              { id: 'all', label: 'All 6 Games', icon: '🎮' },
              { id: 'bros', label: 'Bros Series', icon: '⚽' },
              { id: 'pvp', label: 'PvP & 2v2', icon: '⚔️' },
              { id: 'hubs', label: 'Game Hubs', icon: '🌐' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveFilter(tab.id);
                }}
                className={`px-3.5 py-2 rounded-xl font-gaming text-xs transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                  activeFilter === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-[0_0_16px_rgba(6,182,212,0.4)] border border-cyan-400/60'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white border border-indigo-500/20 hover:border-cyan-400/40'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Notification message if launching */}
        {launchMessage && (
          <div className="mt-4 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-gaming flex items-center gap-2 animate-fade-in">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{launchMessage}</span>
          </div>
        )}
      </div>

      {/* Grid of 6 Featured Gaming Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSites.map((site) => (
          <div
            key={site.id}
            className="group relative galaxy-glass rounded-2xl overflow-hidden border border-indigo-500/25 transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] flex flex-col justify-between"
          >
            {/* Ambient Card Background Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${site.thumbnailGradient} opacity-60 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none`}
            />

            {/* Top Thumbnail Section */}
            <div className="relative p-5 pb-3">
              {/* Header with official logo, badge & rating */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2"
                    style={{
                      backgroundColor: `${site.accentColor}25`,
                      border: `1.5px solid ${site.accentColor}60`,
                      boxShadow: `0 0 16px ${site.accentColor}33`
                    }}
                  >
                    {getSiteLogo(site.iconKey, 30)}
                  </div>
                  <div>
                    <h3 className="font-gaming text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors tracking-wide flex items-center gap-2">
                      <span>{site.name}</span>
                    </h3>
                    <p className="text-[11px] font-mono text-cyan-300/90 font-medium">
                      {site.domain}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-gaming font-bold bg-indigo-950/80 text-cyan-300 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                    {site.badge}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{site.rating}</span>
                  </div>
                </div>
              </div>

              {/* Tagline & Description */}
              <div className="space-y-1.5 min-h-[58px]">
                <p className="text-xs font-gaming text-cyan-300 font-semibold tracking-wide">
                  {site.tagline}
                </p>
                <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed font-sans">
                  {site.description}
                </p>
              </div>

              {/* Badges / Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-white/10">
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Users className="w-3 h-3 text-cyan-400" />
                  {site.playersCount}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[10px] text-slate-300 font-gaming">
                  {site.genre}
                </span>
              </div>
            </div>

            {/* Bottom Controls / Action Buttons */}
            <div className="relative p-4 pt-3 bg-[#040817]/85 border-t border-indigo-500/20 backdrop-blur-md space-y-2">
              {/* Primary Direct Play Button */}
              <button
                type="button"
                onClick={() => handlePlayDirect(site)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-gaming font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(6,182,212,0.4)] hover:shadow-[0_0_26px_rgba(6,182,212,0.6)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                title={`Play ${site.name} (Direct to ${site.domain})`}
              >
                <Play className="w-3.5 h-3.5 fill-white stroke-none" />
                <span>PLAY {site.name.toUpperCase()} NOW</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-80" />
              </button>

              {/* Secondary Launch Options: Stealth Cloak & Web Portal */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handlePlayCloaked(site)}
                  className="py-1.5 px-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 text-[11px] font-gaming font-semibold flex items-center justify-center gap-1.5 transition-all duration-200"
                  title="Open stealthily in an about:blank window to bypass browser history and URL inspection"
                >
                  <EyeOff className="w-3 h-3 text-cyan-400" />
                  <span>Stealth Cloak</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePlayInPortal(site)}
                  className="py-1.5 px-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-indigo-400/40 text-[11px] font-gaming font-semibold flex items-center justify-center gap-1.5 transition-all duration-200"
                  title="Open inside the Web Portal tab"
                >
                  <Globe className="w-3 h-3 text-indigo-400" />
                  <span>Portal Tab</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
