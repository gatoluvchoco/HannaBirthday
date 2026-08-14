import React, { useMemo } from 'react';

interface StarfieldBackgroundProps {
  crtEnabled?: boolean;
}

export const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({ crtEnabled = true }) => {
  const stars = useMemo(() => {
    return Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 3,
      color: i % 4 === 0 ? '#f472b6' : i % 5 === 0 ? '#fbcfe8' : i % 6 === 0 ? '#fbbf24' : '#4ade80',
      opacity: Math.random() * 0.7 + 0.3
    }));
  }, []);

  const petals = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 12 + 10,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 7,
      symbol: i % 4 === 0 ? '🌸' : i % 4 === 1 ? '✨' : i % 4 === 2 ? '💖' : '🎀',
      opacity: Math.random() * 0.4 + 0.3
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#070509]">
      {/* Dreamy Girly Romantic Nebula Gradient */}
      <div 
        className="absolute inset-0 opacity-50 transition-opacity duration-1000"
        style={{
          background: `
            radial-gradient(circle at 50% 15%, rgba(244, 114, 182, 0.16) 0%, transparent 60%),
            radial-gradient(circle at 85% 75%, rgba(251, 191, 36, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 15% 80%, rgba(74, 222, 128, 0.12) 0%, transparent 55%),
            radial-gradient(circle at 50% 90%, rgba(236, 72, 153, 0.14) 0%, transparent 65%)
          `
        }}
      />

      {/* Subtle Diamond Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(244, 114, 182, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(244, 114, 182, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Twinkling Diamond Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-sparkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 3}px ${star.color}`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Floating Gentle Petals & Sparkles */}
      {petals.map((petal) => (
        <div
          key={`petal-${petal.id}`}
          className="absolute animate-petal text-xs select-none pointer-events-none"
          style={{
            left: `${petal.x}%`,
            fontSize: `${petal.size}px`,
            '--petal-duration': `${petal.duration}s`,
            '--petal-delay': `${petal.delay}s`,
            opacity: petal.opacity,
          } as React.CSSProperties}
        >
          {petal.symbol}
        </div>
      ))}

      {/* Optional CRT Scanlines */}
      {crtEnabled && (
        <div className="absolute inset-0 crt-scanlines opacity-30 pointer-events-none" />
      )}
    </div>
  );
};
