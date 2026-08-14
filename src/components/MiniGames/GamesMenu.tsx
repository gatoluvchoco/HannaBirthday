import React, { useState } from 'react';
import { motion } from 'motion/react';
import { sound } from '../../utils/audio';
import { GameType } from '../../types';
import { HeartCatcherGame } from './HeartCatcherGame';
import { MemoryMatchGame } from './MemoryMatchGame';
import { StarHuntGame } from './StarHuntGame';
import { BalloonPopGame } from './BalloonPopGame';
import { LoveTriviaGame } from './LoveTriviaGame';
import { ArrowLeft, Sparkles, Trophy, CheckCircle, Crown } from 'lucide-react';

interface GamesMenuProps {
  girlfriendName: string;
  onBack: () => void;
  onWinGame: (gameId: string, xpReward: number) => void;
  gamesWon: string[];
}

export const GamesMenu: React.FC<GamesMenuProps> = ({
  girlfriendName,
  onBack,
  onWinGame,
  gamesWon,
}) => {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);

  const games = [
    {
      id: 'catch',
      title: '💖 Princess Heart Catcher',
      desc: 'Catch falling strawberry love hearts in your royal basket (+20 XP).',
      icon: '🧺',
      xp: '+20 XP',
    },
    {
      id: 'match',
      title: '🌸 Sweet Memory Match',
      desc: 'Flip and pair cute romantic icons (Porsche, roses, teddy & matcha) (+20 XP).',
      icon: '🎴',
      xp: '+20 XP',
    },
    {
      id: 'hunt',
      title: '✨ Diamond Starfall Hunt',
      desc: 'Spot and collect 10 glowing diamond stars hidden in the galaxy (+20 XP).',
      icon: '💎',
      xp: '+20 XP',
    },
    {
      id: 'pop',
      title: '🎈 Pastel Birthday Balloon Pop',
      desc: 'Pop 15 floating pastel birthday balloons before time runs out (+20 XP).',
      icon: '🎈',
      xp: '+20 XP',
    },
    {
      id: 'trivia',
      title: '👑 Romantic Couple Trivia',
      desc: 'Test your knowledge about our inside jokes, dates, and memories (+20 XP).',
      icon: '🎀',
      xp: '+20 XP',
    },
  ];

  const handleLaunchGame = (id: string) => {
    sound.playSparkle();
    setActiveGame(id as GameType);
  };

  const handleGameVictory = (gameId: string, xp: number) => {
    sound.playLevelUp();
    onWinGame(gameId, xp);
  };

  if (activeGame === 'catch') {
    return (
      <HeartCatcherGame
        onBack={() => setActiveGame(null)}
        onWin={() => handleGameVictory('catch', 20)}
      />
    );
  }

  if (activeGame === 'match') {
    return (
      <MemoryMatchGame
        onBack={() => setActiveGame(null)}
        onWin={() => handleGameVictory('match', 20)}
      />
    );
  }

  if (activeGame === 'hunt') {
    return (
      <StarHuntGame
        onBack={() => setActiveGame(null)}
        onWin={() => handleGameVictory('hunt', 20)}
      />
    );
  }

  if (activeGame === 'pop') {
    return (
      <BalloonPopGame
        onBack={() => setActiveGame(null)}
        onWin={() => handleGameVictory('pop', 20)}
      />
    );
  }

  if (activeGame === 'trivia') {
    return (
      <LoveTriviaGame
        girlfriendName={girlfriendName}
        onBack={() => setActiveGame(null)}
        onWin={() => handleGameVictory('trivia', 20)}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 z-10">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1c081e] border border-pink-500/40 text-pink-200 text-xs font-mono hover:bg-[#2e0e31] transition-all cursor-pointer shadow-[0_0_15px_rgba(244,114,182,0.15)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO SANCTUARY</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono bg-[#1c081e] border border-pink-500/30 px-3.5 py-1.5 rounded-2xl text-pink-200">
          <Trophy className="w-3.5 h-3.5 text-amber-300" />
          <span>Cleared: {gamesWon.length} / {games.length}</span>
        </div>
      </div>

      {/* Header Bento Box */}
      <div className="text-center mb-8 bg-[#140616]/85 border border-pink-500/30 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-[0_8px_30px_rgba(244,114,182,0.15)]">
        <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 shadow-sm">
          <span>🎮</span>
          <span>ROYAL ARCADE CHALLENGES</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif-fancy font-black text-white">
          HANNA&apos;S MINI GAMES
        </h2>
        <p className="text-xs sm:text-sm font-sans text-pink-100/75 mt-1.5 max-w-lg mx-auto">
          Play cute mini-games to collect EXP, level up your sync, and unlock the final birthday surprise vault!
        </p>
      </div>

      {/* Games Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pb-8">
        {games.map((game, idx) => {
          const isCleared = gamesWon.includes(game.id);
          return (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => handleLaunchGame(game.id)}
              className="relative p-5 sm:p-6 rounded-3xl border border-pink-500/35 bg-gradient-to-br from-[#230a25] via-[#1a061b] to-[#120313] text-left hover:scale-[1.02] hover:border-pink-300 hover:shadow-[0_0_30px_rgba(244,114,182,0.3)] transition-all duration-300 group cursor-pointer shadow-md overflow-hidden flex flex-col justify-between select-none"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pink-900 to-purple-900 border border-pink-400/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-md">
                    {game.icon}
                  </div>
                  {isCleared ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      CLEARED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/60 border border-amber-400/30 px-2.5 py-1 rounded-full shadow-sm">
                      {game.xp}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-serif-fancy font-bold text-white group-hover:text-pink-200 mb-1.5 transition-colors">
                  {game.title}
                </h3>
                <p className="font-sans text-xs text-pink-100/75 leading-relaxed">
                  {game.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-900/40 flex items-center justify-between text-xs font-mono text-pink-300 group-hover:text-white font-bold">
                <span>START CHALLENGE</span>
                <span>▶</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
