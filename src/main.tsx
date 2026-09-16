import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Guard against errors thrown by third-party browser extensions or injected scripts
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const filename = event.filename || '';
    const message = event.message || '';
    if (
      filename.includes('chrome-extension://') ||
      filename.includes('moz-extension://') ||
      filename.includes('content.js') ||
      filename.includes('popup.js') ||
      (message.includes('Cannot set properties of null') && filename.includes('extension'))
    ) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason ? String(event.reason.stack || event.reason.message || event.reason) : '';
    if (
      reason.includes('chrome-extension://') ||
      reason.includes('moz-extension://') ||
      reason.includes('content.js') ||
      reason.includes('popup.js')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

function dismissInitialLoadingScreen() {
  if (typeof window !== 'undefined' && typeof (window as unknown as { dismissLoadingScreen?: () => void }).dismissLoadingScreen === 'function') {
    try {
      (window as unknown as { dismissLoadingScreen: () => void }).dismissLoadingScreen();
    } catch (e) {
      console.warn('Could not dismiss loading screen:', e);
    }
  }
}

let isMounted = false;

function mountRoot() {
  if (isMounted) return;
  
  try {
    let rootElement = document.getElementById('root');
    if (!rootElement) {
      rootElement = document.createElement('div');
      rootElement.id = 'root';
      document.body.appendChild(rootElement);
    }
    
    isMounted = true;
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
  } catch (err) {
    console.error('Fatal mounting error in main.tsx:', err);
  } finally {
    // Dismiss loading screen quickly once React begins rendering
    setTimeout(dismissInitialLoadingScreen, 50);
  }
}

// Guarantee execution whether script runs before or after DOM readiness
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountRoot);
  window.addEventListener('load', mountRoot);
} else {
  mountRoot();
}

// Ultimate safety fallback: never stay unmounted or stuck
setTimeout(mountRoot, 250);
setTimeout(dismissInitialLoadingScreen, 1000);

