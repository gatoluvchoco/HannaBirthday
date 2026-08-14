import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { TriviaItem } from '../../types';
import confetti from 'canvas-confetti';
import { X, Trophy, CheckCircle2, AlertCircle, Heart, Sparkles } from 'lucide-react';

interface LoveTriviaGameProps {
  girlfriendName?: string;
  trivia?: TriviaItem[];
  onBack: () => void;
  onWin: () => void;
}

const DEFAULT_TRIVIA: TriviaItem[] = [
  {
    id: 't1',
    question: "What is Hanna's signature dream car to cruise into the sunset?",
    options: ["Porsche GT3 RS (Rose-Gold)", "Lamborghini Huracan", "Mini Cooper Pink", "Ferrari 488"],
    correctIndex: 0,
    explanation: "The Porsche 911 GT3 RS in custom metallic rose-gold & pearl finish!"
  },
  {
    id: 't2',
    question: "What is the absolute golden rule of Level 23 Princess treatment?",
    options: ["Only on weekends", "Unlimited love, hugs, iced treats & zero arguments", "Once every month", "Only during dates"],
    correctIndex: 1,
    explanation: "Hanna gets 24/7 unlimited affection, hugs, boba/matcha, and princess pampering!"
  },
  {
    id: 't3',
    question: "What is Afiq's favorite thing in the whole entire universe?",
    options: ["His gaming PC", "Hanna's radiant smile & contagious laugh", "Sports cars", "Chocolate ice cream"],
    correctIndex: 1,
    explanation: "Hanna's smile lights up the world and melts Afiq's heart every single second."
  },
  {
    id: 't4',
    question: "How long is Afiq planning to love and cherish Hanna?",
    options: ["100 years", "To infinity and beyond (Forever & Ever)", "Until level 50", "23 years"],
    correctIndex: 1,
    explanation: "Forever, unconditionally, through every adventure and every birthday to come! 💖"
  }
];

export const LoveTriviaGame: React.FC<LoveTriviaGameProps> = ({ 
  girlfriendName = 'Hanna',
  trivia = DEFAULT_TRIVIA, 
  onBack, 
  onWin 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const questionList = trivia && trivia.length > 0 ? trivia : DEFAULT_TRIVIA;
  const currentQ = questionList[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      sound.playCoin();
      setCorrectCount(c => c + 1);
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
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 }, colors: ['#f472b6', '#fbbf24', '#ffffff'] });
      onWin();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#18061a] border-2 border-pink-400/70 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-[0_0_50px_rgba(244,114,182,0.35)] relative flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4 border-b border-pink-500/30 pb-2.5">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-200 hover:bg-pink-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="font-serif-fancy font-bold text-sm text-pink-200 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-pink-400 fill-current" />
            <span>Romantic Couple Trivia</span>
          </div>
          <div className="font-mono text-xs font-bold text-amber-300">
            {currentIndex + 1} / {questionList.length}
          </div>
        </div>

        {!isFinished ? (
          <div className="w-full">
            {/* Question Text */}
            <div className="bg-[#0d020e] border border-pink-500/40 rounded-2xl p-4 mb-4 text-center shadow-inner">
              <h3 className="font-serif-fancy font-bold text-sm sm:text-base text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2.5 mb-4">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle = 'bg-[#220824] border-pink-500/35 text-pink-100 hover:border-pink-300';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-pink-600 border-pink-300 text-white shadow-[0_0_15px_rgba(244,114,182,0.6)] font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950 border-rose-500 text-rose-300';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3.5 rounded-2xl border font-sans text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <div className="bg-pink-950/80 border border-pink-500/40 rounded-2xl p-3 mb-4 text-xs font-sans text-pink-100">
                <span className="font-bold text-amber-300">💖 Note: </span>
                {currentQ.explanation}
              </div>
            )}

            {isAnswered && (
              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] font-serif-fancy font-bold text-xs rounded-2xl transition-all shadow-md hover:brightness-110 cursor-pointer uppercase tracking-wider"
                >
                  {currentIndex + 1 < questionList.length ? 'NEXT QUESTION ▶' : 'SEE RESULTS 👑'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <Trophy className="w-14 h-14 text-amber-300 mx-auto mb-2 animate-bounce" />
            <h3 className="font-serif-fancy font-black text-lg text-amber-200 glow-text-gold mb-2">
              QUIZ MASTER! (+20 XP)
            </h3>
            <p className="font-sans text-xs text-pink-100 mb-6 leading-relaxed">
              You scored {correctCount} / {questionList.length} correct! <br />
              Afiq&apos;s heart is officially 100% synchronized with yours. 💖
            </p>
            <button
              onClick={onBack}
              className="px-8 py-3 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-black font-serif-fancy font-bold text-xs rounded-2xl shadow-lg hover:brightness-110 cursor-pointer uppercase tracking-wider"
            >
              COLLECT REWARD
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
