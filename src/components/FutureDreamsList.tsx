import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import { ArrowLeft, Sparkles, Heart, Plus, X, Send, Compass, CheckCircle2, Plane, Car, Home, Coffee, Film, Stars } from 'lucide-react';

interface FutureDreamsListProps {
  girlfriendName: string;
  interactedObjects?: string[];
  onBack: () => void;
  onGainXP: (amount: number, dreamId?: string) => void;
}

interface DreamItem {
  id: string;
  title: string;
  category: 'Trip' | 'Experience' | 'Home' | 'Cozy';
  icon: string;
  desc: string;
  status: 'Promised by Afiq 💍' | 'Planned 🗓️' | 'Forever Dream ✨';
  bgGradient: string;
}

interface WishLantern {
  id: number;
  text: string;
  color: string;
  x: number; // percentage across screen
}

const INITIAL_DREAMS: DreamItem[] = [
  {
    id: 'dream-1',
    title: 'Sunset Coastal Cruise in Rose-Gold Porsche GT3 RS',
    category: 'Experience',
    icon: '🏎️',
    desc: 'Driving down scenic coastal cliffs with the ocean breeze, the amber sunset painting the sky, and you smiling in the passenger seat with our favorite songs playing on full blast.',
    status: 'Promised by Afiq 💍',
    bgGradient: 'from-pink-900/60 to-rose-950/70'
  },
  {
    id: 'dream-2',
    title: 'Spring Trip to Japan & Cherry Blossom Walks',
    category: 'Trip',
    icon: '🌸',
    desc: 'Walking hand in hand through Kyoto under soft pink cherry blossom trees, tasting freshly whisked matcha, and capturing hundreds of adorable candid photos together.',
    status: 'Planned 🗓️',
    bgGradient: 'from-rose-900/60 to-pink-950/70'
  },
  {
    id: 'dream-3',
    title: 'Private Rooftop Movie Under Fairy Lights',
    category: 'Cozy',
    icon: '🎬',
    desc: 'A private rooftop setup with oversized fluffy pillows, warm blankets, gourmet popcorn, hot cocoa, and our favorite movies playing under a starry sky.',
    status: 'Forever Dream ✨',
    bgGradient: 'from-purple-900/60 to-pink-950/70'
  },
  {
    id: 'dream-4',
    title: 'Building Our Dream Sanctuary Home',
    category: 'Home',
    icon: '🏡',
    desc: 'Designing a warm, sunlit home filled with plants, a huge cozy couch, fairy lights, a kitchen for late-night matcha and desserts, and endless laughter.',
    status: 'Promised by Afiq 💍',
    bgGradient: 'from-amber-900/60 to-rose-950/70'
  },
  {
    id: 'dream-5',
    title: 'Midnight Stargazing in a Snowy Glass Cabin',
    category: 'Experience',
    icon: '🌌',
    desc: 'Wrapped up in a warm duvet inside a secluded glass-roof cabin watching shooting stars and constellations together in total peaceful silence.',
    status: 'Forever Dream ✨',
    bgGradient: 'from-blue-900/60 to-purple-950/70'
  },
  {
    id: 'dream-6',
    title: 'Secret Matcha & Pastry Picnic in the Forest',
    category: 'Cozy',
    icon: '🍵',
    desc: 'Laying down a cute gingham blanket in a peaceful flower meadow, sharing artisan strawberry pastries and iced matcha lattes while listening to nature.',
    status: 'Planned 🗓️',
    bgGradient: 'from-emerald-900/60 to-pink-950/70'
  }
];

export const FutureDreamsList: React.FC<FutureDreamsListProps> = ({
  girlfriendName,
  interactedObjects = [],
  onBack,
  onGainXP,
}) => {
  const [dreams, setDreams] = useState<DreamItem[]>(INITIAL_DREAMS);
  const [selectedDream, setSelectedDream] = useState<DreamItem | null>(null);
  const [localInteracted, setLocalInteracted] = useState<string[]>(interactedObjects);
  const [isAddingDream, setIsAddingDream] = useState(false);

  // Wish Lantern State
  const [wishInput, setWishInput] = useState('');
  const [lanternColor, setLanternColor] = useState('#f472b6');
  const [activeLanterns, setActiveLanterns] = useState<WishLantern[]>([]);

  const allInteracted = Array.from(new Set([...interactedObjects, ...localInteracted]));

  // Add dream form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'Trip' | 'Experience' | 'Home' | 'Cozy'>('Experience');
  const [newIcon, setNewIcon] = useState('✨');

  const handleDreamClick = (dream: DreamItem) => {
    sound.playSparkle();
    setSelectedDream(dream);
    if (!allInteracted.includes(dream.id)) {
      setLocalInteracted(prev => [...prev, dream.id]);
      onGainXP(10, dream.id);
    }
  };

  const handleCreateDream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newDreamItem: DreamItem = {
      id: `dream-${Date.now()}`,
      title: newTitle.trim(),
      desc: newDesc.trim(),
      category: newCategory,
      icon: newIcon || '✨',
      status: 'Promised by Afiq 💍',
      bgGradient: 'from-pink-900/60 to-purple-950/70'
    };

    setDreams(prev => [newDreamItem, ...prev]);
    onGainXP(15);
    sound.playLevelUp();

    setNewTitle('');
    setNewDesc('');
    setIsAddingDream(false);
  };

  const handleReleaseLantern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishInput.trim()) return;

    sound.playPop();
    sound.playSparkle();

    const newLantern: WishLantern = {
      id: Date.now(),
      text: wishInput.trim(),
      color: lanternColor,
      x: Math.floor(Math.random() * 70) + 15,
    };

    setActiveLanterns(prev => [...prev, newLantern]);
    setWishInput('');
    onGainXP(10);

    // Auto remove lantern after animation finishes
    setTimeout(() => {
      setActiveLanterns(prev => prev.filter(l => l.id !== newLantern.id));
    }, 7000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 z-10 relative">
      {/* Floating Animated Wish Lanterns */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {activeLanterns.map((lantern) => (
          <motion.div
            key={lantern.id}
            initial={{ y: '100vh', opacity: 0, scale: 0.6 }}
            animate={{ 
              y: '-20vh', 
              opacity: [0, 1, 1, 0.8, 0], 
              scale: [0.6, 1.1, 1, 0.9, 0.6],
              x: [0, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 60]
            }}
            transition={{ duration: 6.5, ease: 'easeOut' }}
            style={{ left: `${lantern.x}%` }}
            className="absolute bottom-0 flex flex-col items-center gap-1.5 drop-shadow-[0_0_20px_rgba(244,114,182,0.8)]"
          >
            <div 
              className="w-10 h-14 rounded-t-full rounded-b-xl border border-white/60 flex items-center justify-center text-xs shadow-2xl relative"
              style={{ backgroundColor: lantern.color }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-t-full blur-xs" />
              <span className="relative z-10 text-white font-mono text-[9px] font-bold">✨</span>
            </div>
            <span className="bg-black/80 border border-pink-400/50 text-pink-200 text-[10px] font-sans px-2.5 py-0.5 rounded-full backdrop-blur-md max-w-xs truncate shadow-lg">
              {lantern.text}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Top Bar with Back Button */}
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

        <button
          onClick={() => {
            sound.playClick();
            setIsAddingDream(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 hover:brightness-110 text-[#1f051c] text-xs font-bold shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ADD COUPLE DREAM</span>
        </button>
      </div>

      {/* Header Bento Box */}
      <div className="text-center mb-6 bg-[#140616]/85 border border-pink-500/30 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-[0_8px_30px_rgba(244,114,182,0.15)]">
        <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 shadow-sm">
          <span>🌌</span>
          <span>FUTURE TOGETHER</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif-fancy font-black text-white">
          OUR ROMANTIC BUCKET LIST
        </h2>
        <p className="text-xs sm:text-sm font-sans text-pink-100/75 mt-1.5 max-w-lg mx-auto">
          Every trip, road cruise, and cozy moment we are going to experience side by side. Tap any dream to open details or send a glowing Wish Lantern into the sky!
        </p>
      </div>

      {/* Wish Lantern Launcher Box */}
      <div className="mb-6 bg-gradient-to-r from-[#200924]/90 via-[#150518]/95 to-[#200924]/90 border border-pink-500/40 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <h3 className="font-serif-fancy font-bold text-white text-base sm:text-lg">
            Send a Floating Starlight Wish Lantern 🏮✨
          </h3>
        </div>
        <p className="text-xs text-pink-100/70 mb-3 font-sans">
          Type any wish or sweet message for us. Releasing a lantern floats it up into the sky and awards +10 XP!
        </p>

        <form onSubmit={handleReleaseLantern} className="flex flex-col sm:flex-row items-center gap-2.5">
          <input
            type="text"
            value={wishInput}
            onChange={(e) => setWishInput(e.target.value)}
            placeholder="e.g., I wish for endless happiness and trips together with you 💖"
            className="flex-grow w-full bg-[#120413] border border-pink-500/40 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-pink-300/40 focus:outline-none focus:border-pink-400"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            {/* Color picker pills */}
            <div className="flex items-center gap-1.5 bg-[#140616] p-1.5 rounded-2xl border border-pink-500/30">
              {['#f472b6', '#fbbf24', '#c084fc', '#38bdf8'].map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setLanternColor(c)}
                  className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                    lanternColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <button
              type="submit"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] text-xs font-bold hover:brightness-110 shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>RELEASE LANTERN</span>
            </button>
          </div>
        </form>
      </div>

      {/* Dreams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
        {dreams.map((dream, idx) => {
          const isInteracted = allInteracted.includes(dream.id);
          return (
            <motion.div
              key={dream.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              onClick={() => handleDreamClick(dream)}
              className={`bg-gradient-to-br ${dream.bgGradient} border border-pink-500/30 hover:border-pink-400 rounded-3xl p-5 cursor-pointer group hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(244,114,182,0.25)] transition-all flex flex-col justify-between select-none relative overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold bg-black/50 text-pink-300 px-2.5 py-0.5 rounded-full border border-pink-500/30 backdrop-blur-md">
                    {dream.status}
                  </span>
                  <span className="text-2xl group-hover:scale-125 transition-transform filter drop-shadow">
                    {dream.icon}
                  </span>
                </div>

                <h3 className="font-serif-fancy font-bold text-base sm:text-lg text-white group-hover:text-pink-200 transition-colors leading-snug">
                  {dream.title}
                </h3>
                <p className="text-xs text-pink-100/75 mt-2 line-clamp-3 font-sans leading-relaxed">
                  {dream.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-500/20 flex items-center justify-between text-[10px] font-mono">
                <span className="text-pink-300/80">
                  {isInteracted ? '✓ Explored (+10 XP)' : '+10 XP Available'}
                </span>
                <span className="text-amber-300 font-bold group-hover:translate-x-1 transition-transform">
                  View Dream &rarr;
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dream Expanded Modal */}
      <AnimatePresence>
        {selectedDream && (
          <div 
            onClick={() => {
              sound.playClick();
              setSelectedDream(null);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#240a28] to-[#140416] border-2 border-pink-400 rounded-3xl p-6 sm:p-7 max-w-lg w-full relative shadow-[0_0_40px_rgba(244,114,182,0.35)] text-center"
            >
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedDream(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-2xl bg-pink-950/80 border border-pink-500/40 text-pink-200 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-5xl mb-2 filter drop-shadow animate-bounce">
                {selectedDream.icon}
              </div>

              <span className="text-[11px] font-mono uppercase bg-pink-950/90 text-amber-300 px-3 py-1 rounded-full border border-pink-500/40">
                {selectedDream.status}
              </span>

              <h3 className="text-xl sm:text-2xl font-serif-fancy font-black text-white mt-3 mb-2">
                {selectedDream.title}
              </h3>

              <p className="text-xs sm:text-sm font-sans text-pink-100/90 leading-relaxed max-w-md mx-auto my-4 bg-pink-950/40 border border-pink-500/25 p-4 rounded-2xl">
                &ldquo;{selectedDream.desc}&rdquo;
              </p>

              <div className="flex items-center justify-center gap-2 text-xs font-mono text-pink-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>One of our greatest adventures ahead</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Dream Modal */}
      <AnimatePresence>
        {isAddingDream && (
          <div 
            onClick={() => setIsAddingDream(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1c081e] border-2 border-pink-400 rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setIsAddingDream(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-pink-950 border border-pink-700 text-pink-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-xl font-serif-fancy font-black text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>ADD COUPLE BUCKET LIST ITEM</span>
              </h3>

              <form onSubmit={handleCreateDream} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono text-pink-300 mb-1">DREAM TITLE</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Stargazing in Iceland under Northern Lights"
                    className="w-full bg-[#120413] border border-pink-500/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-pink-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono text-pink-300 mb-1">CATEGORY</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-[#120413] border border-pink-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-400"
                    >
                      <option value="Trip">Trip ✈️</option>
                      <option value="Experience">Experience 🏎️</option>
                      <option value="Cozy">Cozy 🍵</option>
                      <option value="Home">Home 🏡</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-pink-300 mb-1">EMOJI ICON</label>
                    <input
                      type="text"
                      value={newIcon}
                      onChange={(e) => setNewIcon(e.target.value)}
                      placeholder="✨ or ✈️ or 🌸"
                      className="w-full bg-[#120413] border border-pink-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-pink-300 mb-1">DESCRIPTION &amp; DETAILS</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={3}
                    placeholder="Describe what we will do and how sweet it will be..."
                    className="w-full bg-[#120413] border border-pink-500/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-pink-400 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] text-xs font-bold hover:brightness-110 shadow-md transition-all cursor-pointer mt-2"
                >
                  ADD TO BUCKET LIST &amp; EARN +15 XP
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
