/**
 * Proxy & Unblocker Utility
 * Provides safe direct navigation, tab cloaking (disguise title & favicon),
 * and about:blank stealth window embedding to bypass URL tracking and network inspection.
 */

export interface CloakPreset {
  id: string;
  name: string;
  title: string;
  favicon: string;
}

export const CLOAK_PRESETS: CloakPreset[] = [
  {
    id: 'default',
    name: 'Akwasi Games (Default)',
    title: 'Akwasi Unblocked Games | Fast Web Portal',
    favicon: '/favicon.svg'
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    title: 'Google Docs – Untitled Document',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    title: 'Classes – Google Classroom',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    title: 'My Drive – Google Drive',
    favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard – Canvas LMS',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  },
  {
    id: 'calculator',
    name: 'Desmos / Calculator',
    title: 'Desmos | Scientific Calculator',
    favicon: 'https://www.desmos.com/favicon.ico'
  }
];

/**
 * Apply tab cloak disguise to the active document
 */
export function applyTabCloak(preset: CloakPreset) {
  if (typeof document === 'undefined') return;

  try {
    document.title = preset.title;
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = preset.favicon;
    try {
      localStorage.setItem('akwasi_tab_cloak', preset.id);
    } catch {
      // localStorage may fail in restricted sandboxes
    }
  } catch (e) {
    console.warn('Could not apply tab cloak:', e);
  }
}

/**
 * Open target URL inside an about:blank stealth window.
 * This prevents network browser history inspection and URL bar cloaking.
 */
export function openAboutBlankCloak(url: string, title = 'Google Classroom') {
  if (typeof window === 'undefined') return false;

  try {
    const newWin = window.open('about:blank', '_blank');
    if (!newWin || newWin.closed) {
      // Fallback to direct navigation if popups blocked
      window.open(url, '_blank', 'noopener,noreferrer');
      return false;
    }

    const doc = newWin.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="icon" href="https://ssl.gstatic.com/classroom/favicon.png" type="image/png">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #000;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
          }
        </style>
      </head>
      <body>
        <iframe src="${url}" allowfullscreen sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"></iframe>
      </body>
      </html>
    `);
    doc.close();
    return true;
  } catch (e) {
    console.warn('about:blank cloaking failed, falling back to direct tab:', e);
    window.open(url, '_blank', 'noopener,noreferrer');
    return false;
  }
}

/**
 * Direct launch with modern security flags and fallback
 */
export function launchDirectSafe(url: string) {
  if (typeof window === 'undefined') return;
  try {
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) {
      window.location.href = url;
    }
  } catch {
    window.location.href = url;
  }
}
