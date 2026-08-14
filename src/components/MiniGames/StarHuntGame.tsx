import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { X, Trophy, Star } from 'lucide-react';

interface StarHuntGameProps {
  onBack: () => void;
  onWin: () => void;
}

interface StarNode {
  id: number;
  x: number; // percentage
  y: number; // percentage
  name: string;
  found: boolean;
  pulseSpeed: number;
}

export const StarHuntGame: React.FC<StarHuntGameProps> = ({ onBack, onWin }) => {
  const [stars, setStars] = useState<StarNode[]>([]);
  const [foundCount, setFoundCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(35);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const starNames = [
    'Radiant Smile',
    'Porsche Dream',
    'Warm Hug',
    'First Hello',
    'Sweet Laughter',
    'Matcha Love',
    'Level 23 Crown'
  ];

  const initGame = () => {
    const generated: StarNode[] = starNames.map((name, idx) => ({
      id: idx,
      x: 12 + Math.random() * 76,
      y: 12 + Math.random() * 74,
      name,
      found: false,
      pulseSpeed: Math.random() * 2 + 1.5
    }));
    setStars(generated);
    setFoundCount(0);
    setTimeLeft(35);
    setIsWon(false);
    setIsGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Timer Countdown
  useEffect(() => {
    if (isWon || isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          sound.playPop();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWon, isGameOver]);

  const handleStarClick = (star: StarNode) => {
    if (star.found || isWon || isGameOver) return;

    sound.playSparkle();
    const updated = stars.map(s => s.id === star.id ? { ...s, found: true } : s);
    setStars(updated);
    const newCount = foundCount + 1;
    setFoundCount(newCount);

    if (newCount === starNames.length) {
      setIsWon(true);
      sound.playLevelUp();
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 }, colors: ['#f472b6', '#fbbf24', '#ffffff'] });
      onWin();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#18061a] border-2 border-pink-400/70 rounded-3xl p-4 sm:p-5 max-w-md w-full shadow-[0_0_50px_rgba(244,114,182,0.35)] relative flex flex-col items-center max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-3 border-b border-pink-500/30 pb-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-200 hover:bg-pink-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="font-serif-fancy font-bold text-xs sm:text-sm text-pink-200 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-300 fill-current" />
            <span>Diamond Starfall Hunt</span>
          </div>
          <div className={`font-mono text-xs font-bold ${timeLeft < 10 ? 'text-rose-400 animate-ping' : 'text-amber-300'}`}>
            ⏱️ {timeLeft}s
          </div>
        </div>

        <div className="flex items-center justify-between w-full text-xs font-mono text-pink-300 mb-2 px-1">
          <span>Constellations: {foundCount} / {starNames.length}</span>
          <span className="text-[10px] text-pink-400">Find glowing diamond stars!</span>
        </div>

        {/* Sky View Canvas */}
        <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl border-2 border-pink-500/40 bg-gradient-to-b from-[#2a0c2c] via-[#1a051d] to-[#0d020e] overflow-hidden shadow-inner select-none touch-none">
          {/* Subtle star particles background */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${(i * 19) % 100}%`,
                top: `${(i * 29) % 100}%`,
              }}
            />
          ))}

          {/* Interactive Target Stars */}
          {stars.map((star) => (
            <button
              key={star.id}
              onPointerDown={(e) => {
                e.preventDefault();
                handleStarClick(star);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 sm:p-2.5 rounded-full cursor-pointer transition-all duration-300 touch-none ${
                star.found 
                  ? 'bg-amber-300 text-black scale-125 shadow-[0_0_15px_rgba(251,191,36,0.9)]' 
                  : 'bg-pink-950/90 border-2 border-pink-400 text-pink-200 hover:scale-150 hover:bg-pink-400 hover:text-black animate-pulse'
              }`}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
              }}
              title={star.name}
            >
              <Star className="w-4 h-4 fill-current" />
              {star.found && (
                <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono bg-black/90 px-2 py-0.5 rounded-full text-amber-200 whitespace-nowrap border border-amber-300/40 shadow-sm pointer-events-none">
                  {star.name}
                </span>
              )}
            </button>
          ))}

          {/* Game Over */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center z-30">
              <h3 className="font-serif-fancy font-bold text-base text-rose-300 mb-1">TIME RAN OUT!</h3>
              <p className="font-sans text-xs text-pink-200 mb-4">You discovered {foundCount} of 7 stars.</p>
              <button
                onClick={initGame}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-400 to-rose-300 text-black font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                TRY AGAIN
              </button>
            </div>
          )}

          {/* Game Won */}
          {isWon && (
            <div className="absolute inset-0 bg-[#250827]/95 border-2 border-amber-300 flex flex-col items-center justify-center p-4 text-center z-30">
              <Trophy className="w-12 h-12 text-amber-300 animate-bounce mb-2" />
              <h3 className="font-serif-fancy font-black text-lg text-amber-200 glow-text-gold mb-1">STARRY SKY ALIGNED!</h3>
              <p className="font-sans text-xs text-pink-200 mb-4">All 7 love constellations connected! (+20 XP)</p>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-black font-serif-fancy font-bold text-xs rounded-2xl shadow-lg hover:brightness-110 cursor-pointer uppercase tracking-wider"
              >
                COLLECT XP
              </button>
            </div>
          )}
        </div>

        <p className="text-[11px] font-sans text-pink-300/80 mt-3 text-center">
          Tap the hidden glowing diamond stars across the romantic celestial sky.
        </p>
      </div>
    </div>
  );
};
