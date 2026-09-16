import React from 'react';
import {
  Globe,
  Home,
  Gamepad2,
  Shield,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  YouTubeLogo,
  TikTokLogo,
  SnapchatLogo,
  DiscordLogo,
  RobloxLogo,
  GoogleLogo
} from './BrandLogos';
import { sound } from '../utils/audio';

export interface NavSite {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

interface NavbarProps {
  onSelectSite: (url: string, name: string) => void;
  activeUrl?: string;
  onGoHome: () => void;
  onOpenGaming?: () => void;
  onOpenUnblocker?: () => void;
  activeSection?: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const NAV_SITES: NavSite[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com',
    icon: <YouTubeLogo className="w-4 h-4" />,
    color: '#FF0000'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com',
    icon: <TikTokLogo className="w-4 h-4" />,
    color: '#00F2FE'
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    url: 'https://web.snapchat.com',
    icon: <SnapchatLogo className="w-4 h-4" />,
    color: '#FFFC00'
  },
  {
    id: 'discord',
    name: 'Discord',
    url: 'https://discord.com',
    icon: <DiscordLogo className="w-4 h-4" />,
    color: '#5865F2'
  },
  {
    id: 'roblox',
    name: 'Roblox',
    url: 'https://www.roblox.com',
    icon: <RobloxLogo className="w-4 h-4" fill="#FFFFFF" />,
    color: '#E2231A'
  },
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com',
    icon: <GoogleLogo className="w-4 h-4" />,
    color: '#4285F4'
  }
];

export const Navbar: React.FC<NavbarProps> = ({
  onSelectSite,
  activeUrl = '',
  onGoHome,
  onOpenGaming,
  onOpenUnblocker,
  activeSection,
  soundEnabled,
  onToggleSound
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#050917]/85 backdrop-blur-xl border-b border-indigo-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden shrink-0 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          title="Return to Portal Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_28px_rgba(168,85,247,0.6)] group-hover:scale-105 transition-all duration-300">
            <Globe className="w-5 h-5 stroke-[2.4] text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-gaming text-base sm:text-lg font-bold tracking-wider text-white group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                Akwasi Unblocked Games
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-gaming bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans -mt-0.5">
              Fast Web Portal & Popular Websites
            </p>
          </div>
        </button>

        {/* Navigation Menu with Gaming, UNBLOCKER, and Popular Websites */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 px-1.5 bg-[#080d20]/80 backdrop-blur-md rounded-xl border border-indigo-500/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] scrollbar-none max-w-full">
          {/* Home portal button */}
          <button
            type="button"
            onClick={onGoHome}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-gaming font-semibold transition-all duration-200 shrink-0 hover:scale-105 active:scale-95 ${
              !activeUrl && activeSection === 'portal'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.07] border border-transparent'
            }`}
            title="Portal Home & Search"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Home</span>
          </button>

          {/* Dedicated GAMING Section Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              if (onOpenGaming) onOpenGaming();
            }}
            className={`group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-gaming font-bold transition-all duration-200 shrink-0 border hover:scale-105 active:scale-95 ${
              activeSection === 'gaming'
                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-200 border-cyan-400/80 shadow-[0_0_16px_rgba(6,182,212,0.4)]'
                : 'bg-cyan-500/10 text-cyan-300 hover:text-white hover:bg-cyan-500/20 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.15)]'
            }`}
            title="Dedicated Gaming Hub: Poki, Soccer Bros, Football Bros, Wrestle Bros, 2v2.io, OZ Games"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-400 transition-transform duration-200 group-hover:scale-110" />
            <span>Gaming</span>
            <span className="hidden lg:inline px-1 py-0.2 text-[9px] font-bold bg-cyan-400/20 text-cyan-300 rounded border border-cyan-400/30">
              NEW
            </span>
          </button>

          {/* Dedicated UNBLOCKER Section Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              if (onOpenUnblocker) onOpenUnblocker();
            }}
            className={`group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-gaming font-bold transition-all duration-200 shrink-0 border hover:scale-105 active:scale-95 ${
              activeSection === 'unblocker'
                ? 'bg-gradient-to-r from-emerald-500/30 to-teal-600/30 text-emerald-200 border-emerald-400/80 shadow-[0_0_16px_rgba(16,185,129,0.4)]'
                : 'bg-emerald-500/10 text-emerald-300 hover:text-white hover:bg-emerald-500/20 border-emerald-500/30 hover:border-emerald-400/60 shadow-[0_0_8px_rgba(16,185,129,0.15)]'
            }`}
            title="Proxy Unblocker & Tab Cloaker Suite"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400 transition-transform duration-200 group-hover:scale-110" />
            <span>UNBLOCKER</span>
          </button>

          {/* 6 Popular Website Menu Items with Official Brand SVGs */}
          {NAV_SITES.map((site) => {
            const isActive = activeUrl.includes(site.id) || (site.id === 'google' && activeUrl.includes('google.com'));
            return (
              <button
                key={site.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onSelectSite(site.url, site.name);
                }}
                className={`group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-gaming font-semibold transition-all duration-200 shrink-0 border hover:scale-105 active:scale-95 ${
                  isActive
                    ? 'bg-indigo-950/80 text-white border-cyan-400/60 shadow-[0_0_16px_rgba(6,182,212,0.35)]'
                    : 'bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.08] border-white/5 hover:border-indigo-400/40 hover:shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                }`}
                title={`Access ${site.name}`}
              >
                <span className="flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  {site.icon}
                </span>
                <span className="text-[11px] sm:text-xs tracking-wide">{site.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Right action controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Audio toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-[#080d20]/80 backdrop-blur-md text-slate-400 hover:text-white border border-indigo-500/25 hover:border-cyan-400/40 hover:shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all duration-200 hover:scale-105 active:scale-95"
            title={soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};


