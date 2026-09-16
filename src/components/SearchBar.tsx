import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  resultCount
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-cyan-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search games by name, genre, or keyword (e.g. Snake, Space, 2048)..."
          className="w-full pl-12 pr-24 py-3.5 galaxy-glass rounded-2xl text-slate-100 placeholder-slate-400 text-sm focus:outline-hidden focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all font-sans"
        />

        <div className="absolute right-3.5 flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {resultCount} {resultCount === 1 ? 'game' : 'games'}
          </div>
        </div>
      </div>
    </div>
  );
};
