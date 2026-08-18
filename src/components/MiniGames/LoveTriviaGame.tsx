import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { TriviaItem } from '../../types';
import confetti from 'canvas-confetti';
import { X, Trophy, CheckCircle2, AlertCircle, Heart, Sparkles, Flame, HelpCircle } from 'lucide-react';

interface LoveTriviaGameProps {
  girlfriendName?: string;
  trivia?: TriviaItem[];
  onBack: () => void;
  onWin: (score?: number) => void;
  bestScore?: number;
}

interface TriviaItemWithCategory extends TriviaItem {
  roundTitle?: string;
  difficulty?: string;
  isImpossible?: boolean;
}

const TRIVIA_ROUNDS: { [key: number]: { title: string; difficulty: string; badgeColor: string; isImpossible?: boolean } } = {
  0: { title: '❤️ ROUND 1 — HOW WELL DO YOU KNOW US?', difficulty: '⭐⭐ Medium', badgeColor: 'bg-pink-950/80 border-pink-400/40 text-pink-300' },
  5: { title: '🧠 ROUND 2 — HARDER "US" QUESTIONS', difficulty: '⭐⭐⭐ Hard', badgeColor: 'bg-rose-950/80 border-rose-400/40 text-rose-300' },
  10: { title: '🧩 ROUND 3 — COUPLE PSYCHOLOGY', difficulty: '⭐⭐⭐⭐ Very Hard', badgeColor: 'bg-purple-950/80 border-purple-400/40 text-purple-300' },
  15: { title: '🌎 ROUND 4 — GENERAL TRIVIA', difficulty: '⭐⭐⭐⭐ Expert', badgeColor: 'bg-blue-950/80 border-blue-400/40 text-blue-300' },
  20: { title: '🧠 ROUND 5 — "WAIT... YOU ACTUALLY KNOW THIS?"', difficulty: '⭐⭐⭐⭐⭐ Master', badgeColor: 'bg-emerald-950/80 border-emerald-400/40 text-emerald-300' },
  25: { title: '💀 FINAL ROUND — IMPOSSIBLE MODE', difficulty: '⭐⭐⭐⭐⭐⭐ 50 XP EACH!', badgeColor: 'bg-amber-950/90 border-amber-400/60 text-amber-300 animate-pulse', isImpossible: true },
};

function getRoundInfo(index: number) {
  if (index >= 25) return TRIVIA_ROUNDS[25];
  if (index >= 20) return TRIVIA_ROUNDS[20];
  if (index >= 15) return TRIVIA_ROUNDS[15];
  if (index >= 10) return TRIVIA_ROUNDS[10];
  if (index >= 5) return TRIVIA_ROUNDS[5];
  return TRIVIA_ROUNDS[0];
}

export const LoveTriviaGame: React.FC<LoveTriviaGameProps> = ({ 
  trivia, 
  onBack, 
  onWin,
  bestScore = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const questionList = trivia && trivia.length > 0 ? trivia : [];
  const currentQ = questionList[currentIndex];
  const roundInfo = getRoundInfo(currentIndex);
  const isFinalRound = currentIndex >= 25;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      sound.playCoin();
      setCorrectCount(c => c + 1);
      const pointsGained = isFinalRound ? 50 : 5;
      setEarnedXP(xp => xp + pointsGained);
    } else {
      sound.playPop();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < questionList.length) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      sound.playLevelUp();
      confetti({ 
        particleCount: 120, 
        spread: 90, 
        origin: { y: 0.6 }, 
        colors: ['#f472b6', '#fbbf24', '#ffffff', '#a7f3d0', '#67e8f9'] 
      });
      onWin(correctCount);
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
        className="bg-[#18061a] border-2 border-pink-400/70 rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-[0_0_50px_rgba(244,114,182,0.35)] relative flex flex-col items-center max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-3 border-b border-pink-500/30 pb-2.5">
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
            <Heart className="w-4 h-4 text-pink-400 fill-current animate-pulse" />
            <span>Romantic &amp; Master Trivia (30 Qs)</span>
          </div>

          <div className="flex items-center gap-2">
            {bestScore > 0 && (
              <span className="text-[10px] font-mono text-pink-300/80 bg-pink-950/60 px-2 py-0.5 rounded-lg border border-pink-500/20">
                BEST: {bestScore}/{questionList.length}
              </span>
            )}
            <div className="font-mono text-xs font-bold text-amber-300 bg-pink-950/80 px-2.5 py-1 rounded-xl border border-pink-500/30">
              {currentIndex + 1} / {questionList.length}
            </div>
          </div>
        </div>

        {!isFinished ? (
          <div className="w-full">
            {/* Round Badge Banner */}
            <div className="flex flex-col items-center justify-center gap-1 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-[11px] font-mono font-bold shadow-md uppercase tracking-wide text-center ${roundInfo.badgeColor}`}>
                {roundInfo.isImpossible && <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />}
                <span>{roundInfo.title}</span>
              </span>
              <span className="text-[10px] font-mono text-pink-300/80 font-semibold">
                Difficulty: {roundInfo.difficulty} {isFinalRound ? '🔥 (+50 XP/Q)' : '(+5 XP/Q)'}
              </span>
            </div>

            {/* Score & XP tracker */}
            <div className="flex items-center justify-between text-[11px] font-mono text-pink-200/90 mb-2 px-1">
              <span>Correct: <strong className="text-emerald-400">{correctCount}</strong> / {currentIndex + 1}</span>
              <span>XP Earned: <strong className="text-amber-300">+{earnedXP} XP</strong></span>
            </div>

            {/* Question Card */}
            <div className="bg-[#0d020e] border border-pink-500/40 rounded-2xl p-4 mb-3.5 text-center shadow-inner">
              <span className="text-[10px] font-mono text-pink-400/80 block mb-1 uppercase font-semibold">
                Question {currentIndex + 1} of {questionList.length}
              </span>
              <h3 className="font-serif-fancy font-bold text-sm sm:text-base text-white leading-relaxed">
                {currentQ?.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 mb-3.5">
              {currentQ?.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle = 'bg-[#220824] border-pink-500/35 text-pink-100 hover:border-pink-300 hover:bg-[#2e0b31]';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(52,211,153,0.6)] font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-[#150417] border-pink-900/40 text-pink-400/50 opacity-60';
                  }
                }

                const optionLetter = ['A', 'B', 'C', 'D'][idx] || '';

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3 sm:p-3.5 rounded-2xl border font-sans text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] ${btnStyle}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-black/40 border border-pink-500/30 text-[10px] font-mono font-bold flex items-center justify-center text-amber-300 shrink-0">
                        {optionLetter}
                      </span>
                      <span>{opt}</span>
                    </span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <div className="bg-pink-950/85 border border-pink-500/40 rounded-2xl p-3 mb-3.5 text-xs font-sans text-pink-100 shadow-inner">
                <span className="font-bold text-amber-300">💖 Note: </span>
                {currentQ.explanation}
              </div>
            )}

            {/* Next / Finish Button */}
            {isAnswered && (
              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="w-full py-3.5 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] font-serif-fancy font-extrabold text-xs rounded-2xl transition-all shadow-md hover:brightness-110 active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  {currentIndex + 1 < questionList.length ? 'NEXT QUESTION ▶' : 'SEE FINAL RESULTS 👑'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Victory / Results View */
          <div className="text-center py-3 w-full">
            <Trophy className="w-16 h-16 text-amber-300 mx-auto mb-2 animate-bounce" />
            <h3 className="font-serif-fancy font-black text-xl text-amber-200 glow-text-gold mb-1">
              GRAND TRIVIA COMPLETE!
            </h3>
            <p className="font-sans text-xs text-pink-100 mb-3 leading-relaxed">
              You conquered all 6 rounds with <strong className="text-amber-300 text-sm">{correctCount} / {questionList.length}</strong> correct answers!<br />
              Total XP Earned: <strong className="text-emerald-400 font-mono text-sm">+{earnedXP} XP</strong> ✨<br />
              {correctCount > bestScore && bestScore > 0 && (
                <span className="text-amber-300 font-bold">✨ NEW RECORD HIGH SCORE! ✨<br /></span>
              )}
              Afiq&apos;s heart is officially 1000% synchronized with yours. ❤️👑
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-full text-[10px] font-mono text-emerald-300 mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SAVE POINT RECORDED TO MEMORY</span>
            </div>

            <div>
              <button
                onClick={() => {
                  sound.playClick();
                  onBack();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-black font-serif-fancy font-extrabold text-xs rounded-2xl shadow-lg hover:brightness-110 active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                CLAIM +{earnedXP} XP &amp; EXIT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
