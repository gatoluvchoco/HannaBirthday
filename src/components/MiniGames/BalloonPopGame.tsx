import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { X, Trophy, Sparkles, RefreshCw } from 'lucide-react';

interface BalloonPopGameProps {
  onBack: () => void;
  onWin: (score?: number) => void;
  highScore?: number;
}

interface Balloon {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  letter: string;
  points: number;
  isSpecial?: boolean;
}

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({ onBack, onWin, highScore = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const targetScore = 100;
  const [isWon, setIsWon] = useState(false);
  const isWonRef = useRef(false);
  isWonRef.current = isWon;

  const letters = ['H', 'A', 'N', 'N', 'A', '💖', '👑', '🌸', '✨', '🎂', '🏎️', '23', '🍵', '🧸', '💚'];
  const colors = [
    '#f472b6', '#ec4899', '#fbbf24', '#fbcfe8', '#fda4af',
    '#c084fc', '#4ade80', '#67e8f9', '#a78bfa', '#fde047', '#34d399'
  ];

  const handleRestart = () => {
    sound.playClick();
    setBalloons([]);
    setScore(0);
    scoreRef.current = 0;
    setIsWon(false);
    isWonRef.current = false;
  };

  // Game Loop
  useEffect(() => {
    if (isWon) return;

    // Spawn balloons frequently for an energetic 100-balloon pop extravaganza
    const spawnTimer = setInterval(() => {
      if (isWonRef.current) return;

      const isGold = Math.random() < 0.18;
      const isMega = Math.random() < 0.08;

      let points = 1;
      let label = letters[Math.floor(Math.random() * letters.length)];
      let color = colors[Math.floor(Math.random() * colors.length)];

      if (isMega) {
        points = 5;
        label = '💎 +5';
        color = '#67e8f9';
      } else if (isGold) {
        points = 3;
        label = '👑 +3';
        color = '#fbbf24';
      }

      const containerW = containerRef.current?.clientWidth || 300;
      const newBalloon: Balloon = {
        id: Date.now() + Math.random(),
        x: 28 + Math.random() * (Math.max(200, containerW) - 56),
        y: 360,
        speed: 2.4 + Math.random() * 2.6,
        color,
        letter: label,
        points,
        isSpecial: isGold || isMega,
      };

      setBalloons(prev => [...prev.slice(-30), newBalloon]);
    }, 280);

    // Float step
    const floatTimer = setInterval(() => {
      setBalloons(prev => {
        return prev
          .map(b => ({ ...b, y: b.y - b.speed }))
          .filter(b => b.y > -60);
      });
    }, 24);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(floatTimer);
    };
  }, [isWon]);

  const handlePop = (balloon: Balloon) => {
    if (isWonRef.current) return;
    sound.playPop();
    setBalloons(prev => prev.filter(b => b.id !== balloon.id));

    const newScore = scoreRef.current + balloon.points;
    setScore(newScore);
    scoreRef.current = newScore;

    if (newScore >= targetScore && !isWonRef.current) {
      setIsWon(true);
      isWonRef.current = true;
      sound.playLevelUp();
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fbbf24', '#ffffff', '#a7f3d0', '#67e8f9']
      });
      setTimeout(() => {
        onWin(newScore);
      }, 10);
    }
  };

  return (
    <div 
      onClick={() => {
        sound.playClick();
        onBack();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#18061a] border-2 border-pink-400/70 rounded-3xl p-4 sm:p-5 max-w-sm sm:max-w-md w-full shadow-[0_0_50px_rgba(244,114,182,0.35)] relative flex flex-col items-center max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-3 border-b border-pink-500/30 pb-2">
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
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Birthday Balloon Pop (100 Pops)</span>
          </div>
          <div className="flex items-center gap-1.5">
            {highScore > 0 && (
              <span className="text-[10px] font-mono text-pink-300/80 bg-pink-950/60 px-2 py-0.5 rounded-lg border border-pink-500/20">
                BEST: {highScore}
              </span>
            )}
            <div className="font-mono text-xs font-bold text-amber-300 bg-pink-950/80 px-2.5 py-1 rounded-lg border border-pink-500/30">
              {score} / {targetScore} 🎈
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-pink-300 mb-2 px-1">
          <span>Pop <strong className="text-amber-300">100 balloons</strong> to win!</span>
          <span className="text-amber-300 text-[10px] font-bold">💎 +5 | 👑 +3 | 🎈 +1</span>
        </div>

        {/* Balloon Canvas */}
        <div 
          ref={containerRef}
          className="relative w-full h-[360px] bg-gradient-to-b from-[#240a25] via-[#150417] to-[#0c020d] border-2 border-pink-500/40 rounded-2xl overflow-hidden shadow-inner select-none touch-none"
        >
          {balloons.map((b) => (
            <button
              key={b.id}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePop(b);
              }}
              className={`absolute -translate-x-1/2 w-12 h-16 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] cursor-pointer flex items-center justify-center font-bold text-xs text-black shadow-lg transition-transform active:scale-125 touch-none ${
                b.isSpecial ? 'border-2 border-white animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.8)]' : ''
              }`}
              style={{
                left: `${b.x}px`,
                top: `${b.y}px`,
                backgroundColor: b.color,
                boxShadow: `0 0 16px ${b.color}`,
              }}
            >
              {b.letter}
              <div className="absolute -bottom-1.5 w-1 h-2 bg-white/70 rounded" />
            </button>
          ))}

          {/* Victory Overlay */}
          {isWon && (
            <div 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 bg-[#250827]/95 border-2 border-amber-300 flex flex-col items-center justify-center p-4 text-center z-30 pointer-events-auto"
            >
              <Trophy className="w-14 h-14 text-amber-300 animate-bounce mb-2" />
              <h3 className="font-serif-fancy font-black text-lg text-amber-200 glow-text-gold mb-1">
                100 BALLOONS POPPED!
              </h3>
              <p className="font-sans text-xs text-pink-200 mb-2 leading-relaxed">
                Score: {score} / 100 balloons popped with royal precision! (+20 XP)<br />
                {highScore > 0 && score > highScore && (
                  <span className="text-amber-300 font-bold">✨ NEW RECORD SCORE! ✨<br /></span>
                )}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-full text-[10px] font-mono text-emerald-300 mb-4 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>SAVE POINT RECORDED TO MEMORY</span>
              </div>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  onBack();
                }}
                className="px-7 py-3.5 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-black font-serif-fancy font-extrabold text-xs rounded-2xl shadow-lg hover:brightness-110 active:scale-95 cursor-pointer uppercase tracking-wider z-50 pointer-events-auto"
              >
                COLLECT +20 XP &amp; EXIT
              </button>
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="w-full mt-2.5 flex items-center justify-between">
          <button
            onClick={handleRestart}
            className="py-1.5 px-3 rounded-xl bg-pink-950/70 border border-pink-500/30 text-pink-200 text-[11px] font-mono flex items-center gap-1 hover:bg-pink-900 active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>RESET</span>
          </button>
          <p className="text-[10px] font-sans text-pink-300/75 text-right">
            🎈 Tap or click floating balloons before they fly off screen!
          </p>
        </div>
      </div>
    </div>
  );
};
