/**
 * Akwasi Unblocked Games - Websites & Games Catalog Module
 * Official brand links with local SVG assets and safe opening handlers.
 */

export const WEBSITES_LIST = [
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'social',
    url: 'https://www.youtube.com',
    description: 'Watch millions of gaming videos, live streams, game trailers, and tutorials.',
    logo: './assets/logos/youtube.svg',
    badge: 'VIDEO & MUSIC',
    badgeColor: '#EF4444',
    rating: '4.9'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'social',
    url: 'https://www.tiktok.com',
    description: 'Trending short-form video clips, viral gaming edits, and creator content.',
    logo: './assets/logos/tiktok.svg',
    badge: 'VIRAL HUB',
    badgeColor: '#00F2FE',
    rating: '4.8'
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    category: 'social',
    url: 'https://web.snapchat.com',
    description: 'Connect with friends, chat, view stories, and share gaming highlights on Web.',
    logo: './assets/logos/snapchat.svg',
    badge: 'COMMUNITY',
    badgeColor: '#EAB308',
    rating: '4.7'
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'social',
    url: 'https://discord.com',
    description: 'Chat, hang out, and voice call with teammates and gaming communities.',
    logo: './assets/logos/discord.svg',
    badge: 'VOICE & CHAT',
    badgeColor: '#6366F1',
    rating: '4.9'
  },
  {
    id: 'roblox',
    name: 'Roblox',
    category: 'games',
    url: 'https://www.roblox.com',
    description: 'Explore millions of immersive 3D user-created experiences and multiplayer games.',
    logo: './assets/logos/roblox.svg',
    badge: 'ONLINE WORLDS',
    badgeColor: '#38BDF8',
    rating: '4.9'
  },
  {
    id: 'google',
    name: 'Google',
    category: 'utility',
    url: 'https://www.google.com',
    description: 'Fast, secure web search to explore websites, game wikis, articles, and answers.',
    logo: './assets/logos/google.svg',
    badge: 'SEARCH ENGINE',
    badgeColor: '#10B981',
    rating: '5.0'
  },
  {
    id: 'retro-bowl',
    name: 'Retro Bowl',
    category: 'games',
    url: 'https://retrobowl.me',
    description: 'The smash-hit 8-bit retro football simulator. Manage your roster and win the ring!',
    logo: './assets/logos/footballbros.svg',
    badge: 'SPORTS HIT',
    badgeColor: '#F97316',
    rating: '4.9'
  },
  {
    id: 'subway-surfers',
    name: 'Subway Surfers',
    category: 'games',
    url: 'https://poki.com/en/g/subway-surfers',
    description: 'Dodge trains, escape the grumpy inspector, and surf through world cities.',
    logo: './assets/logos/poki.svg',
    badge: 'ENDLESS RUNNER',
    badgeColor: '#00D2B4',
    rating: '4.9'
  },
  {
    id: '1v1-lol',
    name: '1v1.LOL',
    category: 'games',
    url: 'https://1v1.lol',
    description: 'Competitive 3D third-person building and shooting battle royale simulator.',
    logo: './assets/logos/2v2io.svg',
    badge: 'BATTLE ROYALE',
    badgeColor: '#818CF8',
    rating: '4.8'
  },
  {
    id: 'slope',
    name: 'Slope Game',
    category: 'games',
    url: 'https://slopegame.online',
    description: 'High-speed neon rolling ball downhill survival game with endless velocity.',
    logo: './assets/logos/ozgames.svg',
    badge: '3D VELOCITY',
    badgeColor: '#34D399',
    rating: '4.8'
  },
  {
    id: 'basket-bros',
    name: 'Basket Bros',
    category: 'games',
    url: 'https://basketbros.io',
    description: 'High flying slam dunks, alley-oops, and comical 1v1 arcade basketball.',
    logo: './assets/logos/soccerbros.svg',
    badge: 'BROS ARCADE',
    badgeColor: '#F59E0B',
    rating: '4.8'
  },
  {
    id: 'smash-karts',
    name: 'Smash Karts',
    category: 'games',
    url: 'https://smashkarts.io',
    description: 'Multiplayer 3D kart battle arena. Pick up rockets, bombs, and smash your rivals!',
    logo: './assets/logos/wrestlebros.svg',
    badge: 'KART BATTLE',
    badgeColor: '#EC4899',
    rating: '4.8'
  }
];

export function getWebsites() {
  return WEBSITES_LIST;
}

export function openWebsite(url) {
  if (typeof window === 'undefined') return;
  try {
    const newTab = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newTab) {
      window.location.href = url;
    }
  } catch (err) {
    console.warn('Direct navigation fallback:', err);
    window.location.href = url;
  }
}

export function renderWebsites(items) {
  const list = items || WEBSITES_LIST;
  const container = document.querySelector('#websites-grid');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <p class="empty-state-title">No matching links found</p>
        <p class="empty-state-desc">Try clearing your search or choosing another category</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="web-card galaxy-glass" data-id="${item.id}" data-category="${item.category}">
      <div class="card-glow"></div>
      <div class="web-card-top">
        <div class="web-logo-wrap">
          <img
            src="${item.logo}"
            alt="${item.name} logo"
            class="web-logo-img"
            loading="lazy"
            onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='flex';"
          />
          <div class="web-logo-fallback" style="display:none; background-color: ${item.badgeColor}22; color: ${item.badgeColor};">
            ${item.name.substring(0, 2).toUpperCase()}
          </div>
        </div>
        <div class="web-meta">
          <span class="web-badge" style="border-color: ${item.badgeColor}40; color: ${item.badgeColor}; background: ${item.badgeColor}15;">
            ${item.badge}
          </span>
          <span class="web-rating">★ ${item.rating}</span>
        </div>
      </div>
      
      <div class="web-info">
        <h3 class="web-name">${item.name}</h3>
        <p class="web-desc">${item.description}</p>
      </div>

      <div class="web-card-bottom">
        <a
          href="${item.url}"
          target="_blank"
          rel="noopener noreferrer"
          class="launch-btn"
          data-url="${item.url}"
          title="Open ${item.name} in a new tab"
        >
          <span>OPEN ${item.name.toUpperCase()}</span>
          <svg class="icon-external" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    </div>
  `).join('');
}

export function initWebsites() {
  try {
    renderWebsites();
  } catch (err) {
    console.error('Error in initWebsites:', err);
  }
}
