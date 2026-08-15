import React, { useState } from 'react';
import { AppConfig } from '../types';
import { sound } from '../utils/audio';
import { X, Save, RotateCcw, Sliders, Sparkles } from 'lucide-react';

interface ConfigModalProps {
  config: AppConfig;
  onSaveConfig: (config: AppConfig) => void;
  onClose: () => void;
  onInstantUnlockXP: () => void;
  onResetProgress: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  config,
  onSaveConfig,
  onClose,
  onInstantUnlockXP,
  onResetProgress,
}) => {
  const [formData, setFormData] = useState<AppConfig>({ ...config });
  const [activeTab, setActiveTab] = useState<'general' | 'music' | 'advanced'>('general');
  const [customAudioUrl, setCustomAudioUrl] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playLevelUp();
    onSaveConfig(formData);
    onClose();
  };

  const handleApplyAudioUrl = () => {
    if (customAudioUrl.trim()) {
      sound.setCustomAudioUrl(customAudioUrl.trim());
      sound.playCoin();
      alert('Custom background music stream updated!');
    }
  };

  return (
    <div 
      onClick={() => {
        sound.playClick();
        onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#18061a] border-2 border-pink-400/70 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-[0_0_50px_rgba(244,114,182,0.35)] relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-pink-500/30 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif-fancy font-bold text-base text-pink-200">
              ROYAL CUSTOMIZATION STUDIO
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-200 hover:bg-pink-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-5 border-b border-pink-500/25 pb-2">
          {(['general', 'music', 'advanced'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-pink-400 to-rose-300 text-[#1f051c] font-bold shadow-md'
                  : 'bg-pink-950/60 border border-pink-500/30 text-pink-300 hover:bg-pink-900/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
          {activeTab === 'general' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-pink-200 mb-1">Girlfriend Name</label>
                  <input
                    type="text"
                    value={formData.girlfriendName}
                    onChange={(e) => setFormData({ ...formData, girlfriendName: e.target.value })}
                    className="w-full bg-[#0d020e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-pink-200 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={formData.yourName}
                    onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                    className="w-full bg-[#0d020e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-pink-200 mb-1">Birthday Date</label>
                  <input
                    type="date"
                    value={formData.birthdayDate}
                    onChange={(e) => setFormData({ ...formData, birthdayDate: e.target.value })}
                    className="w-full bg-[#0d020e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-pink-200 mb-1">Player Level</label>
                  <input
                    type="number"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value, 10) || 23 })}
                    className="w-full bg-[#0d020e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-pink-200 mb-1">Final Birthday Surprise Gift URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.finalSurpriseURL}
                  onChange={(e) => setFormData({ ...formData, finalSurpriseURL: e.target.value })}
                  className="w-full bg-[#0d020e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-pink-400">Link to Google Drive, YouTube video, or special gift.</span>
              </div>

              <div>
                <label className="block text-pink-200 mb-1">Final Birthday Wish Note</label>
                <textarea
                  rows={3}
                  value={formData.finalMsg}
                  onChange={(e) => setFormData({ ...formData, finalMsg: e.target.value })}
                  className="w-full bg-[#0d020e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none"
                  required
                />
              </div>
            </>
          )}

          {activeTab === 'music' && (
            <div className="space-y-4">
              <div>
                <label className="block text-pink-200 mb-1">Display Music Title</label>
                <input
                  type="text"
                  value={formData.musicTitle}
                  onChange={(e) => setFormData({ ...formData, musicTitle: e.target.value })}
                  className="w-full bg-[#0d020e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-pink-200 mb-1">Custom MP3 Audio Stream URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/our-song.mp3"
                    value={customAudioUrl}
                    onChange={(e) => setCustomAudioUrl(e.target.value)}
                    className="flex-1 bg-[#0d020e] border border-pink-500/40 rounded-xl p-2 text-pink-100 focus:border-pink-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyAudioUrl}
                    className="px-3 py-2 bg-pink-600 hover:bg-pink-500 rounded-xl text-white font-bold cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-[10px] text-pink-400 mt-1">
                  Note: If empty, the built-in synthesized romantic melody plays automatically!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-4">
              {/* Quick test unlock */}
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/50">
                <h4 className="font-serif-fancy font-bold text-xs text-amber-200 mb-1">TESTING SHORTCUTS</h4>
                <p className="text-[11px] text-pink-100 mb-3">
                  Instantly unlock the 100 XP Vault to preview the Final Birthday Surprise immediately:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    sound.playLevelUp();
                    onInstantUnlockXP();
                    onClose();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-300 to-yellow-200 text-black font-bold text-[11px] rounded-xl shadow-md cursor-pointer"
                >
                  ⚡ INSTANT 100 XP UNLOCK
                </button>
              </div>

              {/* Reset progress */}
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50">
                <h4 className="font-serif-fancy font-bold text-xs text-rose-300 mb-1">RESET EXPERIENCE</h4>
                <p className="text-[11px] text-rose-200 mb-3">
                  Reset XP and visited milestones back to 0:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset all game progress and XP back to zero?")) {
                      sound.playPop();
                      onResetProgress();
                      onClose();
                    }
                  }}
                  className="px-4 py-2 bg-rose-800 hover:bg-rose-700 text-white font-bold text-[11px] rounded-xl cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 inline mr-1" />
                  RESET ALL PROGRESS
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-pink-500/25 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-pink-950 text-pink-300 font-mono text-xs hover:bg-pink-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 hover:brightness-110 text-[#1f051c] font-serif-fancy font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SAVE SETTINGS</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
