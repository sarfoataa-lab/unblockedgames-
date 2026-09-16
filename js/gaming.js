/**
 * Akwasi Unblocked Games - Gaming Section Module
 * Direct links to Poki, Soccer Bros, Football Bros, Wrestle Bros, 2v2.io, and OZ Games.
 * Opens legitimate third-party websites normally without proxying or disguised traffic.
 */

export const GAMING_SITES = [
  {
    id: 'poki',
    name: 'Poki',
    domain: 'poki.com',
    url: 'https://poki.com/',
    genre: 'Web Games Hub',
    badge: 'TOP GAMES HUB',
    accentColor: '#00D2B4',
    logo: './assets/logos/poki.svg',
    rating: '4.9',
    players: '50M+ Players',
    description: 'Play thousands of top free online games including Subway Surfers, Stickman Hook, and Retro Bowl with no downloads required.'
  },
  {
    id: 'soccer-bros',
    name: 'Soccer Bros',
    domain: 'soccerbros.com',
    url: 'https://soccerbros.com/',
    genre: 'Sports & PvP',
    badge: '1v1 & 2v2 SOCCER',
    accentColor: '#10B981',
    logo: './assets/logos/soccerbros.svg',
    rating: '4.8',
    players: '2.5M+ Plays',
    description: 'Fast-paced multiplayer arcade soccer action from the creators of Basket Bros. Pick your pro bro, score crazy bicycle kicks, and dominate.'
  },
  {
    id: 'football-bros',
    name: 'Football Bros',
    domain: 'footballbros.com',
    url: 'https://footballbros.com/',
    genre: 'Sports & Arcade',
    badge: 'RETRO FOOTBALL',
    accentColor: '#EA580C',
    logo: './assets/logos/footballbros.svg',
    rating: '4.8',
    players: '1.8M+ Plays',
    description: 'Throw epic hail-mary passes, perform stiff-arms, break tackles, and score electrifying touchdowns in this retro-styled gridiron football hit.'
  },
  {
    id: 'wrestle-bros',
    name: 'Wrestle Bros',
    domain: 'wrestlebros.com',
    url: 'https://wrestlebros.com/',
    genre: 'Fighting & Brawl',
    badge: 'RING MAYHEM',
    accentColor: '#DC2626',
    logo: './assets/logos/wrestlebros.svg',
    rating: '4.9',
    players: '3.1M+ Plays',
    description: 'Step inside the squared circle! Perform flying suplexes, top-rope elbow drops, pin opponents, and unlock legendary championship wrestlers.'
  },
  {
    id: '2v2-io',
    name: '2v2.io',
    domain: '2v2.io',
    url: 'https://2v2.io/',
    genre: 'IO & Arena',
    badge: 'DUO COMBAT',
    accentColor: '#6366F1',
    logo: './assets/logos/2v2io.svg',
    rating: '4.7',
    players: '1.2M+ Plays',
    description: 'Team up with a friend or queue solo in intense 2v2 fast-action arena showdowns. High skill ceiling, fast matchmaking, and smooth combat.'
  },
  {
    id: 'oz-games',
    name: 'OZ Games',
    domain: 'ozgames.io',
    url: 'https://ozgames.io/',
    genre: 'Curated Games',
    badge: 'UNBLOCKED HUB',
    accentColor: '#059669',
    logo: './assets/logos/ozgames.svg',
    rating: '4.8',
    players: '4.0M+ Plays',
    description: 'Premier browser games catalog featuring unblocked hits, IO multiplayer rooms, action-packed runners, racing simulators, and school-ready games.'
  }
];

export function getGamingSites() {
  return GAMING_SITES;
}

export function renderGamingSection() {
  const container = document.querySelector('#gaming-grid');
  if (!container) return;

  container.innerHTML = GAMING_SITES.map(site => `
    <div class="gaming-card galaxy-glass" data-id="${site.id}">
      <div class="card-glow" style="background: radial-gradient(circle at top right, ${site.accentColor}25, transparent 70%);"></div>
      
      <div class="gaming-card-header">
        <div class="gaming-logo-box" style="border-color: ${site.accentColor}50; background: ${site.accentColor}18; box-shadow: 0 0 16px ${site.accentColor}25;">
          <img
            src="${site.logo}"
            alt="${site.name} logo"
            class="gaming-logo-img"
            loading="lazy"
            onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='flex';"
          />
          <div class="gaming-logo-fallback" style="display:none; color: ${site.accentColor};">
            ${site.name.substring(0, 2).toUpperCase()}
          </div>
        </div>
        
        <div class="gaming-header-meta">
          <span class="gaming-badge" style="border-color: ${site.accentColor}50; color: ${site.accentColor}; background: ${site.accentColor}18;">
            ${site.badge}
          </span>
          <span class="gaming-rating">★ ${site.rating}</span>
        </div>
      </div>

      <div class="gaming-card-body">
        <div class="gaming-title-row">
          <h3 class="gaming-title">${site.name}</h3>
          <span class="gaming-domain">${site.domain}</span>
        </div>
        <p class="gaming-desc">${site.description}</p>
        
        <div class="gaming-stats-row">
          <span class="gaming-players">👥 ${site.players}</span>
          <span class="gaming-genre">${site.genre}</span>
        </div>
      </div>

      <div class="gaming-card-footer">
        <a
          href="${site.url}"
          target="_blank"
          rel="noopener noreferrer"
          class="play-game-btn"
          style="background: linear-gradient(135deg, ${site.accentColor}, #2563eb); box-shadow: 0 4px 18px ${site.accentColor}40;"
          title="Play ${site.name} now at ${site.domain}"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>PLAY ${site.name.toUpperCase()} NOW</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: auto;">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    </div>
  `).join('');
}

export function initGaming() {
  try {
    renderGamingSection();
  } catch (err) {
    console.error('Error initializing Gaming section:', err);
  }
}
