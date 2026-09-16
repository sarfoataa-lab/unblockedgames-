import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  EyeOff,
  Globe,
  ExternalLink,
  Search,
  Sparkles,
  Zap,
  Lock,
  Layers,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import {
  CLOAK_PRESETS,
  CloakPreset,
  applyTabCloak,
  openAboutBlankCloak,
  launchDirectSafe
} from '../utils/proxyLauncher';
import { sound } from '../utils/audio';
import {
  YouTubeLogo,
  TikTokLogo,
  SnapchatLogo,
  DiscordLogo,
  RobloxLogo,
  GoogleLogo,
  PokiLogo
} from './BrandLogos';

interface UnblockerSectionProps {
  onOpenInPortal?: (url: string, name: string) => void;
}

export const UnblockerSection: React.FC<UnblockerSectionProps> = ({ onOpenInPortal }) => {
  const [proxyUrl, setProxyUrl] = useState('');
  const [activeCloakId, setActiveCloakId] = useState<string>('default');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSelectCloak = (preset: CloakPreset) => {
    sound.playClick();
    setActiveCloakId(preset.id);
    applyTabCloak(preset);
    setStatusMessage(`Tab cloaked as "${preset.name}". Title and favicon updated!`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleUnblockSubmit = (e: React.FormEvent, mode: 'cloak' | 'direct' | 'portal') => {
    e.preventDefault();
    if (!proxyUrl.trim()) return;

    sound.playClick();
    let target = proxyUrl.trim();
    if (!/^https?:\/\//i.test(target)) {
      if (target.includes('.') && !target.includes(' ')) {
        target = `https://${target}`;
      } else {
        target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
      }
    }

    if (mode === 'cloak') {
      setStatusMessage(`Launching ${target} in stealth about:blank cloak...`);
      openAboutBlankCloak(target, 'Google Classroom');
    } else if (mode === 'portal' && onOpenInPortal) {
      setStatusMessage(`Loading ${target} in Web Portal...`);
      onOpenInPortal(target, 'Unblocked Site');
    } else {
      setStatusMessage(`Opening ${target} direct...`);
      launchDirectSafe(target);
    }
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const QUICK_UNBLOCK_TARGETS = [
    { name: 'YouTube', url: 'https://www.youtube.com', icon: <YouTubeLogo className="w-5 h-5" />, color: '#FF0000' },
    { name: 'TikTok', url: 'https://www.tiktok.com', icon: <TikTokLogo className="w-5 h-5" />, color: '#00F2FE' },
    { name: 'Snapchat', url: 'https://web.snapchat.com', icon: <SnapchatLogo className="w-5 h-5" />, color: '#FFFC00' },
    { name: 'Discord', url: 'https://discord.com', icon: <DiscordLogo className="w-5 h-5" />, color: '#5865F2' },
    { name: 'Roblox', url: 'https://www.roblox.com', icon: <RobloxLogo className="w-5 h-5" fill="#FFFFFF" />, color: '#E2231A' },
    { name: 'Google', url: 'https://www.google.com', icon: <GoogleLogo className="w-5 h-5" />, color: '#4285F4' },
    { name: 'Poki Games', url: 'https://poki.com', icon: <PokiLogo className="w-5 h-5" />, color: '#00D2B4' }
  ];

  return (
    <section id="unblocker-section" className="space-y-6 pt-2">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl galaxy-glass border border-emerald-500/30 p-6 sm:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.6)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 animate-nebula-slow" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16 animate-nebula-reverse" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-gaming font-semibold shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            STEALTH UNBLOCKER & TAB CLOAKER SUITE
          </div>

          <h2 className="font-gaming text-2xl sm:text-4xl font-extrabold text-white tracking-wide leading-tight">
            Proxy &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-teal-200 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              Network Cloaking Hub
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Disguise browser tabs to avoid teacher monitoring, launch websites in stealth <code>about:blank</code> windows that leave zero browser history, and unblock popular online services seamlessly.
          </p>
        </div>

        {/* Live Status notification */}
        {statusMessage && (
          <div className="relative z-10 mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-gaming flex items-center gap-2 animate-fade-in shadow-[0_0_16px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* 1. Fast URL Unblocker Omnibar */}
      <div className="galaxy-glass rounded-2xl p-5 border border-indigo-500/25 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="font-gaming text-base font-bold text-white tracking-wide">
              DIRECT URL PROXY & UNBLOCK LAUNCHER
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            Stealth Ready
          </span>
        </div>

        <form onSubmit={(e) => handleUnblockSubmit(e, 'cloak')} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={proxyUrl}
                onChange={(e) => setProxyUrl(e.target.value)}
                placeholder="Enter any URL (e.g. poki.com, soccerbros.com, discord.com)..."
                className="w-full bg-[#070b18] text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-700/80 focus:border-cyan-400 focus:outline-hidden focus:ring-1 focus:ring-cyan-400/50 font-mono transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-gaming font-bold text-xs rounded-xl shadow-[0_0_18px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-1.5 shrink-0"
                title="Launch stealth about:blank cloak"
              >
                <EyeOff className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>STEALTH CLOAK</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleUnblockSubmit(e, 'direct')}
                className="flex-1 sm:flex-none px-4 py-3 bg-white/[0.06] hover:bg-white/[0.12] text-white font-gaming font-bold text-xs rounded-xl border border-white/10 hover:border-cyan-400/40 transition-all flex items-center justify-center gap-1.5 shrink-0"
                title="Open directly in a new window"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>DIRECT</span>
              </button>
            </div>
          </div>
        </form>

        {/* Quick Launch Chips */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-gaming text-slate-400 mr-1">Quick Unblock:</span>
          {QUICK_UNBLOCK_TARGETS.map(item => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                sound.playClick();
                setProxyUrl(item.url);
                openAboutBlankCloak(item.url, `${item.name} – Classroom`);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#080d1e] hover:bg-[#0f1730] border border-slate-800 hover:border-cyan-400/40 text-slate-200 text-xs font-gaming flex items-center gap-1.5 transition-all hover:scale-105"
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Live Tab Cloaker & Disguise Selector */}
      <div className="galaxy-glass rounded-2xl p-5 border border-indigo-500/25 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-purple-400" />
              <h3 className="font-gaming text-base font-bold text-white tracking-wide">
                TAB CLOAKER & DISGUISE SELECTOR
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Change the browser tab title and icon instantly to disguise your activity from teachers or administrators.
            </p>
          </div>
          <span className="text-[11px] font-gaming text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30 shrink-0 self-start sm:self-auto">
            ✓ One-Click Disguise
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CLOAK_PRESETS.map((preset) => {
            const isSelected = activeCloakId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectCloak(preset)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all duration-200 hover:scale-105 ${
                  isSelected
                    ? 'bg-indigo-950/80 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.35)]'
                    : 'bg-white/[0.03] border-white/10 hover:border-indigo-400/40 hover:bg-white/[0.07]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <img
                    src={preset.favicon}
                    alt={preset.name}
                    className="w-5 h-5 object-contain rounded"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>
                <div>
                  <p className="font-gaming text-xs font-bold text-white truncate">
                    {preset.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5 font-sans">
                    {preset.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Stealth Guide */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-gaming font-semibold text-slate-200 mb-0.5">
            How Stealth Unblocking Works:
          </p>
          <p className="leading-relaxed">
            1. <strong>About:Blank Cloak:</strong> Opens games inside a sandboxed about:blank document, which prevents network URL logging and keeps the school browser history clean.
            <br />
            2. <strong>Tab Disguise:</strong> Replaces this page’s title and favicon with authentic Google Classroom, Docs, or Canvas tags so passersby only see study materials.
          </p>
        </div>
      </div>
    </section>
  );
};
