import { Game, CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  { id: 'all', name: 'All Games', iconName: 'Gamepad2' },
  { id: 'action', name: 'Action', iconName: 'Flame' },
  { id: 'arcade', name: 'Arcade', iconName: 'Zap' },
  { id: 'puzzle', name: 'Puzzle', iconName: 'Brain' },
  { id: 'retro', name: 'Retro 8-Bit', iconName: 'Sparkles' },
  { id: 'racing', name: 'Racing', iconName: 'Trophy' },
  { id: 'sports', name: 'Sports', iconName: 'Activity' },
  { id: 'strategy', name: 'Strategy', iconName: 'Shield' },
];

export const GAMES_LIST: Game[] = [
  {
    id: 'galaxy-defender',
    title: 'Galaxy Defender',
    slug: 'galaxy-defender',
    category: 'arcade',
    rating: 4.9,
    plays: 74200,
    badge: 'HOT',
    accentColor: '#06b6d4',
    iconType: 'rocket',
    description: 'Pilot your hyper-charged starfighter through alien formations. Dodge enemy plasma fire, take cover behind plasma barriers, and blast cosmic invaders before they breach orbit!',
    instructions: [
      'Move left and right using the Arrow keys or A/D.',
      'Press Spacebar to fire your photon blasters.',
      'Destroy alien invaders before they reach the bottom of the sector.',
      'Take tactical cover behind the bunker shields — but be careful, shields degrade when hit!'
    ],
    controls: [
      { key: '← / → or A / D', action: 'Move Ship Left / Right' },
      { key: 'Spacebar', action: 'Shoot Laser Blaster' },
      { key: 'P', action: 'Pause Game' }
    ],
    tags: ['Space', 'Shooter', 'Retro', 'Arcade']
  },
  {
    id: 'retro-snake',
    title: 'Retro Snake Neon',
    slug: 'retro-snake',
    category: 'retro',
    rating: 4.8,
    plays: 89100,
    badge: 'POPULAR',
    accentColor: '#10b981',
    iconType: 'snake',
    description: 'The definitive retro neon snake! Slither through a cyber grid, devour glowing power orbs, grow longer, and strive for the legendary 1,000+ point record without crashing into walls or your tail.',
    instructions: [
      'Steer the snake in four directions using Arrow keys or WASD.',
      'Consume glowing green energy orbs to lengthen your snake and boost score.',
      'Grab golden bonus orbs quickly before they disappear for 5x points!',
      'Avoid colliding with the perimeter border or your own growing body.'
    ],
    controls: [
      { key: 'Arrow Keys or WASD', action: 'Steer Snake Direction' },
      { key: 'Spacebar', action: 'Pause / Resume' }
    ],
    tags: ['Classic', 'Snake', 'Retro', 'Addictive']
  },
  {
    id: 'cyber-flappy',
    title: 'Cyber Flappy',
    slug: 'cyber-flappy',
    category: 'arcade',
    rating: 4.7,
    plays: 62500,
    badge: 'HOT',
    accentColor: '#f59e0b',
    iconType: 'bird',
    description: 'Navigate a high-tech robotic drone through a dense neon skyscraper corridor. Time your thruster pulses with precision to thread the narrow gaps between laser pylons.',
    instructions: [
      'Tap Spacebar, Click, or Tap screen to pulse upward.',
      'Gravity pulls you downward continuously — master your rhythm.',
      'Pass cleanly between each laser gate to earn 1 point.',
      'Compete to beat your local high score!'
    ],
    controls: [
      { key: 'Spacebar or Click', action: 'Flap / Thrust Upward' }
    ],
    tags: ['Arcade', 'Physics', 'Quick Play', 'One-Button']
  },
  {
    id: 'brick-breaker',
    title: 'Neon Brick Breaker',
    slug: 'brick-breaker',
    category: 'arcade',
    rating: 4.9,
    plays: 54300,
    badge: 'CLASSIC',
    accentColor: '#8b5cf6',
    iconType: 'bricks',
    description: 'A glowing homage to Breakout and Arkanoid! Bounce quantum energy spheres off your paddle to shatter dense neon brick patterns, unlock multiball bonuses, and rack up combo multipliers.',
    instructions: [
      'Slide the paddle left and right with Arrow Keys, A/D, or mouse movement.',
      'Bounce the energy ball against colored bricks to eliminate them.',
      'The bounce angle changes depending on where the ball strikes your paddle.',
      'Clear all bricks to advance to the next level!'
    ],
    controls: [
      { key: 'Mouse or ← / → / A / D', action: 'Move Paddle' },
      { key: 'Spacebar', action: 'Launch Ball / Pause' }
    ],
    tags: ['Breakout', 'Arcade', 'Retro', 'Bricks']
  },
  {
    id: '2048-cyber',
    title: '2048 Cyber Grid',
    slug: '2048-cyber',
    category: 'puzzle',
    rating: 4.8,
    plays: 93400,
    badge: 'POPULAR',
    accentColor: '#ec4899',
    iconType: 'grid',
    description: 'Join the matching data nodes to unlock the ultimate 2048 core! Slide numbered tiles across the 4x4 cyber grid; when two tiles with the same number touch, they merge into one.',
    instructions: [
      'Use Arrow keys, WASD, or swipe gestures to shift all tiles simultaneously.',
      'Matching values merge (2 + 2 = 4, 4 + 4 = 8, 8 + 8 = 16, etc.).',
      'A new tile spawns after every valid slide.',
      'Reach 2048 to win, and keep playing to push for your personal best!'
    ],
    controls: [
      { key: 'Arrow Keys or WASD', action: 'Slide Grid Tiles' },
      { key: 'U', action: 'Undo Last Move' }
    ],
    tags: ['Puzzle', 'Numbers', 'Math', 'Brain']
  },
  {
    id: 'highway-racer',
    title: 'Cyber Highway Racer',
    slug: 'highway-racer',
    category: 'racing',
    rating: 4.8,
    plays: 68700,
    badge: 'HOT',
    accentColor: '#ef4444',
    iconType: 'car',
    description: 'High-speed arcade traffic dodging in an ultra-futuristic hover-coupe. WEAVE between congested traffic, pick up nitro canisters, collect fuel cores, and rack up distance points at blistering speeds!',
    instructions: [
      'Steer between lanes using Left and Right Arrow keys or A/D.',
      'Hold Up Arrow or W for Turbo Nitro boost for bonus speed & points.',
      'Dodge civilian vehicles — a collision ends your run!',
      'Collect gold fuel coins to replenish your energy reserves.'
    ],
    controls: [
      { key: '← / → or A / D', action: 'Change Traffic Lanes' },
      { key: '↑ or W', action: 'Engage Nitro Boost' },
      { key: '↓ or S', action: 'Brake / Decelerate' }
    ],
    tags: ['Racing', 'Speed', 'Action', 'Traffic']
  },
  {
    id: 'retro-pong',
    title: 'Retro Pong 1v1',
    slug: 'retro-pong',
    category: 'sports',
    rating: 4.6,
    plays: 41200,
    badge: 'RETRO',
    accentColor: '#14b8a6',
    iconType: 'pong',
    description: 'The pioneering digital sport reimagined with cyber aesthetics. Play against a responsive AI with 3 difficulty modes, or challenge a friend side-by-side on the same keyboard in 2-Player duel mode!',
    instructions: [
      'Move your paddle vertically to return the ball across the net.',
      'Angle your hits by hitting the ball with the top or bottom of the paddle.',
      'First to reach 7 points wins the championship match.',
      'Switch between Single Player (vs AI) or 2 Player (Local Duel) anytime.'
    ],
    controls: [
      { key: 'W / S (Player 1)', action: 'Move Left Paddle Up / Down' },
      { key: '↑ / ↓ (Player 2 / AI)', action: 'Move Right Paddle Up / Down' },
      { key: 'Spacebar', action: 'Serve / Pause' }
    ],
    tags: ['Sports', '2 Player', 'Classic', 'Retro']
  },
  {
    id: 'block-fall',
    title: 'Block Fall (Tetro Drop)',
    slug: 'block-fall',
    category: 'puzzle',
    rating: 4.9,
    plays: 87600,
    badge: 'POPULAR',
    accentColor: '#3b82f6',
    iconType: 'blocks',
    description: 'The immortal tile-matching puzzle game. Strategically guide falling geometric tetrominoes, rotate them in mid-air, and complete unbroken horizontal rows to clear lines and boost your score.',
    instructions: [
      'Use Left/Right arrows to reposition the falling block.',
      'Press Up Arrow or W to rotate the tetromino clockwise.',
      'Press Down Arrow to soft-drop; Spacebar to hard-drop instantly.',
      'Clear multiple lines simultaneously for Tetris multi-line score combos!'
    ],
    controls: [
      { key: '← / →', action: 'Move Block Left / Right' },
      { key: '↑ or W', action: 'Rotate Tetromino' },
      { key: '↓', action: 'Soft Drop' },
      { key: 'Spacebar', action: 'Hard Drop' }
    ],
    tags: ['Tetris', 'Puzzle', 'Retro', 'Classic']
  },
  {
    id: 'cosmic-asteroids',
    title: 'Cosmic Asteroids',
    slug: 'cosmic-asteroids',
    category: 'action',
    rating: 4.7,
    plays: 49800,
    badge: 'RETRO',
    accentColor: '#a855f7',
    iconType: 'asteroid',
    description: 'Classic vector-arcade space combat. Rotate your agile spacecraft, fire thrusters to drift through microgravity, and vaporize colossal space asteroids into smaller fragments while avoiding deadly collisions.',
    instructions: [
      'Rotate your ship using Left and Right arrow keys.',
      'Press Up Arrow to fire rocket thrusters for forward momentum.',
      'Press Spacebar to blast asteroids into smaller pieces until destroyed.',
      'Beware screen-wrapping: flying off one edge brings you back on the opposite side!'
    ],
    controls: [
      { key: '← / →', action: 'Rotate Starship' },
      { key: '↑ or W', action: 'Engage Thruster' },
      { key: 'Spacebar', action: 'Fire Cannon' }
    ],
    tags: ['Asteroids', 'Arcade', 'Vector', 'Space']
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper Matrix',
    slug: 'minesweeper',
    category: 'strategy',
    rating: 4.7,
    plays: 38400,
    badge: 'CLASSIC',
    accentColor: '#eab308',
    iconType: 'bomb',
    description: 'Clean, tactical mine detection puzzle. Reveal safe sectors without detonating hidden cyber-mines. Use numerical indicators to deduce where mines lurk and flag suspicious sectors.',
    instructions: [
      'Click a square to reveal what lies beneath.',
      'Numbers indicate how many mines are adjacent to that sector.',
      'Right-click or toggle Flag Mode to pin security warning flags.',
      'First click is guaranteed to be 100% safe!'
    ],
    controls: [
      { key: 'Left Click', action: 'Reveal Sector' },
      { key: 'Right Click or Flag Button', action: 'Place / Remove Flag' }
    ],
    tags: ['Minesweeper', 'Logic', 'Strategy', 'Puzzle']
  },
  {
    id: 'speed-reflex',
    title: 'Speed Reflex: Aim Trainer',
    slug: 'speed-reflex',
    category: 'action',
    rating: 4.8,
    plays: 52100,
    badge: 'NEW',
    accentColor: '#059669',
    iconType: 'target',
    description: 'Hone your mouse and tap reflexes with high-velocity target acquisition! Pop appearing holographic targets before they shrink away. Maintain a combo streak to climb the leaderboard.',
    instructions: [
      'Click or tap on holographic targets as soon as they spawn.',
      'Hit smaller targets for greater score multipliers.',
      'Don\'t miss! Missing an active target resets your combo streak.',
      'Survive the 30-second reflex gauntlet to post your personal accuracy score!'
    ],
    controls: [
      { key: 'Mouse Click or Touch', action: 'Hit Target' },
      { key: 'R', action: 'Restart Run' }
    ],
    tags: ['Aim', 'Reflex', 'Action', 'Fast-Paced']
  },
  {
    id: 'memory-matrix',
    title: 'Memory Matrix Cyber',
    slug: 'memory-matrix',
    category: 'puzzle',
    rating: 4.6,
    plays: 34900,
    badge: 'NEW',
    accentColor: '#6366f1',
    iconType: 'brain',
    description: 'A high-tech cyber audio-visual memory challenge. Watch the flashing sequence of glowing matrix tiles, listen to harmonic tones, and repeat the sequence in exact order as length escalates!',
    instructions: [
      'Watch the sequence of highlighted panels carefully.',
      'When your turn begins, click the panels in the exact identical sequence.',
      'Each cleared round adds one additional step to the pattern.',
      'Train your short-term memory and reach round 15+ to prove cyber mastery.'
    ],
    controls: [
      { key: 'Click or Tap', action: 'Input Tile Sequence' }
    ],
    tags: ['Memory', 'Brain', 'Pattern', 'Puzzle']
  }
];
