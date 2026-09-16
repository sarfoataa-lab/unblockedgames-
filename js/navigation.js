/**
 * Akwasi Unblocked Games - Navigation Bar Module
 * Main menu links: Home, YouTube, TikTok, Snapchat, Discord, Roblox, Google, Gaming, UNBLOCKER.
 * Clean, safe URL navigation and smooth section scrolling.
 */

export const NAV_LINKS = [
  { id: 'home', label: 'Home', type: 'scroll', target: '#top' },
  { id: 'youtube', label: 'YouTube', type: 'external', url: 'https://www.youtube.com', logo: './assets/logos/youtube.svg' },
  { id: 'tiktok', label: 'TikTok', type: 'external', url: 'https://www.tiktok.com', logo: './assets/logos/tiktok.svg' },
  { id: 'snapchat', label: 'Snapchat', type: 'external', url: 'https://web.snapchat.com', logo: './assets/logos/snapchat.svg' },
  { id: 'discord', label: 'Discord', type: 'external', url: 'https://discord.com', logo: './assets/logos/discord.svg' },
  { id: 'roblox', label: 'Roblox', type: 'external', url: 'https://www.roblox.com', logo: './assets/logos/roblox.svg' },
  { id: 'google', label: 'Google', type: 'external', url: 'https://www.google.com', logo: './assets/logos/google.svg' },
  { id: 'gaming', label: 'Gaming', type: 'scroll', target: '#gaming-section', badge: '6 HITS' },
  { id: 'unblocker', label: 'UNBLOCKER', type: 'scroll', target: '#unblocker-portal', badge: 'PORTAL' }
];

export function initNavigation() {
  try {
    // Top nav bar items click listeners
    const navButtons = document.querySelectorAll('[data-nav-id]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const navId = btn.getAttribute('data-nav-id');
        const item = NAV_LINKS.find(l => l.id === navId);
        if (!item) return;

        if (item.type === 'scroll' && item.target) {
          e.preventDefault();
          const targetEl = document.querySelector(item.target);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
            
            // If it's the UNBLOCKER portal, highlight or focus input
            if (item.id === 'unblocker') {
              const portalInput = document.querySelector('#portal-url-input');
              if (portalInput && portalInput.focus) {
                setTimeout(() => portalInput.focus(), 400);
              }
            }
          }
        } else if (item.type === 'external' && item.url) {
          // Open normal external website in a new tab
          window.open(item.url, '_blank', 'noopener,noreferrer');
        }
      });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
    const mobileMenuDrawer = document.querySelector('#mobile-menu-drawer');
    if (mobileMenuBtn && mobileMenuDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenuDrawer.classList.toggle('open');
      });

      // Close mobile drawer when any link clicked
      const drawerLinks = mobileMenuDrawer.querySelectorAll('a, button');
      drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenuDrawer.classList.remove('open');
        });
      });
    }

    // Initialize UNBLOCKER web search / web portal form
    const portalForm = document.querySelector('#unblocker-portal-form');
    const portalInput = document.querySelector('#portal-url-input');
    if (portalForm && portalInput) {
      portalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = portalInput.value ? portalInput.value.trim() : '';
        if (!value) return;

        let targetUrl = value;
        if (/^(https?:\/\/|[a-z0-9-]+\.[a-z]{2,})/i.test(targetUrl)) {
          if (!/^https?:\/\//i.test(targetUrl)) {
            targetUrl = `https://${targetUrl}`;
          }
        } else {
          targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}`;
        }

        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      });
    }

  } catch (err) {
    console.error('Error initializing navigation module:', err);
  }
}
