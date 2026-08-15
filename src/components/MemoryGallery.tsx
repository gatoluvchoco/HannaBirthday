import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import { MemoryItem } from '../types';
import { ArrowLeft, Sparkles, Heart, Plus, X, Filter } from 'lucide-react';

interface MemoryGalleryProps {
  memories: MemoryItem[];
  visitedMemories?: string[];
  onBack: () => void;
  onAddMemory: (memory: MemoryItem) => void;
  onGainXP: (amount: number, memoryId?: string) => void;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({
  memories,
  visitedMemories = [],
  onBack,
  onAddMemory,
  onGainXP,
}) => {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [filterTag, setFilterTag] = useState<string>('All');
  const [photoFilter, setPhotoFilter] = useState<'normal' | 'rose' | 'golden' | 'cyber'>('rose');
  const [isAdding, setIsAdding] = useState(false);
  const [localInspected, setLocalInspected] = useState<string[]>(visitedMemories);

  const allInspected = Array.from(new Set([...visitedMemories, ...localInspected]));

  // Add memory form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImg, setNewImg] = useState('');
  const [newTag, setNewTag] = useState('Dates');

  const tags = ['All', 'Dates', 'Adventures', 'Cute', 'Special'];

  const filteredMemories = filterTag === 'All' 
    ? memories 
    : memories.filter((m) => m.tag === filterTag);

  const handleCardClick = (mem: MemoryItem) => {
    sound.playHeartCatch();
    setSelectedMemory(mem);
    if (!allInspected.includes(mem.id)) {
      setLocalInspected(prev => [...prev, mem.id]);
      onGainXP(5, mem.id);
    }
  };

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !newImg.trim()) return;

    const newMem: MemoryItem = {
      id: `mem-${Date.now()}`,
      title: newTitle.trim(),
      desc: newDesc.trim(),
      img: newImg.trim(),
      tag: newTag,
    };

    onAddMemory(newMem);
    onGainXP(10);
    sound.playLevelUp();

    setNewTitle('');
    setNewDesc('');
    setNewImg('');
    setIsAdding(false);
  };

  const getFilterClass = (mode: string) => {
    switch (mode) {
      case 'rose':
        return 'contrast-105 brightness-105 saturate-125 sepia-[0.25] hue-rotate-[320deg]';
      case 'golden':
        return 'contrast-105 brightness-110 sepia-[0.35] saturate-130';
      case 'cyber':
        return 'contrast-115 hue-rotate-[90deg] saturate-150';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 z-10">
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
            setIsAdding(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 hover:brightness-110 text-[#1f051c] text-xs font-bold shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ADD POLAROID</span>
        </button>
      </div>

      {/* Header Bento Box */}
      <div className="text-center mb-6 bg-[#140616]/85 border border-pink-500/30 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-[0_8px_30px_rgba(244,114,182,0.15)]">
        <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 shadow-sm">
          <span>🎀</span>
          <span>ROYAL POLAROID ARCHIVE</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif-fancy font-black text-white">
          MEMORIES WITH HANNA
        </h2>
        <p className="text-xs sm:text-sm font-sans text-pink-100/75 mt-1.5 max-w-lg mx-auto">
          Every snapshot tells the story of our love. Tap any polaroid to view enlarged handwritten details and earn EXP!
        </p>
      </div>

      {/* Filter and Category Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#1c081e]/90 border border-pink-500/30 p-3 rounded-2xl shadow-sm">
        {/* Category Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => {
                sound.playClick();
                setFilterTag(t);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                filterTag === t 
                  ? 'bg-gradient-to-r from-pink-400 to-rose-300 text-[#1f051c] font-bold shadow-sm' 
                  : 'bg-[#0d030e] border border-pink-500/30 text-pink-300 hover:bg-pink-950/60'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Visual Filter selector */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-pink-300">
          <Filter className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Aesthetic:</span>
          {(['normal', 'rose', 'golden', 'cyber'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                sound.playClick();
                setPhotoFilter(mode);
              }}
              className={`px-2.5 py-1 rounded-xl capitalize cursor-pointer transition-all ${
                photoFilter === mode 
                  ? 'bg-pink-500/40 border border-pink-400 text-white font-bold' 
                  : 'text-pink-400/60 hover:text-pink-200'
              }`}
            >
              {mode === 'rose' ? '🌸 Rosé' : mode === 'golden' ? '✨ Gold' : mode}
            </button>
          ))}
        </div>
      </div>

      {/* Polaroid Masonry / Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pb-8">
        {filteredMemories.map((mem, idx) => {
          const isInspected = allInspected.includes(mem.id);
          return (
            <motion.div
              key={mem.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => handleCardClick(mem)}
              className="bg-[#faf5f8] rounded-3xl p-4 sm:p-5 shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-pointer group hover:scale-[1.03] hover:-rotate-1 hover:shadow-[0_15px_35px_rgba(244,114,182,0.35)] transition-all duration-300 flex flex-col justify-between select-none relative"
            >
              {/* Cute Washi Tape / Ribbon Sticker on Polaroid Top */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-pink-300/80 text-[9px] font-mono text-pink-900 font-bold px-3 py-0.5 rounded-full border border-pink-400/50 shadow-sm rotate-1">
                🎀 OUR MOMENT
              </div>

              {/* Polaroid Image Frame */}
              <div className="w-full aspect-[4/3] bg-stone-900 rounded-2xl overflow-hidden relative shadow-inner mb-3 mt-1">
                <img 
                  src={mem.img} 
                  alt={mem.title}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${getFilterClass(photoFilter)}`}
                  loading="lazy"
                />
                
                {/* Tag Badge */}
                {mem.tag && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-black/60 text-pink-200 backdrop-blur-sm border border-pink-400/30">
                    {mem.tag}
                  </span>
                )}
              </div>

              {/* Handwritten Note Area */}
              <div>
                <h3 className="font-serif-fancy text-stone-900 text-base font-bold mb-1 leading-snug group-hover:text-pink-700 transition-colors">
                  {mem.title}
                </h3>
                <p className="font-script text-stone-700 text-lg leading-snug line-clamp-2">
                  {mem.desc}
                </p>

                <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-stone-500 font-mono text-[10px]">
                  <span className="flex items-center gap-1 text-pink-600 font-bold">
                    <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                    <span>{isInspected ? 'INSPECTED' : '+5 XP'}</span>
                  </span>
                  <span>ENLARGE 🔍</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded Polaroid Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#faf5f8] rounded-3xl p-6 max-w-lg w-full shadow-[0_20px_50px_rgba(244,114,182,0.4)] relative"
            >
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 cursor-pointer shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-md bg-stone-900">
                <img 
                  src={selectedMemory.img} 
                  alt={selectedMemory.title} 
                  className={`w-full h-full object-cover ${getFilterClass(photoFilter)}`} 
                />
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif-fancy text-xl font-black text-stone-900">
                  {selectedMemory.title}
                </h3>
                {selectedMemory.tag && (
                  <span className="bg-pink-100 text-pink-700 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
                    {selectedMemory.tag}
                  </span>
                )}
              </div>

              <p className="font-script text-2xl text-stone-700 leading-relaxed mb-6">
                &ldquo;{selectedMemory.desc}&rdquo;
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] font-serif-fancy font-bold text-xs rounded-2xl hover:brightness-110 transition-all cursor-pointer uppercase tracking-wider shadow-md"
                >
                  CLOSE POLAROID
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Memory Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#160618] border-2 border-pink-400/60 rounded-3xl p-6 max-w-md w-full shadow-[0_0_40px_rgba(244,114,182,0.3)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-serif-fancy font-bold text-pink-200">ADD NEW POLAROID</h3>
                <button onClick={() => setIsAdding(false)} className="text-pink-300 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateMemory} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-pink-200 mb-1">Polaroid Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Sunset Picnic with Roses"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#0d030e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-pink-200 mb-1">Handwritten Note</label>
                  <textarea
                    rows={3}
                    placeholder="Write a sweet caption..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-[#0d030e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-pink-200 mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newImg}
                    onChange={(e) => setNewImg(e.target.value)}
                    className="w-full bg-[#0d030e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-pink-200 mb-1">Category</label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full bg-[#0d030e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none cursor-pointer"
                  >
                    <option value="Dates">Dates</option>
                    <option value="Adventures">Adventures</option>
                    <option value="Cute">Cute</option>
                    <option value="Special">Special</option>
                  </select>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 rounded-xl bg-[#230b26] border border-pink-500/40 text-pink-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] font-bold hover:brightness-110 shadow-md cursor-pointer"
                  >
                    Save Polaroid (+10 XP)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
