// portal.js - JavaScript web portal engine and navigation utilities

/**
 * Resolves user input from the omnibox into either a direct URL or a Google Search query.
 * @param {string} input - User typed query or address
 * @returns {{ url: string, isSearch: boolean, query: string, title: string, domain: string }}
 */
export function resolveWebTarget(input) {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return {
      url: '',
      isSearch: false,
      query: '',
      title: 'Web Portal',
      domain: ''
    };
  }

  // Check if it starts with http:// or https://
  const hasProtocol = /^https?:\/\//i.test(trimmed);

  // Check if it resembles a domain name like example.com, roblox.com, etc.
  const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/i;
  const isLikelyDomain = domainRegex.test(trimmed);

  if (hasProtocol) {
    try {
      const parsed = new URL(trimmed);
      const cleanHost = parsed.hostname.replace(/^www\./, '');
      return {
        url: trimmed,
        isSearch: false,
        query: '',
        title: cleanHost,
        domain: cleanHost
      };
    } catch {
      return {
        url: trimmed,
        isSearch: false,
        query: '',
        title: trimmed,
        domain: trimmed
      };
    }
  } else if (isLikelyDomain) {
    const fullUrl = `https://${trimmed}`;
    const domainOnly = trimmed.split('/')[0].replace(/^www\./, '');
    return {
      url: fullUrl,
      isSearch: false,
      query: '',
      title: domainOnly,
      domain: domainOnly
    };
  } else {
    // Treat as search query for Google
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
    return {
      url: searchUrl,
      isSearch: true,
      query: trimmed,
      title: `Google: "${trimmed}"`,
      domain: 'google.com'
    };
  }
}

/**
 * Standard browser launch for popular websites
 * @param {string} url
 * @param {boolean} newWindow
 */
export function launchWebDestination(url, newWindow = true) {
  if (!url || typeof window === 'undefined') return;
  const targetUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  if (newWindow) {
    const win = window.open(targetUrl, '_blank', 'noopener,noreferrer');
    if (!win) {
      window.location.href = targetUrl;
    }
  } else {
    window.location.href = targetUrl;
  }
}

const STORAGE_BOOKMARKS_KEY = 'akwasi_portal_bookmarks';
const STORAGE_HISTORY_KEY = 'akwasi_portal_history';

/**
 * Retrieve user custom saved bookmarks from localStorage
 * @returns {Array<{ id: string, name: string, url: string, date: number }>}
 */
export function getSavedBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Error reading bookmarks from localStorage:', err);
    return [];
  }
}

/**
 * Save user bookmarks to localStorage
 * @param {Array} bookmarks
 */
export function saveBookmarks(bookmarks) {
  try {
    localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (err) {
    console.warn('Error saving bookmarks to localStorage:', err);
  }
}

/**
 * Retrieve recent searches from localStorage
 * @returns {string[]}
 */
export function getRecentSearches() {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : ['Roblox', 'Discord', 'YouTube', 'TikTok'];
  } catch (err) {
    console.warn('Error reading search history:', err);
    return [];
  }
}

/**
 * Add a query to recent search history
 * @param {string} query
 */
export function saveRecentSearch(query) {
  if (!query || !query.trim()) return;
  try {
    const current = getRecentSearches();
    const updated = [query.trim(), ...current.filter(item => item.toLowerCase() !== query.trim().toLowerCase())].slice(0, 8);
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Error writing search history:', err);
  }
}
