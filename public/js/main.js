/**
 * Akwasi Unblocked Games - Main Application Entry Point
 * Explicit browser-compatible ES module imports.
 * One clear entry point: /js/main.js
 */

import { initNavigation } from "./navigation.js";
import { initSearch } from "./search.js";
import { initWebsites } from "./websites.js";
import { initGaming } from "./gaming.js";
import { initBackground } from "./background.js";

/**
 * Dismiss the loading screen cleanly and safely
 */
export function dismissLoadingScreen() {
  try {
    const loader = document.getElementById('loading-screen');
    if (loader && !loader.getAttribute('data-dismissed')) {
      loader.setAttribute('data-dismissed', 'true');
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
      setTimeout(() => {
        if (loader && loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 300);
    }
  } catch (err) {
    console.warn('Loading screen dismissal warning:', err);
  }
}

/**
 * Main initialization process
 * Flow:
 * 1. Website initializes
 * 2. Navigation initializes
 * 3. Search initializes
 * 4. Gaming links initialize
 * 5. Background initializes
 * 6. Loading screen disappears
 */
function initializeApp() {
  try {
    // 1. Website initializes
    initWebsites();
  } catch (e) {
    console.error('Failed to initialize websites catalog:', e);
  }

  try {
    // 2. Navigation initializes
    initNavigation();
  } catch (e) {
    console.error('Failed to initialize navigation:', e);
  }

  try {
    // 3. Search initializes
    initSearch();
  } catch (e) {
    console.error('Failed to initialize search engine:', e);
  }

  try {
    // 4. Gaming links initialize
    initGaming();
  } catch (e) {
    console.error('Failed to initialize gaming section:', e);
  }

  try {
    // 5. Background initializes (never blocking)
    initBackground();
  } catch (e) {
    console.warn('Background animation fallback to CSS galaxy gradient:', e);
  }

  // 6. Loading screen disappears
  setTimeout(dismissLoadingScreen, 60);
}

// Ensure execution whether DOM is already parsed or loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Error fallback: ensure loading screen can NEVER remain visible forever
setTimeout(dismissLoadingScreen, 1200);
