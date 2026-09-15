import React from 'react';
import { GameCategory } from '../types';
import { CATEGORIES } from '../data/games';
import {
  Gamepad2,
  Flame,
  Zap,
  Brain,
  Sparkles,
  Trophy,
  Activity,
  Shield
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: GameCategory;
  onSelectCategory: (category: GameCategory) => void;
  gameCounts: Record<GameCategory, number>;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  gameCounts
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2': return <Gamepad2 className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'Brain': return <Brain className="w-4 h-4 text-pink-400" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'Trophy': return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'Activity': return <Activity className="w-4 h-4 text-cyan-400" />;
      case 'Shield': return <Shield className="w-4 h-4 text-purple-400" />;
      default: return <Gamepad2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max pb-1">
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat.id;
          const count = gameCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <span className={isActive ? 'text-slate-950' : ''}>
                {getIcon(cat.iconName)}
              </span>
              <span>{cat.name}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
