import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { X, Trophy, Star, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface StarHuntGameProps {
  onBack: () => void;
  onWin: (timeLeft?: number) => void;
  bestTime?: number;
}

interface StarNode {
  id: number;
  x: number; // percentage 5% to 92%
  y: number; // percentage 8% to 90%
  name: string;
  found: boolean;
  size: number; // 24 to 34 px
}

interface ObstacleNode {
  id: number;
  x: number;
  y: number;
  icon: string;
  label: string;
}

const TOTAL_STARS = 30;

const STAR_TITLES = [
  'Radiant Smile', 'Porsche Cruise', 'Warmest Hug', 'First Hello', 'Sweet Laughter',
  'Matcha Love', 'Level 23 Princess', 'Late Night Talks', 'Infinite Affection', 'Afiq & Hanna',
  'Morning Glow', 'Pure Joy', 'Gentle Kiss', 'Sunset Boulevard', 'Midnight Stroll',
  'Boba Date', 'Cozy Blanket', 'Inside Jokes', 'Holding Hands', 'Forever Love',
  'Little Things', 'Safe Haven', 'Favorite Melody', 'Golden Hour', 'Secret Wish',
  'Precious Memory', 'True Soulmate', 'Teddy Cuddles', 'Endless Spark', 'Destined Hearts'
];

export const StarHuntGame: React.FC<StarHuntGameProps> = ({ onBack, onWin, bestTime = 0 }) => {
  const [stars, setStars] = useState<StarNode[]>([]);
  const [obstacles, setObstacles] = useState<ObstacleNode[]>([]);
  const [foundCount, setFoundCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(65);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const initGame = () => {
    // Generate 30 well-distributed stars across a 6x5 virtual grid with random offsets
    const generatedStars: StarNode[] = [];
    const cols = 6;
    const rows = 5;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const index = r * cols + c;
        const baseColPercent = (c + 0.5) * (88 / cols) + 6;
        const baseRowPercent = (r + 0.5) * (82 / rows) + 10;
        const jitterX = (Math.random() - 0.5) * 8;
        const jitterY = (Math.random() - 0.5) * 8;

        generatedStars.push({
          id: index,
          x: Math.max(7, Math.min(93, baseColPercent + jitterX)),
          y: Math.max(9, Math.min(91, baseRowPercent + jitterY)),
          name: STAR_TITLES[index] || `Star #${index + 1}`,
          found: false,
          size: Math.random() > 0.5 ? 28 : 24,
        });
      }
    }

    // Generate 5 easy, cute floating obstacles (Comets / Nebula / Space Bubbles)
    const generatedObstacles: ObstacleNode[] = [
      { id: 101, x: 22, y: 32, icon: '☄️', label: 'Cosmic Comet (-1s)' },
      { id: 102, x: 78, y: 28, icon: '🌌', label: 'Void Nebula (-1s)' },
      { id: 103, x: 50, y: 68, icon: '🪐', label: 'Ringed Planet (-1s)' },
      { id: 104, x: 30, y: 78, icon: '☄️', label: 'Cosmic Comet (-1s)' },
      { id: 105, x: 72, y: 62, icon: '☁️', label: 'Stardust Mist' },
    ];

    setStars(generatedStars);
    setObstacles(generatedObstacles);
    setFoundCount(0);
    setTimeLeft(65);
    setIsWon(false);
    setIsGameOver(false);
    setAlertMsg(null);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Timer
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
    const updated = stars.map(s => (s.id === star.id ? { ...s, found: true } : s));
    setStars(updated);
    const newCount = foundCount + 1;
    setFoundCount(newCount);

    if (newCount === TOTAL_STARS) {
      setIsWon(true);
      sound.playLevelUp();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fbbf24', '#ffffff', '#a7f3d0', '#67e8f9']
      });
      setTimeout(() => {
        onWin(timeLeft);
      }, 10);
    }
  };

  const handleObstacleClick = (obs: ObstacleNode) => {
    sound.playPop();
    setTimeLeft(t => Math.max(1, t - 1));
    setAlertMsg(`Obstacle Hit: ${obs.icon} -1 second!`);
    setTimeout(() => setAlertMsg(null), 1200);
  };

  return (
    <div 
      onClick={() => {
        sound.playClick();
        onBack();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#18061a] border-2 border-pink-400/70 rounded-3xl p-3.5 sm:p-5 max-w-xl w-full shadow-[0_0_50px_rgba(244,114,182,0.35)] relative flex flex-col items-center max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-2.5 border-b border-pink-500/30 pb-2">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="p-1.5 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-200 hover:bg-pink-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="font-serif-fancy font-bold text-xs sm:text-sm text-pink-200 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-300 fill-current" />
            <span>Diamond Starfall Hunt (30 Stars)</span>
          </div>
          <div className="flex items-center gap-2">
            {bestTime > 0 && (
              <span className="text-[10px] font-mono text-pink-300/80 bg-pink-950/60 px-2 py-0.5 rounded-lg border border-pink-500/20">
                RECORD: {bestTime}s
              </span>
            )}
            <div className={`font-mono text-xs font-bold ${timeLeft < 10 ? 'text-rose-400 animate-ping' : 'text-amber-300'}`}>
              ⏱️ {timeLeft}s
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full text-xs font-mono text-pink-300 mb-2 px-1">
          <span className="font-bold text-amber-300">
            Discovered: {foundCount} / {TOTAL_STARS} ⭐
          </span>
          <span className="text-[10px] text-pink-300/90 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Avoid ☄️ comets &amp; find all 30!</span>
          </span>
        </div>

        {alertMsg && (
          <div className="w-full mb-2 py-1 px-2.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-300 text-[10px] font-mono text-center flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>{alertMsg}</span>
          </div>
        )}

        {/* Sky View Canvas */}
        <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl border-2 border-pink-500/40 bg-gradient-to-b from-[#250928] via-[#160318] to-[#0a010c] overflow-hidden shadow-inner select-none touch-none">
          {/* Subtle cosmic background dust */}
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${(i * 19 + 5) % 96}%`,
                top: `${(i * 27 + 7) % 94}%`,
              }}
            />
          ))}

          {/* Drifting Nebula Clouds (Atmosphere) */}
          <div 
            className="absolute top-1/4 left-1/3 w-32 h-20 bg-pink-600/10 rounded-full blur-2xl pointer-events-none animate-pulse"
          />
          <div 
            className="absolute bottom-1/3 right-1/4 w-36 h-24 bg-purple-600/10 rounded-full blur-2xl pointer-events-none animate-pulse"
          />

          {/* Obstacles (Comets / Planets) */}
          {obstacles.map((obs) => (
            <button
              key={obs.id}
              onClick={() => handleObstacleClick(obs)}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer hover:scale-125 transition-transform duration-300 text-xl filter drop-shadow-md z-15 active:scale-90"
              style={{
                left: `${obs.x}%`,
                top: `${obs.y}%`,
              }}
              title={obs.label}
            >
              {obs.icon}
            </button>
          ))}

          {/* 30 Interactive Diamond Stars */}
          {stars.map((star) => (
            <button
              key={star.id}
              onPointerDown={(e) => {
                e.preventDefault();
                handleStarClick(star);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer transition-all duration-300 touch-none z-10 ${
                star.found 
                  ? 'bg-amber-300 text-black scale-110 shadow-[0_0_18px_rgba(251,191,36,0.95)] opacity-95' 
                  : 'bg-pink-950/85 border border-pink-400/90 text-pink-200 hover:scale-135 hover:bg-pink-400 hover:text-black animate-pulse shadow-[0_0_10px_rgba(244,114,182,0.6)]'
              }`}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
              }}
              title={star.name}
            >
              <Star className={`w-3.5 h-3.5 fill-current ${star.found ? 'text-black' : 'text-amber-300'}`} />
              {star.found && (
                <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[8px] font-mono bg-black/90 px-1.5 py-0.5 rounded-full text-amber-200 whitespace-nowrap border border-amber-300/40 pointer-events-none z-20">
                  {star.name}
                </span>
              )}
            </button>
          ))}

          {/* Game Over */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center z-30">
              <h3 className="font-serif-fancy font-bold text-base text-rose-300 mb-1">TIME RAN OUT!</h3>
              <p className="font-sans text-xs text-pink-200 mb-4">
                You discovered {foundCount} of {TOTAL_STARS} diamond stars.
              </p>
              <button
                onClick={initGame}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-400 to-rose-300 text-black font-bold text-xs rounded-xl shadow-md cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>TRY AGAIN</span>
              </button>
            </div>
          )}

          {/* Game Won */}
          {isWon && (
            <div className="absolute inset-0 bg-[#250827]/95 border-2 border-amber-300 flex flex-col items-center justify-center p-4 text-center z-30">
              <Trophy className="w-14 h-14 text-amber-300 animate-bounce mb-2" />
              <h3 className="font-serif-fancy font-black text-lg text-amber-200 glow-text-gold mb-1">
                ALL 30 DIAMOND STARS FOUND!
              </h3>
              <p className="font-sans text-xs text-pink-200 mb-2 leading-relaxed">
                You gathered all 30 celestial love stars with {timeLeft}s remaining! (+20 XP)<br />
                {bestTime > 0 && timeLeft > bestTime && (
                  <span className="text-amber-300 font-bold">✨ NEW RECORD: FASTEST TIME! ✨<br /></span>
                )}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-full text-[10px] font-mono text-emerald-300 mb-4 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>SAVE POINT RECORDED TO MEMORY</span>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onBack();
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-black font-serif-fancy font-bold text-xs rounded-2xl shadow-lg hover:brightness-110 cursor-pointer uppercase tracking-wider"
              >
                COLLECT +20 XP &amp; EXIT
              </button>
            </div>
          )}
        </div>

        <p className="text-[10px] font-sans text-pink-300/80 mt-2.5 text-center">
          ✨ Tap all 30 glowing diamond stars! Avoid clicking rogue comets ☄️ to keep your time high.
        </p>
      </div>
    </div>
  );
};
