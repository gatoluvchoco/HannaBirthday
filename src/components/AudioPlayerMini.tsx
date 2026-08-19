import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Play, Pause, Disc, RotateCcw, Volume2 } from 'lucide-react';

interface AudioPlayerMiniProps {
  customTitle?: string;
}

const SONG_TITLE = "Frank Ocean - Godspeed 🕊️🎹";

export const AudioPlayerMini: React.FC<AudioPlayerMiniProps> = ({ customTitle }) => {
  const [isPlaying, setIsPlaying] = useState(sound.isPlayingBGM());
  const [volume, setVolume] = useState(sound.getVolume());
  const [currentTitle, setCurrentTitle] = useState(sound.getTrackTitle());

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying(sound.isPlayingBGM());
      setCurrentTitle(sound.getTrackTitle());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const togglePlayback = () => {
    sound.playClick();
    const active = sound.toggleBGM();
    setIsPlaying(active);
  };

  const handleRestartTrack = () => {
    sound.playClick();
    sound.stopBGM();
    sound.startBGM();
    setIsPlaying(true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setVolume(val);
  };

  const displayTitle = customTitle || currentTitle;

  return (
    <div className="w-full max-w-md mx-auto mt-4 bg-[#18061a]/95 border border-pink-500/40 rounded-2xl p-3.5 backdrop-blur-md glow-pink shadow-lg select-none">
      <div className="flex items-center justify-between gap-3">
        {/* Disc Icon & Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative">
            <div className={`w-9 h-9 rounded-full bg-pink-950 border border-pink-400/60 flex items-center justify-center text-pink-300 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
              <Disc className="w-5 h-5" />
            </div>
            {isPlaying && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-pink-400 rounded-full animate-ping" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-pink-400 uppercase tracking-wider">
              <span>NOW PLAYING</span>
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3 ml-1">
                  <span className="w-1 bg-pink-400 animate-bounce h-2 rounded-t" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1 bg-rose-300 animate-bounce h-3 rounded-t" style={{ animationDelay: '0.3s' }} />
                  <span className="w-1 bg-amber-300 animate-bounce h-1.5 rounded-t" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1 bg-pink-300 animate-bounce h-2.5 rounded-t" style={{ animationDelay: '0.4s' }} />
                </div>
              )}
            </div>
            <p className="text-xs font-serif-fancy text-pink-100 truncate font-bold">
              {displayTitle}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={togglePlayback}
            className="w-8 h-8 rounded-xl bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] flex items-center justify-center font-bold shadow-md transition-all active:scale-95 cursor-pointer hover:brightness-110"
            title={isPlaying ? "Pause Music" : "Play Music"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={handleRestartTrack}
            className="w-8 h-8 rounded-xl bg-pink-950/80 hover:bg-pink-900 border border-pink-500/40 text-pink-200 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            title="Replay Happy Birthday from Beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Volume slider */}
      <div className="mt-2.5 pt-2 border-t border-pink-500/20 flex items-center gap-2 text-[10px] text-pink-300 font-mono">
        <Volume2 className="w-3 h-3 shrink-0 text-pink-400" />
        <input 
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-pink-950 rounded-lg appearance-none cursor-pointer accent-pink-400"
        />
        <span className="shrink-0 font-bold">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
};
