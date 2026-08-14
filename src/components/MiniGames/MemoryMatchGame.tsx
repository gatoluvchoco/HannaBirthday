import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { X, Trophy, Sparkles } from 'lucide-react';

interface MemoryMatchGameProps {
  onBack: () => void;
  onWin: () => void;
}

interface Card {
  id: number;
  icon: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARDS_DATA = [
  { icon: '🏎️', name: 'Porsche' },
  { icon: '🧸', name: 'Teddy' },
  { icon: '🍵', name: 'Matcha' },
  { icon: '🌸', name: 'Roses' },
  { icon: '💌', name: 'Love Letter' },
  { icon: '👑', name: 'Level 23' },
];

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onBack, onWin }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    const duplicated = [...CARDS_DATA, ...CARDS_DATA];
    const shuffled = duplicated
      .sort(() => Math.random() - 0.5)
      .map((item, idx) => ({
        id: idx,
        icon: item.icon,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffled);
    setFlippedIndexes([]);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndexes.length === 2) return;

    sound.playClick();
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndexes, index];
    setFlippedIndexes(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;

      if (cards[first].name === cards[second].name) {
        // Matched!
        setTimeout(() => {
          sound.playSparkle();
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedIndexes([]);

          // Check if all matched
          if (matchedCards.every(c => c.isMatched)) {
            setIsWon(true);
            sound.playLevelUp();
            confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 }, colors: ['#f472b6', '#fbbf24', '#ffffff'] });
            onWin();
          }
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedIndexes([]);
        }, 1000);
      }
    }
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
            <span>Sweet Memory Match</span>
          </div>
          <div className="font-mono text-xs font-bold text-amber-300">
            Moves: {moves}
          </div>
        </div>

        {/* Card Grid (3x4) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 w-full select-none">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`h-20 sm:h-22 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                card.isMatched
                  ? 'bg-pink-950/60 border-pink-400/40 opacity-70 cursor-default'
                  : card.isFlipped
                  ? 'bg-gradient-to-tr from-pink-500/40 to-purple-900/40 border-pink-300 shadow-[0_0_15px_rgba(244,114,182,0.6)]'
                  : 'bg-[#1b071e] border-pink-500/40 hover:border-pink-300 hover:scale-105'
              }`}
            >
              {card.isFlipped || card.isMatched ? (
                <>
                  <span className="text-2xl mb-1 filter drop-shadow">{card.icon}</span>
                  <span className="text-[9px] font-mono text-pink-200 truncate max-w-[90%] font-bold">{card.name}</span>
                </>
              ) : (
                <div className="w-7 h-7 rounded-xl bg-pink-950/80 border border-pink-400/40 flex items-center justify-center text-pink-400 text-xs font-mono font-bold">
                  💖
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Win Overlay */}
        {isWon && (
          <div className="absolute inset-0 bg-[#250827]/95 border-2 border-amber-300 rounded-3xl flex flex-col items-center justify-center p-4 text-center z-30">
            <Trophy className="w-12 h-12 text-amber-300 animate-bounce mb-2" />
            <h3 className="font-serif-fancy font-black text-lg text-amber-200 glow-text-gold mb-1">
              PERFECT SYNCHRONY!
            </h3>
            <p className="font-sans text-xs text-pink-200 mb-4">
              Cleared memory match in {moves} moves! (+20 XP)
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-black font-serif-fancy font-bold text-xs rounded-2xl shadow-lg hover:brightness-110 cursor-pointer uppercase tracking-wider"
            >
              CLAIM REWARD
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
