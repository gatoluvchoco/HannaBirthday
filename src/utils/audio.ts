// Web Audio API Sound Generator & Synthesizer for HANNA.EXE

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmGain: GainNode | null = null;
  private bgmPlaying: boolean = false;
  private bgmInterval: number | null = null;
  private currentTrack: number = 0;
  private customAudio: HTMLAudioElement | null = null;
  private customAudioUrl: string | null = null;
  private volume: number = 0.5;

  public resumeContext() {
    this.initContext();
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmGain) {
      this.bgmGain.gain.value = muted ? 0 : this.volume;
    }
    if (this.customAudio) {
      this.customAudio.muted = muted;
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgmGain && !this.isMuted) {
      this.bgmGain.gain.value = this.volume;
    }
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
  }

  public getVolume() {
    return this.volume;
  }

  // Retro sound effects
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // ignore audio context restrictions
    }
  }

  public playCoin() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.35);
    } catch {
      // Audio error catch
    }
  }

  public playHeartCatch() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6

      osc2.frequency.setValueAtTime(659.25, now); // E5
      osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.15); // E6

      gain.gain.setValueAtTime(0.2 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    } catch {
      // Audio catch
    }
  }

  public playLevelUp() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.15 * this.volume, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.2);
      });
    } catch {
      // Audio catch
    }
  }

  public playPop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

      gain.gain.setValueAtTime(0.3 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.08);
    } catch {
      // Audio catch
    }
  }

  public playTypewriter() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200 + (Math.random() * 400 - 200), now);

      gain.gain.setValueAtTime(0.04 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.02);
    } catch {
      // Audio catch
    }
  }

  public playSparkle() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.08 * this.volume, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.15);
      });
    } catch {
      // Audio catch
    }
  }

  public playCarRev() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.7);

      gain.gain.setValueAtTime(0.2 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.7);
    } catch {
      // Audio catch
    }
  }

  public playCandleBlow() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      // White noise for blow
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch {
      // Audio catch
    }
  }

  // Romantic Retro Synthesizer BGM Tracks
  public startBGM(trackIndex: number = 0) {
    this.initContext();
    this.currentTrack = trackIndex;

    if (this.customAudioUrl) {
      if (!this.customAudio) {
        this.customAudio = new Audio(this.customAudioUrl);
        this.customAudio.loop = true;
      }
      this.customAudio.volume = this.volume;
      this.customAudio.muted = this.isMuted;
      this.customAudio.play().catch(() => {});
      this.bgmPlaying = true;
      return;
    }

    if (this.bgmPlaying) return;
    this.bgmPlaying = true;

    // Dedicated "Happy Birthday to You" Retro Synthesizer Theme
    const happyBirthdayMelody = [
      // "Happy Birthday to you" (C C D C F E)
      { note: 261.63, dur: 0.35 }, // C4 (Hap-)
      { note: 261.63, dur: 0.35 }, // C4 (-py)
      { note: 293.66, dur: 0.70 }, // D4 (Birth-)
      { note: 261.63, dur: 0.70 }, // C4 (-day)
      { note: 349.23, dur: 0.70 }, // F4 (to)
      { note: 329.63, dur: 1.20 }, // E4 (you)

      // "Happy Birthday to you" (C C D C G F)
      { note: 261.63, dur: 0.35 }, // C4 (Hap-)
      { note: 261.63, dur: 0.35 }, // C4 (-py)
      { note: 293.66, dur: 0.70 }, // D4 (Birth-)
      { note: 261.63, dur: 0.70 }, // C4 (-day)
      { note: 392.00, dur: 0.70 }, // G4 (to)
      { note: 349.23, dur: 1.20 }, // F4 (you)

      // "Happy Birthday dear Hanna" (C C C5 A F E D)
      { note: 261.63, dur: 0.35 }, // C4 (Hap-)
      { note: 261.63, dur: 0.35 }, // C4 (-py)
      { note: 523.25, dur: 0.70 }, // C5 (Birth-)
      { note: 440.00, dur: 0.70 }, // A4 (-day)
      { note: 349.23, dur: 0.70 }, // F4 (dear)
      { note: 329.63, dur: 0.70 }, // E4 (Han-)
      { note: 293.66, dur: 1.10 }, // D4 (-na)

      // "Happy Birthday to you" (Bb Bb A F G F)
      { note: 466.16, dur: 0.35 }, // Bb4 (Hap-)
      { note: 466.16, dur: 0.35 }, // Bb4 (-py)
      { note: 440.00, dur: 0.70 }, // A4 (Birth-)
      { note: 349.23, dur: 0.70 }, // F4 (-day)
      { note: 392.00, dur: 0.70 }, // G4 (to)
      { note: 349.23, dur: 1.40 }, // F4 (you!)
    ];

    const currentMelody = happyBirthdayMelody;
    let step = 0;

    const playNextNote = () => {
      if (!this.bgmPlaying || !this.ctx) return;
      if (this.isMuted) {
        this.bgmInterval = window.setTimeout(playNextNote, 400);
        return;
      }

      const item = currentMelody[step % currentMelody.length];
      const now = this.ctx.currentTime;

      // Romantic warm chiptune synthesis (Triangle + soft Sine sub-harmonic)
      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const subGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.note, now);

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(item.note / 2, now); // 1 octave lower for warm bass

      const noteVol = 0.09 * this.volume;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(noteVol, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + item.dur);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(noteVol * 0.4, now + 0.04);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + item.dur);

      osc.connect(gain);
      subOsc.connect(subGain);
      gain.connect(this.ctx.destination);
      subGain.connect(this.ctx.destination);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + item.dur);
      subOsc.stop(now + item.dur);

      step++;
      const nextDelay = item.dur * 1000;
      this.bgmInterval = window.setTimeout(playNextNote, nextDelay);
    };

    playNextNote();
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearTimeout(this.bgmInterval);
      this.bgmInterval = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  public toggleBGM(trackIndex?: number) {
    if (this.bgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM(trackIndex ?? this.currentTrack);
      return true;
    }
  }

  public isPlayingBGM() {
    return this.bgmPlaying;
  }

  public setCustomAudioUrl(url: string | null) {
    this.customAudioUrl = url;
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    if (url && this.bgmPlaying) {
      this.customAudio = new Audio(url);
      this.customAudio.loop = true;
      this.customAudio.volume = this.volume;
      this.customAudio.muted = this.isMuted;
      this.customAudio.play().catch(() => {});
    }
  }
}

export const sound = new SoundEngine();
