import React from 'react';
import {
  Youtube,
  Video,
  Ghost,
  MessageSquare,
  Boxes,
  Search,
  Globe,
  Home,
  Volume2,
  VolumeX,
  ExternalLink
} from 'lucide-react';
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
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const NAV_SITES: NavSite[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com',
    icon: <Youtube className="w-4 h-4 text-[#FF0000]" />,
    color: '#FF0000'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com',
    icon: <Video className="w-4 h-4 text-[#00F2FE]" />,
    color: '#00F2FE'
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    url: 'https://web.snapchat.com',
    icon: <Ghost className="w-4 h-4 text-[#FFFC00]" />,
    color: '#FFFC00'
  },
  {
    id: 'discord',
    name: 'Discord',
    url: 'https://discord.com',
    icon: <MessageSquare className="w-4 h-4 text-[#5865F2]" />,
    color: '#5865F2'
  },
  {
    id: 'roblox',
    name: 'Roblox',
    url: 'https://www.roblox.com',
    icon: <Boxes className="w-4 h-4 text-[#E2231A]" />,
    color: '#E2231A'
  },
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com',
    icon: <Search className="w-4 h-4 text-[#4285F4]" />,
    color: '#4285F4'
  }
];

export const Navbar: React.FC<NavbarProps> = ({
  onSelectSite,
  activeUrl = '',
  onGoHome,
  soundEnabled,
  onToggleSound
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b101d]/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden shrink-0"
          title="Return to Portal Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all">
            <Globe className="w-5 h-5 stroke-[2.4]" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-gaming text-base sm:text-lg font-bold tracking-wide text-white group-hover:text-cyan-400 transition-colors">
                Akwasi Unblocked Games
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-gaming bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5">
              Simple Web Portal & Popular Websites
            </p>
          </div>
        </button>

        {/* Replaced Games menu item with: YouTube, TikTok, Snapchat, Discord, Roblox, Google */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 px-1.5 bg-[#070b16] rounded-xl border border-slate-800/80 scrollbar-none max-w-full">
          {/* Home portal button */}
          <button
            type="button"
            onClick={onGoHome}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-gaming font-semibold transition-all shrink-0 ${
              !activeUrl
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Portal Home & Search"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Home</span>
          </button>

          {/* 6 Popular Website Menu Items */}
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
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-gaming font-semibold transition-all shrink-0 border ${
                  isActive
                    ? 'bg-slate-800 text-white border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/70 border-transparent'
                }`}
                title={`Access ${site.name}`}
              >
                {site.icon}
                <span className="text-[11px] sm:text-xs">{site.name}</span>
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
            className="p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
            title={soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};


