import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { X, Trophy, Sparkles, RefreshCw } from 'lucide-react';

interface MemoryMatchGameProps {
  onBack: () => void;
  onWin: (moves?: number) => void;
  bestMoves?: number;
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
  { icon: '🧸', name: 'Teddy Bear' },
  { icon: '🍵', name: 'Iced Matcha' },
  { icon: '🌸', name: 'Fresh Roses' },
  { icon: '💌', name: 'Love Letter' },
  { icon: '👑', name: 'Level 23 Crown' },
  { icon: '💚', name: 'Green Heart' },
  { icon: '🌊', name: 'Ocean Waves' },
  { icon: '📸', name: 'Polaroid' },
  { icon: '✨', name: 'Diamond Star' },
];

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onBack, onWin, bestMoves = 0 }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    // 10 pairs = 20 cards
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
      const nextMoveCount = moves + 1;
      setMoves(nextMoveCount);
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
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#f472b6', '#fbbf24', '#ffffff', '#a7f3d0', '#67e8f9']
            });
            setTimeout(() => {
              onWin(nextMoveCount);
            }, 10);
          }
        }, 400);
      } else {
        // Not matched
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedIndexes([]);
        }, 900);
      }
    }
  };

  const matchedCount = cards.filter(c => c.isMatched).length / 2;

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
        className="bg-[#18061a] border-2 border-pink-400/70 rounded-3xl p-3.5 sm:p-5 max-w-md sm:max-w-lg w-full shadow-[0_0_50px_rgba(244,114,182,0.35)] relative flex flex-col items-center max-h-[95vh] overflow-y-auto"
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
            <span>Sweet Memory Match (20 Boxes)</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-300">
            {bestMoves > 0 && (
              <span className="text-[10px] text-pink-300/80 bg-pink-950/60 px-2 py-0.5 rounded-lg border border-pink-500/20">
                BEST: {bestMoves}
              </span>
            )}
            <span>Moves: {moves}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-pink-300 mb-2.5 px-1">
          <span>Pairs Matched: <strong className="text-amber-300">{matchedCount} / 10</strong></span>
          <span className="text-[10px] text-pink-300/80">Match all 10 romantic pairs</span>
        </div>

        {/* 20 Cards Grid (4 columns x 5 rows on mobile / 5 cols x 4 rows) */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 w-full mb-3">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              disabled={card.isFlipped || card.isMatched}
              className={`h-14 sm:h-16 rounded-2xl flex flex-col items-center justify-center text-xl sm:text-2xl transition-all duration-300 cursor-pointer select-none shadow-md ${
                card.isMatched
                  ? 'bg-emerald-950/80 border-2 border-emerald-400 text-emerald-200 scale-95 opacity-90'
                  : card.isFlipped
                  ? 'bg-gradient-to-tr from-pink-900 to-rose-700 border-2 border-pink-300 text-white scale-105 shadow-[0_0_15px_rgba(244,114,182,0.6)]'
                  : 'bg-gradient-to-br from-[#2b0c2d] to-[#160418] border border-pink-500/40 text-pink-400 hover:border-pink-300 hover:scale-105 active:scale-95'
              }`}
            >
              {card.isFlipped || card.isMatched ? (
                <div className="flex flex-col items-center">
                  <span>{card.icon}</span>
                  <span className="text-[8px] font-mono text-pink-200 truncate max-w-[50px] mt-0.5">
                    {card.name}
                  </span>
                </div>
              ) : (
                <span className="font-serif-fancy text-sm font-bold text-pink-400/80">?</span>
              )}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={initGame}
            className="flex-1 py-2 rounded-xl bg-pink-950/70 border border-pink-500/30 text-pink-200 text-xs font-mono flex items-center justify-center gap-1.5 hover:bg-pink-900 active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RESET BOARD</span>
          </button>
        </div>

        {/* Victory Modal */}
        {isWon && (
          <div className="absolute inset-0 bg-[#250827]/95 border-2 border-amber-300 rounded-3xl flex flex-col items-center justify-center p-4 text-center z-30">
            <Trophy className="w-14 h-14 text-amber-300 animate-bounce mb-2" />
            <h3 className="font-serif-fancy font-black text-lg text-amber-200 glow-text-gold mb-1">
              PERFECT MEMORY MATCH!
            </h3>
            <p className="font-sans text-xs text-pink-200 mb-2 leading-relaxed">
              You matched all 20 boxes in {moves} moves! (+20 XP)<br />
              {bestMoves > 0 && moves < bestMoves && (
                <span className="text-amber-300 font-bold">✨ NEW RECORD: FEWEST MOVES! ✨<br /></span>
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
              className="px-7 py-3 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-black font-serif-fancy font-bold text-xs rounded-2xl shadow-lg hover:brightness-110 cursor-pointer uppercase tracking-wider"
            >
              COLLECT XP &amp; EXIT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
