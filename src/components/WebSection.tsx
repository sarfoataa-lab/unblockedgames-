import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Plus,
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Compass,
  Sparkles,
  Info,
  Youtube,
  MessageSquare,
  BookOpen,
  Video,
  Radio,
  Code,
  Ghost,
  Boxes,
  Bookmark,
  Trash2,
  BookmarkPlus
} from 'lucide-react';
import { WebTab, QuickAccessSite } from '../types';
import { QUICK_ACCESS_SITES, SEARCH_ENGINES, NAV_MENU_ITEMS } from '../data/quickWebSites';
import { sound } from '../utils/audio';
import {
  resolveWebTarget,
  launchWebDestination,
  getSavedBookmarks,
  saveBookmarks,
  getRecentSearches,
  saveRecentSearch
} from '../utils/portal.js';

interface WebSectionProps {
  incomingSite?: { url: string; name: string; timestamp: number } | null;
  onBackToGames?: () => void;
  activeUrl?: string;
  onUrlChange?: (url: string) => void;
}

const INITIAL_TABS: WebTab[] = [
  {
    id: 'tab-home',
    title: 'Portal Home & Search',
    url: '',
    isHome: true
  }
];

export const WebSection: React.FC<WebSectionProps> = ({
  incomingSite,
  onBackToGames,
  activeUrl,
  onUrlChange
}) => {
  const [tabs, setTabs] = useState<WebTab[]>(INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useState<string>('tab-home');
  const [urlInput, setUrlInput] = useState<string>('');
  const [googleQuery, setGoogleQuery] = useState<string>('');
  const [selectedEngine, setSelectedEngine] = useState<string>('google');
  const [copied, setCopied] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [bookmarks, setBookmarks] = useState<Array<{ id: string; name: string; url: string }>>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showAddBookmark, setShowAddBookmark] = useState<boolean>(false);
  const [newBookmarkName, setNewBookmarkName] = useState<string>('');
  const [newBookmarkUrl, setNewBookmarkUrl] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Load bookmarks & recent searches via JavaScript portal utils
  useEffect(() => {
    setBookmarks(getSavedBookmarks());
    setRecentSearches(getRecentSearches());
  }, []);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0] || INITIAL_TABS[0];

  // Notify parent of active URL changes
  useEffect(() => {
    if (onUrlChange) {
      onUrlChange(activeTab.url || '');
    }
  }, [activeTab.url, onUrlChange]);

  const handleGoHome = () => {
    sound.playClick();
    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId) {
        return {
          ...tab,
          url: '',
          title: 'Portal Home & Search',
          isHome: true
        };
      }
      return tab;
    }));
    setUrlInput('');
  };

  const handleNavigateTo = (targetUrl: string, titleName?: string) => {
    sound.playClick();
    const resolved = resolveWebTarget(targetUrl);
    const finalUrl = resolved.url;
    const finalTitle = titleName || resolved.title;

    if (resolved.isSearch && resolved.query) {
      saveRecentSearch(resolved.query);
      setRecentSearches(getRecentSearches());
    }

    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId) {
        return {
          ...tab,
          url: finalUrl,
          title: finalTitle,
          isHome: false
        };
      }
      return tab;
    }));

    setUrlInput(finalUrl);
    setIframeKey(k => k + 1);
  };

  // Handle incoming site clicks from Navbar menu
  useEffect(() => {
    if (incomingSite) {
      if (incomingSite.url) {
        handleNavigateTo(incomingSite.url, incomingSite.name);
      } else {
        handleGoHome();
      }
    }
  }, [incomingSite]);

  const handleOmniboxSubmit = (e: React.FormEvent, forceGoogleSearch = false) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (forceGoogleSearch) {
      const searchTarget = `https://www.google.com/search?q=${encodeURIComponent(urlInput.trim())}`;
      handleNavigateTo(searchTarget, `Google: "${urlInput.trim()}"`);
    } else {
      handleNavigateTo(urlInput);
    }
  };

  const handleGoogleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleQuery.trim()) return;

    sound.playClick();
    saveRecentSearch(googleQuery.trim());
    setRecentSearches(getRecentSearches());

    const engine = SEARCH_ENGINES.find(s => s.id === selectedEngine) || SEARCH_ENGINES[0];
    const fullUrl = `${engine.urlTemplate}${encodeURIComponent(googleQuery.trim())}`;
    
    handleNavigateTo(fullUrl, `${engine.name}: "${googleQuery.trim()}"`);
    setGoogleQuery('');
  };

  const handleQuickSiteClick = (site: QuickAccessSite, directLaunch = false) => {
    sound.playClick();
    if (directLaunch) {
      launchWebDestination(site.url, true);
      return;
    }
    handleNavigateTo(site.url, site.name);
  };

  const handleOpenNewTab = (defaultUrl = '', defaultTitle = 'Portal Home & Search') => {
    sound.playClick();
    const newId = `tab-${Date.now()}`;
    const newTab: WebTab = {
      id: newId,
      title: defaultTitle,
      url: defaultUrl,
      isHome: !defaultUrl
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
    setUrlInput(defaultUrl);
  };

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();

    if (tabs.length === 1) {
      setTabs([{ id: 'tab-home', title: 'Portal Home & Search', url: '', isHome: true }]);
      setActiveTabId('tab-home');
      setUrlInput('');
      return;
    }

    const filtered = tabs.filter(t => t.id !== tabId);
    setTabs(filtered);

    if (activeTabId === tabId) {
      const nextTab = filtered[filtered.length - 1];
      setActiveTabId(nextTab.id);
      setUrlInput(nextTab.url);
    }
  };

  const handleRefresh = () => {
    sound.playClick();
    setIframeKey(k => k + 1);
  };

  const handleCopyUrl = () => {
    const toCopy = activeTab.url || window.location.href;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(toCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          // Fallback if clipboard permission denied
        });
    }
  };

  const handleAddBookmarkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookmarkName.trim() || !newBookmarkUrl.trim()) return;

    sound.playClick();
    const resolved = resolveWebTarget(newBookmarkUrl);
    const newEntry = {
      id: `bm-${Date.now()}`,
      name: newBookmarkName.trim(),
      url: resolved.url
    };

    const updated = [newEntry, ...bookmarks];
    setBookmarks(updated);
    saveBookmarks(updated);
    setNewBookmarkName('');
    setNewBookmarkUrl('');
    setShowAddBookmark(false);
  };

  const handleDeleteBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    saveBookmarks(updated);
  };

  const getSiteIcon = (key: string) => {
    switch (key) {
      case 'google':
        return <Search className="w-5 h-5 text-[#4285F4]" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-[#FF0000]" />;
      case 'tiktok':
        return <Video className="w-5 h-5 text-[#00F2FE]" />;
      case 'snapchat':
        return <Ghost className="w-5 h-5 text-[#FFFC00]" />;
      case 'discord':
        return <MessageSquare className="w-5 h-5 text-[#5865F2]" />;
      case 'roblox':
        return <Boxes className="w-5 h-5 text-[#E2231A]" />;
      case 'reddit':
        return <MessageSquare className="w-5 h-5 text-[#FF4500]" />;
      case 'wikipedia':
        return <BookOpen className="w-5 h-5 text-slate-200" />;
      case 'twitch':
        return <Radio className="w-5 h-5 text-[#9146FF]" />;
      case 'github':
        return <Code className="w-5 h-5 text-[#10B981]" />;
      default:
        return <Globe className="w-5 h-5 text-cyan-400" />;
    }
  };

  const filteredSites = QUICK_ACCESS_SITES.filter(site => {
    if (categoryFilter === 'all') return true;
    return site.category === categoryFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner / Browser Window Frame */}
      <div className="bg-[#090d18] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* 1. Browser Tabs Bar */}
        <div className="bg-[#070b14] border-b border-slate-800/80 px-2 pt-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTabId(tab.id);
                  setUrlInput(tab.url);
                }}
                className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-t-xl text-xs font-medium cursor-pointer transition-all border-t border-x select-none max-w-[220px] min-w-[130px] ${
                  isActive
                    ? 'bg-[#0f1526] text-white border-slate-700/80 shadow-md font-semibold'
                    : 'bg-[#0a0f1c]/60 text-slate-400 hover:bg-[#0c1222] hover:text-slate-200 border-transparent'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500" />
                )}

                <Globe className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="truncate flex-1 text-left font-gaming">
                  {tab.title || 'New Tab'}
                </span>

                <button
                  type="button"
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                  title="Close tab"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          {/* New Tab Button */}
          <button
            type="button"
            onClick={() => handleOpenNewTab()}
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors ml-1"
            title="Open new tab"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Navigation & Website Address Bar */}
        <div className="bg-[#0f1526] p-2.5 sm:p-3 border-b border-slate-800 flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleGoHome}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Portal Home & Search"
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Refresh frame"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Search/Address Input Form */}
          <form
            onSubmit={(e) => handleOmniboxSubmit(e, false)}
            className="flex-1 min-w-[260px] relative flex items-center"
          >
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1.5" />
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">https://</span>
            </div>

            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Search Google or enter a website (e.g. roblox.com, discord.com, youtube.com)..."
              className="w-full bg-[#080d1a] text-slate-100 text-xs sm:text-sm pl-8 sm:pl-24 pr-36 py-2 sm:py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-hidden focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
            />

            {/* In-bar actions */}
            <div className="absolute right-1.5 flex items-center gap-1">
              {urlInput && (
                <button
                  type="button"
                  onClick={() => setUrlInput('')}
                  className="p-1 rounded text-slate-500 hover:text-slate-300 mr-1"
                  title="Clear input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => handleOmniboxSubmit(e, true)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-gaming text-[11px] font-semibold rounded-lg border border-slate-700 hidden sm:inline-flex items-center gap-1"
                title="Search on Google"
              >
                <Search className="w-3 h-3" />
                Google
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-gaming font-bold text-xs rounded-lg transition-all flex items-center gap-1 shadow-sm"
              >
                <span>GO</span>
              </button>
            </div>
          </form>

          {/* Secondary Actions */}
          <div className="flex items-center gap-1.5">
            {activeTab.url && (
              <>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => launchWebDestination(activeTab.url, true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-gaming font-bold text-xs transition-all shadow-md"
                  title="Open site directly in new window"
                >
                  <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Launch Website</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 3. Viewport */}
        <div className="min-h-[580px] bg-[#070a14] flex flex-col">
          {activeTab.isHome || !activeTab.url ? (
            /* Simple Web Portal Homepage */
            <div className="p-5 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
              {/* Google Search Section */}
              <div className="text-center space-y-4 max-w-2xl mx-auto pt-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-gaming font-bold tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  WEB PORTAL & SEARCH
                </div>

                {/* Google Logo Brand */}
                <div className="flex items-center justify-center gap-1 font-gaming text-3xl sm:text-4xl font-extrabold tracking-tight select-none">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                  <span className="text-white ml-2 text-2xl sm:text-3xl font-bold">Search</span>
                </div>

                {/* Google Search Form */}
                <form onSubmit={handleGoogleSearchSubmit} className="relative mt-3">
                  <div className="flex items-center bg-[#0d1424] border-2 border-slate-700 hover:border-cyan-500/80 focus-within:border-cyan-500 rounded-2xl shadow-xl transition-all p-1.5">
                    <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                    <input
                      type="text"
                      value={googleQuery}
                      onChange={(e) => setGoogleQuery(e.target.value)}
                      placeholder="Search Google or enter a website address..."
                      className="w-full bg-transparent px-3 py-2.5 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-hidden font-sans"
                    />
                    {googleQuery && (
                      <button
                        type="button"
                        onClick={() => setGoogleQuery('')}
                        className="p-1.5 text-slate-500 hover:text-slate-300 mr-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-gaming font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all shrink-0"
                    >
                      SEARCH
                    </button>
                  </div>

                  {/* Engine switcher chips */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
                    <span className="text-slate-500">Search with:</span>
                    {SEARCH_ENGINES.map((engine) => (
                      <button
                        key={engine.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setSelectedEngine(engine.id);
                        }}
                        className={`px-3 py-1 rounded-lg border transition-all ${
                          selectedEngine === engine.id
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-semibold'
                            : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        {engine.name}
                      </button>
                    ))}
                  </div>

                  {/* Recent search chips */}
                  {recentSearches.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2 text-xs text-slate-400">
                      <span className="text-slate-500">Recent:</span>
                      {recentSearches.slice(0, 5).map((query, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setGoogleQuery(query);
                            handleNavigateTo(`https://www.google.com/search?q=${encodeURIComponent(query)}`, `Google: "${query}"`);
                          }}
                          className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors text-[11px]"
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  )}
                </form>
              </div>

              {/* Primary Popular Websites Quick Access Grid */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-cyan-400" />
                    <h2 className="font-gaming text-lg sm:text-xl font-bold text-white tracking-wide">
                      POPULAR WEBSITES
                    </h2>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1 text-xs">
                    {[
                      { id: 'all', label: 'All Sites' },
                      { id: 'social', label: 'Social & Chat' },
                      { id: 'media', label: 'Video & Media' },
                      { id: 'gaming', label: 'Gaming' },
                      { id: 'search', label: 'Search' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setCategoryFilter(cat.id);
                        }}
                        className={`px-2.5 py-1 rounded-lg transition-all ${
                          categoryFilter === cat.id
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSites.map((site) => (
                    <div
                      key={site.id}
                      className="group bg-[#0d1322] border border-slate-800 hover:border-slate-700 hover:bg-[#10182b] rounded-2xl p-4 transition-all duration-200 shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
                            style={{ backgroundColor: `${site.accentColor}18`, border: `1px solid ${site.accentColor}40` }}
                          >
                            {getSiteIcon(site.iconKey)}
                          </div>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60">
                            {site.category}
                          </span>
                        </div>

                        <h3 className="font-gaming text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                          <span>{site.name}</span>
                          <span className="text-[11px] font-mono font-normal text-slate-500">{site.domain}</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                          {site.description}
                        </p>
                      </div>

                      {/* Card Action Controls */}
                      <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuickSiteClick(site, false)}
                          className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-gaming font-semibold transition-colors text-center"
                          title={`Open ${site.name} in tab`}
                        >
                          Open in Tab
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickSiteClick(site, true)}
                          className="flex items-center gap-1 py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-gaming font-bold transition-all shadow-sm"
                          title={`Launch ${site.name} directly in new window`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Visit</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Custom Bookmarks Section */}
              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-gaming text-base font-bold text-white tracking-wide">
                      YOUR BOOKMARKS & SHORTCUTS
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddBookmark(!showAddBookmark)}
                    className="flex items-center gap-1 text-xs font-gaming font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>{showAddBookmark ? 'Cancel' : '+ Add Shortcut'}</span>
                  </button>
                </div>

                {/* Add Bookmark form */}
                {showAddBookmark && (
                  <form onSubmit={handleAddBookmarkSubmit} className="p-3 bg-[#0c1220] rounded-xl border border-slate-700 flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={newBookmarkName}
                      onChange={(e) => setNewBookmarkName(e.target.value)}
                      placeholder="Site Name (e.g. My School, Spotify)..."
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-cyan-500 flex-1 min-w-[140px]"
                      required
                    />
                    <input
                      type="text"
                      value={newBookmarkUrl}
                      onChange={(e) => setNewBookmarkUrl(e.target.value)}
                      placeholder="URL (e.g. spotify.com)..."
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-cyan-500 flex-1 min-w-[180px]"
                      required
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-gaming font-bold text-xs rounded-lg transition-colors"
                    >
                      Save Shortcut
                    </button>
                  </form>
                )}

                {/* Bookmarks list */}
                {bookmarks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {bookmarks.map((bm) => (
                      <div
                        key={bm.id}
                        onClick={() => handleNavigateTo(bm.url, bm.name)}
                        className="group flex items-center justify-between p-2.5 rounded-xl bg-[#0b101c] border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span className="text-xs text-white font-medium truncate group-hover:text-cyan-300">
                            {bm.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteBookmark(bm.id, e)}
                          className="p-1 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete shortcut"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    No custom shortcuts saved yet. Click &quot;+ Add Shortcut&quot; to bookmark any website to your portal.
                  </p>
                )}
              </div>

              {/* HTML5 Games Link banner */}
              {onBackToGames && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#0e172a] to-[#0a1222] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-gaming text-lg shrink-0">
                      🕹️
                    </div>
                    <div>
                      <h4 className="font-gaming text-sm font-bold text-white">Looking for Unblocked Games?</h4>
                      <p className="text-xs text-slate-400">Play Snake 97, 2048, Retro Tetris, Space Asteroids, Arcade Pong, Flappy Bird, and more.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onBackToGames}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-gaming font-bold transition-all shadow-sm shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <span>Browse Games Catalog</span>
                    <span>🎮</span>
                  </button>
                </div>
              )}

              {/* Informational Guidance */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-300 mb-0.5">
                    Simple & Clean Web Portal
                  </p>
                  <p className="leading-relaxed">
                    Search Google or enter any address in the bar above. Use the direct &quot;Visit&quot; or &quot;Launch Website&quot; buttons at any time to open popular websites directly in full speed.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Active Website Viewer */
            <div className="flex-1 flex flex-col h-full min-h-[600px]">
              {/* Active Site Banner */}
              <div className="bg-[#0b101c] px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 truncate max-w-xl">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-400">Navigated to:</span>
                  <span className="font-mono text-cyan-300 truncate">{activeTab.url}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => launchWebDestination(activeTab.url, true)}
                    className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-gaming font-bold hover:bg-emerald-400 transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5 stroke-[2.4]" />
                    <span>LAUNCH DIRECT LINK</span>
                  </button>
                </div>
              </div>

              {/* Frame Policy Notice */}
              <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>
                    Many external websites (such as YouTube, TikTok, Discord, Roblox, or Google) enforce browser frame restrictions (X-Frame-Options: SAMEORIGIN). If the window below is blank, click <strong>Launch Direct Link</strong> to open the full website directly.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGoHome}
                  className="text-cyan-400 hover:underline shrink-0 font-medium"
                >
                  Return to Portal Home
                </button>
              </div>

              {/* Embedded Frame */}
              <div className="relative flex-1 w-full min-h-[540px] bg-[#05070e]">
                <iframe
                  key={iframeKey}
                  src={activeTab.url}
                  title={activeTab.title}
                  className="w-full h-full border-0 absolute inset-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                />

                {/* Direct Action Overlay Card */}
                <div className="pointer-events-none absolute bottom-4 right-4 z-20">
                  <div className="pointer-events-auto bg-[#0d1322]/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl flex items-center gap-3">
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-white font-gaming">Site blocked by security headers?</p>
                      <p className="text-[10px] text-slate-400">Launch in an unconstrained tab</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => launchWebDestination(activeTab.url, true)}
                      className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-gaming font-bold text-xs rounded-lg transition-all flex items-center gap-1 shadow-md"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Launch</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
