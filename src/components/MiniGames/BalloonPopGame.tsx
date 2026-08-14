import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { X, Trophy, Sparkles } from 'lucide-react';

interface BalloonPopGameProps {
  onBack: () => void;
  onWin: () => void;
}

interface Balloon {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  letter: string;
  points: number;
  popped: boolean;
}

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({ onBack, onWin }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const targetScore = 15;
  const [isWon, setIsWon] = useState(false);
  const letters = ['H', 'A', 'N', 'N', 'A', '💖', '👑', '🌸', '✨'];
  const colors = ['#f472b6', '#ec4899', '#fbbf24', '#fbcfe8', '#fda4af', '#c084fc', '#4ade80'];

  // Game Loop
  useEffect(() => {
    if (isWon) return;

    // Spawn balloons
    const spawnTimer = setInterval(() => {
      const newBalloon: Balloon = {
        id: Date.now() + Math.random(),
        x: 20 + Math.random() * 240,
        y: 330,
        speed: 1.8 + Math.random() * 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        letter: letters[Math.floor(Math.random() * letters.length)],
        points: 1,
        popped: false
      };
      setBalloons(prev => [...prev, newBalloon]);
    }, 450);

    // Float step
    const floatTimer = setInterval(() => {
      setBalloons(prev => {
        return prev
          .map(b => ({ ...b, y: b.y - b.speed }))
          .filter(b => b.y > -50 && !b.popped);
      });
    }, 30);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(floatTimer);
    };
  }, [isWon]);

  const handlePop = (id: number) => {
    sound.playPop();
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setScore(s => {
      const next = s + 1;
      if (next >= targetScore) {
        setIsWon(true);
        sound.playLevelUp();
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 }, colors: ['#f472b6', '#fbbf24', '#ffffff'] });
        onWin();
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#18061a] border-2 border-pink-400/70 rounded-3xl p-4 sm:p-5 max-w-sm w-full shadow-[0_0_50px_rgba(244,114,182,0.35)] relative flex flex-col items-center max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-3 border-b border-pink-500/30 pb-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-200 hover:bg-pink-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="font-serif-fancy font-bold text-xs sm:text-sm text-pink-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Birthday Balloon Pop</span>
          </div>
          <div className="font-mono text-xs font-bold text-amber-300">
            {score} / {targetScore}
          </div>
        </div>

        {/* Balloon Canvas */}
        <div className="relative w-[280px] sm:w-[300px] h-[340px] bg-gradient-to-b from-[#240a25] to-[#0c020d] border-2 border-pink-500/40 rounded-2xl overflow-hidden shadow-inner select-none touch-none">
          {balloons.map((b) => (
            <button
              key={b.id}
              onPointerDown={(e) => {
                e.preventDefault();
                handlePop(b.id);
              }}
              className="absolute -translate-x-1/2 w-12 h-16 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] cursor-pointer flex items-center justify-center font-bold text-sm text-black shadow-lg transition-transform active:scale-125 touch-none"
              style={{
                left: `${b.x}px`,
                top: `${b.y}px`,
                backgroundColor: b.color,
                boxShadow: `0 0 14px ${b.color}`,
              }}
            >
              {b.letter}
              <div className="absolute -bottom-1.5 w-1 h-2 bg-white/70 rounded" />
            </button>
          ))}

          {/* Win Dialog */}
          {isWon && (
            <div className="absolute inset-0 bg-[#250827]/95 border-2 border-amber-300 flex flex-col items-center justify-center p-4 text-center z-30">
              <Trophy className="w-12 h-12 text-amber-300 animate-bounce mb-2" />
              <h3 className="font-serif-fancy font-black text-lg text-amber-200 glow-text-gold mb-1">
                PARTY POPPER CHAMPION!
              </h3>
              <p className="font-sans text-xs text-pink-200 mb-4">
                Popped {score} birthday balloons! (+20 XP)
              </p>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-black font-serif-fancy font-bold text-xs rounded-2xl shadow-lg hover:brightness-110 cursor-pointer uppercase tracking-wider"
              >
                CLAIM +20 XP
              </button>
            </div>
          )}
        </div>

        <p className="text-[11px] font-sans text-pink-300/80 mt-3 text-center">
          Tap the floating pastel birthday balloons before they float away!
        </p>
      </div>
    </div>
  );
};
