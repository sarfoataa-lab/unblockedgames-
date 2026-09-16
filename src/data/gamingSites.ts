export interface GamingSite {
  id: string;
  name: string;
  domain: string;
  url: string;
  category: string;
  genre: string;
  tagline: string;
  description: string;
  accentColor: string;
  iconKey: 'poki' | 'soccerbros' | 'footballbros' | 'wrestlebros' | '2v2io' | 'ozgames';
  badge: string;
  rating: number;
  playersCount: string;
  tags: string[];
  thumbnailGradient: string;
}

export const GAMING_SITES: GamingSite[] = [
  {
    id: 'poki',
    name: 'Poki',
    domain: 'poki.com',
    url: 'https://poki.com',
    category: 'Games Hub',
    genre: 'Instant Browser Games',
    tagline: 'The Ultimate Online Playground',
    description: 'Play thousands of top free online games including Subway Surfers, Temple Run 2, Stickman Hook, and Retro Bowl with no downloads required.',
    accentColor: '#00D2B4',
    iconKey: 'poki',
    badge: 'POPULAR HUB',
    rating: 4.9,
    playersCount: '50M+ Players',
    tags: ['Unblocked', 'Action', 'Multiplayer', 'HTML5', 'Fast Load'],
    thumbnailGradient: 'from-emerald-600/30 via-cyan-900/40 to-[#071322]'
  },
  {
    id: 'soccer-bros',
    name: 'Soccer Bros',
    domain: 'soccerbros.com',
    url: 'https://soccerbros.com',
    category: 'Sports & PvP',
    genre: '1v1 & 2v2 Soccer',
    tagline: 'High-Octane Arcade Soccer',
    description: 'Fast-paced multiplayer arcade soccer action from the creators of Basket Bros. Pick your pro bro, score crazy bicycle kicks, and dominate the pitch.',
    accentColor: '#10B981',
    iconKey: 'soccerbros',
    badge: 'TOP SPORTS',
    rating: 4.8,
    playersCount: '2.5M+ Plays',
    tags: ['Soccer', 'Multiplayer', 'Bros Series', '2-Player', 'Tournaments'],
    thumbnailGradient: 'from-emerald-700/30 via-teal-900/40 to-[#071322]'
  },
  {
    id: 'football-bros',
    name: 'Football Bros',
    domain: 'footballbros.com',
    url: 'https://footballbros.com',
    category: 'Sports & Arcade',
    genre: 'Retro American Football',
    tagline: 'Action-Packed Touchdowns',
    description: 'Throw epic hail-mary passes, perform stiff-arms, break tackles, and score electrifying touchdowns in this retro-styled gridiron football hit.',
    accentColor: '#EA580C',
    iconKey: 'footballbros',
    badge: 'GRIDIRON HIT',
    rating: 4.8,
    playersCount: '1.8M+ Plays',
    tags: ['Football', 'Arcade', 'Bros Series', 'Touchdown', 'PvP'],
    thumbnailGradient: 'from-orange-700/30 via-amber-900/40 to-[#071322]'
  },
  {
    id: 'wrestle-bros',
    name: 'Wrestle Bros',
    domain: 'wrestlebros.com',
    url: 'https://wrestlebros.com',
    category: 'Fighting & Brawl',
    genre: 'Wrestling Mayhem',
    tagline: 'Championship Ring Brawl',
    description: 'Step inside the squared circle! Perform flying suplexes, top-rope elbow drops, pin opponents, and unlock legendary championship wrestlers.',
    accentColor: '#DC2626',
    iconKey: 'wrestlebros',
    badge: 'ACTION BRAWL',
    rating: 4.9,
    playersCount: '3.1M+ Plays',
    tags: ['Wrestling', 'Fighting', '2-Player', 'Bros Series', 'Knockout'],
    thumbnailGradient: 'from-rose-700/30 via-red-950/50 to-[#071322]'
  },
  {
    id: '2v2-io',
    name: '2v2.io',
    domain: '2v2.io',
    url: 'https://2v2.io',
    category: 'IO & Arena',
    genre: 'Competitive 2v2 Battles',
    tagline: 'Electric Duo Arena Combat',
    description: 'Team up with a friend or queue solo in intense 2v2 fast-action arena showdowns. High skill ceiling, instantaneous matchmaking, and zero latency.',
    accentColor: '#6366F1',
    iconKey: '2v2io',
    badge: 'FAST IO ARENA',
    rating: 4.7,
    playersCount: '1.2M+ Plays',
    tags: ['2v2', 'IO Game', 'Arena', 'Co-op', 'Real-Time PvP'],
    thumbnailGradient: 'from-indigo-700/30 via-purple-900/40 to-[#071322]'
  },
  {
    id: 'oz-games',
    name: 'OZ Games',
    domain: 'ozgames.io',
    url: 'https://ozgames.io',
    category: 'Unblocked Hub',
    genre: 'Curated Web Games',
    tagline: 'Premium Unblocked Games Hub',
    description: 'Premier browser games catalog featuring unblocked hits, IO multiplayer rooms, action-packed runners, racing simulators, and school-ready games.',
    accentColor: '#059669',
    iconKey: 'ozgames',
    badge: 'UNBLOCKED HUB',
    rating: 4.8,
    playersCount: '4.0M+ Plays',
    tags: ['Unblocked', 'IO Games', 'Action', 'Arcade', 'Full Speed'],
    thumbnailGradient: 'from-emerald-600/30 via-cyan-950/50 to-[#071322]'
  }
];
