import { QuickAccessSite } from '../types';

export const NAV_MENU_ITEMS = [
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com',
    domain: 'youtube.com',
    iconKey: 'youtube',
    color: '#FF0000',
    description: 'Watch videos, gaming streams, and music.'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com',
    domain: 'tiktok.com',
    iconKey: 'tiktok',
    color: '#00F2FE',
    description: 'Trending short videos and creative clips.'
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    url: 'https://web.snapchat.com',
    domain: 'snapchat.com',
    iconKey: 'snapchat',
    color: '#FFFC00',
    description: 'Connect with friends, chat, and share stories.'
  },
  {
    id: 'discord',
    name: 'Discord',
    url: 'https://discord.com',
    domain: 'discord.com',
    iconKey: 'discord',
    color: '#5865F2',
    description: 'Voice chat, gaming servers, and hangouts.'
  },
  {
    id: 'roblox',
    name: 'Roblox',
    url: 'https://www.roblox.com',
    domain: 'roblox.com',
    iconKey: 'roblox',
    color: '#E2231A',
    description: 'Multiplayer gaming, experiences, and virtual worlds.'
  },
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com',
    domain: 'google.com',
    iconKey: 'google',
    color: '#4285F4',
    description: 'Search websites, images, news, and information.'
  }
];

export const QUICK_ACCESS_SITES: QuickAccessSite[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com',
    domain: 'youtube.com',
    category: 'media',
    description: 'Watch gaming highlights, music videos, tutorials, and live streams.',
    accentColor: '#FF0000',
    iconKey: 'youtube'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com',
    domain: 'tiktok.com',
    category: 'media',
    description: 'Trending short videos, comedy, gaming clips, and entertainment.',
    accentColor: '#00F2FE',
    iconKey: 'tiktok'
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    url: 'https://web.snapchat.com',
    domain: 'snapchat.com',
    category: 'social',
    description: 'Snap, chat with friends, view spotlight stories, and discover trends.',
    accentColor: '#FFFC00',
    iconKey: 'snapchat'
  },
  {
    id: 'discord',
    name: 'Discord',
    url: 'https://discord.com',
    domain: 'discord.com',
    category: 'social',
    description: 'Voice chat, gaming servers, friends, and community hangout spaces.',
    accentColor: '#5865F2',
    iconKey: 'discord'
  },
  {
    id: 'roblox',
    name: 'Roblox',
    url: 'https://www.roblox.com',
    domain: 'roblox.com',
    category: 'gaming',
    description: 'Explore millions of user-generated 3D multiplayer games and worlds.',
    accentColor: '#E2231A',
    iconKey: 'roblox'
  },
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com',
    domain: 'google.com',
    category: 'search',
    description: 'The world\'s most popular search engine for websites, images, and info.',
    accentColor: '#4285F4',
    iconKey: 'google'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    url: 'https://www.reddit.com',
    domain: 'reddit.com',
    category: 'social',
    description: 'Dive into gaming communities, discussions, guides, and memes.',
    accentColor: '#FF4500',
    iconKey: 'reddit'
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    url: 'https://www.wikipedia.org',
    domain: 'wikipedia.org',
    category: 'knowledge',
    description: 'The free encyclopedia containing millions of comprehensive articles.',
    accentColor: '#E0E0E0',
    iconKey: 'wikipedia'
  },
  {
    id: 'twitch',
    name: 'Twitch',
    url: 'https://www.twitch.tv',
    domain: 'twitch.tv',
    category: 'gaming',
    description: 'Live game broadcasts, esports championships, and interactive streaming.',
    accentColor: '#9146FF',
    iconKey: 'twitch'
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com',
    domain: 'github.com',
    category: 'knowledge',
    description: 'Development platform with millions of open source projects and tools.',
    accentColor: '#10B981',
    iconKey: 'github'
  }
];

export const SEARCH_ENGINES = [
  { id: 'google', name: 'Google Search', urlTemplate: 'https://www.google.com/search?q=' },
  { id: 'images', name: 'Google Images', urlTemplate: 'https://www.google.com/search?tbm=isch&q=' },
  { id: 'youtube', name: 'YouTube', urlTemplate: 'https://www.youtube.com/results?search_query=' },
  { id: 'wikipedia', name: 'Wikipedia', urlTemplate: 'https://en.wikipedia.org/wiki/Special:Search?search=' }
];
