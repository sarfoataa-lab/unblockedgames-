import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
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

function mountRoot() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.warn('Root element #root not found in document yet.');
    return;
  }
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountRoot);
} else {
  mountRoot();
}

