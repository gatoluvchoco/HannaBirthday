import React from 'react';
import { motion } from 'framer-motion';
import { ActiveSection, UserProgress } from '../types';
import { sound } from '../utils/audio';
import { 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  MapPin, 
  BookOpen, 
  Camera, 
  Gamepad2, 
  Home, 
  Mail, 
  Gift, 
  Music, 
  Heart, 
  Ticket, 
  ArrowRight,
  Flame
} from 'lucide-react';

interface LevelMapProps {
  progress: UserProgress;
  targetXP: number;
  onSelectSection: (section: ActiveSection) => void;
  canUnlockVault: boolean;
}

interface MapNode {
  id: ActiveSection;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  themeColor: string;
  accentBg: string;
  borderColor: string;
  glowColor: string;
  unlockRequirementText: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  xpRewardBadge: string;
  coordinates: { x: number; y: number }; // Percentage on responsive SVG path
}

export const LevelMap: React.FC<LevelMapProps> = ({
  progress,
  targetXP,
  onSelectSection,
  canUnlockVault,
}) => {
  const xp = progress.xp;

  // Define the romantic adventure nodes on the interactive map
  const mapNodes: MapNode[] = [
    {
      id: 'story',
      title: 'Our Timeline',
      subtitle: 'Chapter I: The Meeting',
      icon: <BookOpen className="w-5 h-5 text-pink-300" />,
      themeColor: 'from-pink-500 to-rose-500',
      accentBg: 'bg-pink-950/80',
      borderColor: 'border-pink-500/50',
      glowColor: 'rgba(244,114,182,0.4)',
      unlockRequirementText: 'Open from start',
      isUnlocked: true,
      isCompleted: (progress.visitedStoryEvents?.length || 0) >= 3 || progress.visitedSections.includes('story'),
      xpRewardBadge: '+15 XP',
      coordinates: { x: 12, y: 18 },
    },
    {
      id: 'memories',
      title: 'Polaroid Gallery',
      subtitle: 'Chapter II: Sweet Moments',
      icon: <Camera className="w-5 h-5 text-rose-300" />,
      themeColor: 'from-rose-500 to-amber-500',
      accentBg: 'bg-rose-950/80',
      borderColor: 'border-rose-500/50',
      glowColor: 'rgba(251,113,133,0.4)',
      unlockRequirementText: 'Unlocked at 5+ XP',
      isUnlocked: xp >= 5 || progress.visitedSections.includes('memories'),
      isCompleted: (progress.visitedMemories?.length || 0) >= 3 || progress.visitedSections.includes('memories'),
      xpRewardBadge: '+20 XP',
      coordinates: { x: 38, y: 15 },
    },
    {
      id: 'room',
      title: "Hanna's Sanctuary",
      subtitle: 'Chapter III: Keepsakes Room',
      icon: <Home className="w-5 h-5 text-purple-300" />,
      themeColor: 'from-purple-500 to-pink-500',
      accentBg: 'bg-purple-950/80',
      borderColor: 'border-purple-500/50',
      glowColor: 'rgba(192,132,252,0.4)',
      unlockRequirementText: 'Unlocked at 15+ XP',
      isUnlocked: xp >= 15 || progress.visitedSections.includes('room'),
      isCompleted: (progress.interactedObjects?.length || 0) >= 4,
      xpRewardBadge: '+40 XP',
      coordinates: { x: 62, y: 28 },
    },
    {
      id: 'games-menu',
      title: 'Arcade Arena',
      subtitle: 'Chapter IV: 5 Mini-Games',
      icon: <Gamepad2 className="w-5 h-5 text-amber-300" />,
      themeColor: 'from-amber-500 to-rose-500',
      accentBg: 'bg-amber-950/80',
      borderColor: 'border-amber-500/50',
      glowColor: 'rgba(251,191,36,0.4)',
      unlockRequirementText: 'Unlocked at 20+ XP',
      isUnlocked: xp >= 20 || progress.visitedSections.includes('games-menu'),
      isCompleted: progress.gamesWon.length >= 2,
      xpRewardBadge: '+50 XP',
      coordinates: { x: 86, y: 20 },
    },
    {
      id: 'letter',
      title: 'Royal Letter',
      subtitle: 'Chapter V: From Afiq to Hanna',
      icon: <Mail className="w-5 h-5 text-pink-300" />,
      themeColor: 'from-pink-500 to-rose-400',
      accentBg: 'bg-pink-950/80',
      borderColor: 'border-pink-500/50',
      glowColor: 'rgba(244,114,182,0.4)',
      unlockRequirementText: 'Unlocked at 35+ XP',
      isUnlocked: xp >= 35 || progress.visitedSections.includes('letter'),
      isCompleted: progress.letterOpened,
      xpRewardBadge: '+20 XP',
      coordinates: { x: 52, y: 72 },
    },
    {
      id: 'final-surprise',
      title: 'Secret Vault & Cake',
      subtitle: 'Grand Finale: Royal Birthday Grand Gift',
      icon: <Gift className="w-6 h-6 text-amber-300 animate-bounce" />,
      themeColor: 'from-amber-300 via-rose-300 to-yellow-200',
      accentBg: 'bg-gradient-to-br from-amber-950/90 to-pink-950/90',
      borderColor: 'border-amber-400',
      glowColor: 'rgba(251,191,36,0.6)',
      unlockRequirementText: `Requires ${targetXP} XP Level 23 Protocol`,
      isUnlocked: canUnlockVault,
      isCompleted: xp >= targetXP,
      xpRewardBadge: 'FINAL SURPRISE 👑',
      coordinates: { x: 60, y: 92 },
    },
  ];

  const handleNodeClick = (node: MapNode) => {
    if (!node.isUnlocked) {
      sound.playPop();
      return;
    }
    sound.playSparkle();
    onSelectSection(node.id);
  };

  const completedCount = mapNodes.filter(n => n.isCompleted).length;
  const unlockedCount = mapNodes.filter(n => n.isUnlocked).length;

  return (
    <div className="w-full bg-[#160817]/90 border border-pink-500/30 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-[0_12px_40px_rgba(244,114,182,0.12)] flex flex-col gap-5 select-none relative overflow-hidden">
      {/* Background starlight shimmer */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(244,114,182,0.15),transparent_70%)]" />

      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-500/20 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 text-white shadow-[0_0_15px_rgba(244,114,182,0.4)]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-fancy font-bold text-lg sm:text-xl text-pink-100 flex items-center gap-2">
              <span>Hanna's Starlight Adventure Map</span>
              <span className="text-xs font-mono font-normal text-pink-300 bg-pink-950/80 px-2 py-0.5 rounded-full border border-pink-500/30">
                LEVEL 23
              </span>
            </h3>
            <p className="text-xs text-pink-300/80 font-mono">
              Trace your birthday journey — click any unlocked checkpoint to jump straight in!
            </p>
          </div>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-pink-950/70 border border-pink-500/30 px-3 py-1.5 rounded-xl text-pink-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>UNLOCKED: {unlockedCount} / {mapNodes.length}</span>
          </div>
          <div className="bg-emerald-950/70 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>COMPLETED: {completedCount} / {mapNodes.length}</span>
          </div>
        </div>
      </div>

      {/* Interactive Level Map Trail & Nodes */}
      <div className="relative w-full min-h-[460px] sm:min-h-[400px] rounded-2xl bg-[#0e0410]/70 border border-pink-500/20 p-3 sm:p-5 overflow-hidden flex flex-col justify-between">
        {/* Constellation Glow Grid Lines */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#f472b615_1px,transparent_1px),linear-gradient(to_bottom,#f472b615_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Nodes Grid Layout */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mapNodes.map((node, index) => {
            const isCurrentXPNext = !node.isUnlocked;

            return (
              <motion.button
                key={node.id}
                onClick={() => handleNodeClick(node)}
                whileHover={node.isUnlocked ? { scale: 1.02, y: -2 } : { scale: 1.0 }}
                whileTap={node.isUnlocked ? { scale: 0.98 } : {}}
                className={`relative text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3 group ${
                  node.isUnlocked
                    ? `${node.accentBg} ${node.borderColor} hover:shadow-[0_0_20px_${node.glowColor}] cursor-pointer`
                    : 'bg-[#120614]/80 border-pink-900/30 opacity-60 cursor-not-allowed'
                } ${node.id === 'final-surprise' ? 'sm:col-span-2 lg:col-span-3 border-amber-400/60 bg-gradient-to-r from-amber-950/70 via-pink-950/70 to-purple-950/70 shadow-[0_0_25px_rgba(251,191,36,0.25)]' : ''}`}
              >
                {/* Step / Stage Indicator Bubble */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
                      node.isUnlocked
                        ? `bg-gradient-to-br ${node.themeColor} text-white border-pink-300/40 shadow-[0_0_12px_${node.glowColor}]`
                        : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                    }`}
                  >
                    {node.isUnlocked ? (
                      node.icon
                    ) : (
                      <Lock className="w-5 h-5 text-pink-400/60" />
                    )}
                  </div>
                  {/* Complete / Check badge */}
                  {node.isCompleted && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#120713] flex items-center justify-center text-white shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Node Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-[10px] font-mono text-pink-400/80 uppercase font-bold">
                        STAGE 0{index + 1}
                      </span>
                      {node.isCompleted && (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
                          CLEARED
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30 flex-shrink-0">
                      {node.xpRewardBadge}
                    </span>
                  </div>

                  <h4 className="font-serif-fancy font-bold text-sm sm:text-base text-pink-100 truncate group-hover:text-pink-200 transition-colors">
                    {node.title}
                  </h4>

                  <p className="text-[11px] text-pink-300/70 truncate font-sans">
                    {node.subtitle}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-pink-500/15">
                    <span className={node.isUnlocked ? 'text-pink-300/90' : 'text-rose-400/90'}>
                      {node.isUnlocked ? (
                        <span className="flex items-center gap-1 text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" /> Ready to Play
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-pink-400/80">
                          <Lock className="w-3 h-3" /> {node.unlockRequirementText}
                        </span>
                      )}
                    </span>

                    {node.isUnlocked && (
                      <span className="text-pink-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Enter</span>
                        <ArrowRight className="w-3 h-3 text-pink-400" />
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Bottom Level Map Status Bar */}
        <div className="mt-4 pt-3 border-t border-pink-500/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-pink-300/80">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
            <span>PROGRESS: {xp} / {targetXP} TOTAL XP</span>
          </div>
          <div className="text-[11px] text-pink-400/80">
            {canUnlockVault ? (
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <span>👑 GRAND VAULT READY UNLOCKED!</span>
              </span>
            ) : (
              <span>Collect {Math.max(0, targetXP - xp)} more XP to unseal the Grand 23rd Vault</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
