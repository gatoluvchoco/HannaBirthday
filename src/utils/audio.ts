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
  public playGodspeed() {
    this.startBGM('godspeed');
  }

  public playHappyBirthday() {
    this.startBGM('happyBirthday');
  }

  public startBGM(track: 'godspeed' | 'happyBirthday' | number = 'godspeed') {
    this.initContext();

    // Determine target track name
    let trackName: 'godspeed' | 'happyBirthday' = 'godspeed';
    if (typeof track === 'string') {
      trackName = track;
    } else if (track === 1) {
      trackName = 'happyBirthday';
    } else {
      trackName = 'godspeed';
    }

    this.currentTrack = trackName === 'happyBirthday' ? 1 : 0;

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

    // Stop current track before switching
    if (this.bgmInterval) {
      clearTimeout(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.bgmPlaying = true;

    // Dedicated "Godspeed by Frank Ocean" Soulful Synthesizer Theme
    const godspeedMelody = [
      // "I will always love you" (C4 -> F4 -> G4 -> A4 -> G4 -> F4 -> D4)
      { note: 261.63, dur: 0.45, chord: 174.61 }, // C4 (I) + F3 bass
      { note: 349.23, dur: 0.40 }, // F4 (will)
      { note: 392.00, dur: 0.40 }, // G4 (al-)
      { note: 440.00, dur: 0.70 }, // A4 (-ways)
      { note: 392.00, dur: 0.40 }, // G4 (love)
      { note: 349.23, dur: 0.60 }, // F4 (you)
      { note: 293.66, dur: 1.10, chord: 146.83 }, // D4 + D3 bass

      // "How I do" (F4 -> G4 -> F4)
      { note: 349.23, dur: 0.50 }, // F4 (how)
      { note: 392.00, dur: 0.50 }, // G4 (I)
      { note: 349.23, dur: 1.20, chord: 116.54 }, // F4 (do) + Bb2 bass

      // "Let go of a claim on you" (F4 -> G4 -> A4 -> C5 -> A4 -> G4 -> F4)
      { note: 349.23, dur: 0.40 }, // F4 (Let)
      { note: 392.00, dur: 0.40 }, // G4 (go)
      { note: 440.00, dur: 0.40 }, // A4 (of)
      { note: 523.25, dur: 0.60, chord: 130.81 }, // C5 (a claim) + C3 bass
      { note: 440.00, dur: 0.40 }, // A4 (on)
      { note: 392.00, dur: 0.40 }, // G4 (you)
      { note: 349.23, dur: 1.30, chord: 174.61 }, // F4 + F3 bass

      // "Some nights you dance with tears in your eyes" (F4 -> A4 -> C5 -> D5 -> C5 -> A4 -> G4 -> F4)
      { note: 349.23, dur: 0.40 }, // F4 (Some)
      { note: 440.00, dur: 0.40 }, // A4 (nights)
      { note: 523.25, dur: 0.50, chord: 146.83 }, // C5 (you) + D3 bass
      { note: 587.33, dur: 0.50 }, // D5 (dance)
      { note: 523.25, dur: 0.50 }, // C5 (with)
      { note: 440.00, dur: 0.50 }, // A4 (tears)
      { note: 392.00, dur: 0.40 }, // G4 (in your)
      { note: 349.23, dur: 1.10, chord: 116.54 }, // F4 (eyes) + Bb2 bass

      // "Boy, it's okay to cry" (A4 -> G4 -> F4 -> D4 -> C4)
      { note: 440.00, dur: 0.50 }, // A4 (Boy)
      { note: 392.00, dur: 0.40 }, // G4 (it's)
      { note: 349.23, dur: 0.50 }, // F4 (o-)
      { note: 293.66, dur: 0.50 }, // D4 (-kay)
      { note: 261.63, dur: 1.30, chord: 130.81 }, // C4 (to cry) + C3 bass

      // "Just remember I will always want you to have"
      { note: 261.63, dur: 0.35 }, // C4 (Just)
      { note: 293.66, dur: 0.35 }, // D4 (re-)
      { note: 349.23, dur: 0.35, chord: 174.61 }, // F4 (-mem-) + F3 bass
      { note: 392.00, dur: 0.35 }, // G4 (-ber)
      { note: 440.00, dur: 0.45 }, // A4 (I will)
      { note: 523.25, dur: 0.55 }, // C5 (al-ways)
      { note: 440.00, dur: 0.40 }, // A4 (want you)
      { note: 392.00, dur: 0.50 }, // G4 (to have)

      // "The good things" (G4 -> F4 -> F4)
      { note: 392.00, dur: 0.45 }, // G4 (the)
      { note: 349.23, dur: 0.60 }, // F4 (good)
      { note: 349.23, dur: 1.40, chord: 116.54 }, // F4 (things) + Bb2 bass

      // "Wishing you Godspeed, glory" (F4 -> A4 -> C5 -> F5 -> E5 -> D5 -> C5)
      { note: 349.23, dur: 0.40 }, // F4 (Wish-)
      { note: 440.00, dur: 0.40 }, // A4 (-ing)
      { note: 523.25, dur: 0.50, chord: 174.61 }, // C5 (you) + F3 bass
      { note: 698.46, dur: 0.80 }, // F5 (God-)
      { note: 659.25, dur: 0.50 }, // E5 (-speed)
      { note: 587.33, dur: 0.60, chord: 146.83 }, // D5 (glo-) + D3 bass
      { note: 523.25, dur: 1.50, chord: 174.61 }, // C5 (-ry) + F3 bass

      // "Still, I'll always be there for you"
      { note: 349.23, dur: 0.45 }, // F4 (Still)
      { note: 392.00, dur: 0.40 }, // G4 (I'll)
      { note: 440.00, dur: 0.50 }, // A4 (al-)
      { note: 523.25, dur: 0.60, chord: 116.54 }, // C5 (-ways) + Bb2 bass
      { note: 440.00, dur: 0.40 }, // A4 (be there)
      { note: 392.00, dur: 0.40 }, // G4 (for)
      { note: 349.23, dur: 1.60, chord: 174.61 }, // F4 (you) + F3 bass
    ];

    // Dedicated "Happy Birthday to You" Retro Arcade Celebration Theme
    const happyBirthdayMelody = [
      // "Happy Birthday to you" (C C D C F E)
      { note: 261.63, dur: 0.35, chord: 130.81 }, // C4 + C3 bass
      { note: 261.63, dur: 0.35 },
      { note: 293.66, dur: 0.70 },
      { note: 261.63, dur: 0.70 },
      { note: 349.23, dur: 0.70, chord: 174.61 }, // F4 + F3 bass
      { note: 329.63, dur: 1.20 },

      // "Happy Birthday to you" (C C D C G F)
      { note: 261.63, dur: 0.35, chord: 130.81 },
      { note: 261.63, dur: 0.35 },
      { note: 293.66, dur: 0.70 },
      { note: 261.63, dur: 0.70 },
      { note: 392.00, dur: 0.70, chord: 196.00 }, // G4 + G3 bass
      { note: 349.23, dur: 1.20, chord: 174.61 },

      // "Happy Birthday dear Hanna" (C C C5 A F E D)
      { note: 261.63, dur: 0.35, chord: 130.81 },
      { note: 261.63, dur: 0.35 },
      { note: 523.25, dur: 0.70, chord: 174.61 }, // C5
      { note: 440.00, dur: 0.70 },
      { note: 349.23, dur: 0.70 },
      { note: 329.63, dur: 0.70 },
      { note: 293.66, dur: 1.10, chord: 146.83 }, // D4

      // "Happy Birthday to you" (Bb Bb A F G F)
      { note: 466.16, dur: 0.35, chord: 116.54 }, // Bb4
      { note: 466.16, dur: 0.35 },
      { note: 440.00, dur: 0.70 },
      { note: 349.23, dur: 0.70 },
      { note: 392.00, dur: 0.70, chord: 130.81 },
      { note: 349.23, dur: 1.50, chord: 174.61 },
    ];

    const currentMelody = trackName === 'happyBirthday' ? happyBirthdayMelody : godspeedMelody;
    let step = 0;

    const playNextNote = () => {
      if (!this.bgmPlaying || !this.ctx) return;
      if (this.isMuted) {
        this.bgmInterval = window.setTimeout(playNextNote, 400);
        return;
      }

      const item = currentMelody[step % currentMelody.length];
      const now = this.ctx.currentTime;

      // Sound design per track
      if (trackName === 'godspeed') {
        // Soulful Rhodes / Organ Warm Synthesis (Warm Triangle + Soft Sine Harmonics + Sub Bass)
        const leadOsc = this.ctx.createOscillator();
        const sineHarmonic = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        const sineGain = this.ctx.createGain();

        leadOsc.type = 'triangle';
        leadOsc.frequency.setValueAtTime(item.note, now);

        sineHarmonic.type = 'sine';
        sineHarmonic.frequency.setValueAtTime(item.note * 2, now);

        const noteVol = 0.085 * this.volume;
        leadGain.gain.setValueAtTime(0.001, now);
        leadGain.gain.linearRampToValueAtTime(noteVol, now + 0.06);
        leadGain.gain.exponentialRampToValueAtTime(0.0001, now + item.dur * 0.95);

        sineGain.gain.setValueAtTime(0.001, now);
        sineGain.gain.linearRampToValueAtTime(noteVol * 0.25, now + 0.06);
        sineGain.gain.exponentialRampToValueAtTime(0.0001, now + item.dur * 0.95);

        leadOsc.connect(leadGain);
        sineHarmonic.connect(sineGain);
        leadGain.connect(this.ctx.destination);
        sineGain.connect(this.ctx.destination);

        leadOsc.start(now);
        sineHarmonic.start(now);
        leadOsc.stop(now + item.dur);
        sineHarmonic.stop(now + item.dur);

        if (item.chord) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(item.chord, now);

          bassGain.gain.setValueAtTime(0.001, now);
          bassGain.gain.linearRampToValueAtTime(0.05 * this.volume, now + 0.1);
          bassGain.gain.exponentialRampToValueAtTime(0.0001, now + item.dur * 1.8);

          bassOsc.connect(bassGain);
          bassGain.connect(this.ctx.destination);

          bassOsc.start(now);
          bassOsc.stop(now + item.dur * 1.8);
        }
      } else {
        // Upbeat, cute chiptune arcade Happy Birthday synth
        const osc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const subGain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.note, now);

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(item.note / 2, now);

        const noteVol = 0.09 * this.volume;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(noteVol, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + item.dur * 0.9);

        subGain.gain.setValueAtTime(0.001, now);
        subGain.gain.linearRampToValueAtTime(noteVol * 0.35, now + 0.04);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + item.dur * 0.9);

        osc.connect(gain);
        subOsc.connect(subGain);
        gain.connect(this.ctx.destination);
        subGain.connect(this.ctx.destination);

        osc.start(now);
        subOsc.start(now);
        osc.stop(now + item.dur);
        subOsc.stop(now + item.dur);

        if (item.chord) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(item.chord, now);

          bassGain.gain.setValueAtTime(0.001, now);
          bassGain.gain.linearRampToValueAtTime(0.04 * this.volume, now + 0.05);
          bassGain.gain.exponentialRampToValueAtTime(0.0001, now + item.dur);

          bassOsc.connect(bassGain);
          bassGain.connect(this.ctx.destination);

          bassOsc.start(now);
          bassOsc.stop(now + item.dur);
        }
      }

      step++;
      const nextDelay = item.dur * 1000;
      this.bgmInterval = window.setTimeout(playNextNote, nextDelay);
    };

    playNextNote();
  }

  public getTrackTitle(): string {
    return this.currentTrack === 1 ? "Happy Birthday to You 🎂👑" : "Frank Ocean - Godspeed 🕊️🎹";
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
