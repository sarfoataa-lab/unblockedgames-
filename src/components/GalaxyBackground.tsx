import React, { useMemo } from 'react';

export const GalaxyBackground: React.FC = () => {
  // Precompute deterministic stars to avoid SSR/hydration mismatches and high CPU canvas redraws
  const stars = useMemo(() => {
    const starList: Array<{
      id: number;
      top: string;
      left: string;
      size: number;
      opacity: number;
      duration: string;
      delay: string;
      color: string;
    }> = [];

    const colors = [
      '#ffffff',
      '#e0f2fe',
      '#c7d2fe',
      '#ddd6fe',
      '#a5f3fc',
      '#ffffff',
      '#fae8ff'
    ];

    // 110 deterministic stars spread across viewport
    for (let i = 0; i < 110; i++) {
      // Use pseudo-random deterministic distribution based on index
      const top = ((i * 17.3 + (i % 7) * 11) % 100).toFixed(2);
      const left = ((i * 23.7 + (i % 11) * 7) % 100).toFixed(2);
      const size = i % 14 === 0 ? 3 : i % 5 === 0 ? 2 : 1.2;
      const opacity = 0.35 + ((i % 6) * 0.1);
      const duration = (2.2 + ((i % 5) * 0.8)).toFixed(1) + 's';
      const delay = ((i % 7) * 0.6).toFixed(1) + 's';
      const color = colors[i % colors.length];

      starList.push({
        id: i,
        top: `${top}%`,
        left: `${left}%`,
        size,
        opacity,
        duration,
        delay,
        color
      });
    }

    return starList;
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-[#040713]"
    >
      {/* Deep Space Base Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030612] via-[#05091a] to-[#040713] opacity-95" />

      {/* Layer 1: Purple / Violet Space Lighting & Nebula Cloud */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] min-w-[360px] min-h-[360px] rounded-full bg-gradient-to-br from-purple-700/20 via-indigo-600/15 to-transparent blur-[90px] animate-nebula-slow"
      />

      {/* Layer 2: Cosmic Blue / Cyan Lighting Cloud */}
      <div
        className="absolute top-[20%] -right-[15%] w-[60vw] h-[60vw] min-w-[340px] min-h-[340px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-blue-600/15 to-transparent blur-[100px] animate-nebula-reverse"
      />

      {/* Layer 3: Central Indigo Nebula & Glowing Space Dust behind main content */}
      <div
        className="absolute top-[35%] left-[20%] w-[55vw] h-[45vw] min-w-[320px] min-h-[320px] rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-600/15 to-cyan-500/10 blur-[110px] animate-nebula-pulse"
      />

      {/* Layer 4: Deep Magenta / Violet accent at the bottom */}
      <div
        className="absolute -bottom-[20%] left-[10%] w-[70vw] h-[50vw] min-w-[380px] min-h-[380px] rounded-full bg-gradient-to-t from-violet-900/25 via-blue-900/15 to-transparent blur-[120px] animate-nebula-slow"
      />

      {/* Subtle Glowing Center Core: Illuminates behind the main container without reducing text contrast */}
      <div
        className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12)_0%,rgba(6,182,212,0.06)_40%,transparent_75%)] blur-[40px]"
      />

      {/* Twinkling Galaxy Stars Layer */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full animate-star-twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              boxShadow: star.size > 1.8 ? `0 0 ${star.size * 2}px ${star.color}` : undefined,
              opacity: star.opacity,
              animationDuration: star.duration,
              animationDelay: star.delay
            }}
          />
        ))}
      </div>

      {/* Subtle Cosmic Stardust Grid overlay for futuristic gaming geometry */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)] opacity-70" />
    </div>
  );
};
