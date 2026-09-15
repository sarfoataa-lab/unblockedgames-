export type GameCategory = 
  | 'all'
  | 'action'
  | 'arcade'
  | 'puzzle'
  | 'retro'
  | 'racing'
  | 'sports'
  | 'strategy';

export interface Game {
  id: string;
  title: string;
  slug: string;
  category: GameCategory;
  rating: number; // e.g. 4.9
  plays: number; // formatted count e.g. 42000
  description: string;
  instructions: string[];
  controls: {
    key: string;
    action: string;
  }[];
  tags: string[];
  badge?: 'HOT' | 'NEW' | 'POPULAR' | 'RETRO' | 'CLASSIC';
  accentColor: string; // e.g. '#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'
  iconType: string;
}

export type ModalType = 'about' | 'contact' | 'privacy' | 'terms' | null;

export interface CategoryInfo {
  id: GameCategory;
  name: string;
  iconName: string;
}

export interface WebTab {
  id: string;
  title: string;
  url: string;
  isHome?: boolean;
}

export interface QuickAccessSite {
  id: string;
  name: string;
  url: string;
  category: 'search' | 'social' | 'media' | 'knowledge' | 'gaming';
  description: string;
  accentColor: string;
  iconKey: string;
  domain: string;
}
