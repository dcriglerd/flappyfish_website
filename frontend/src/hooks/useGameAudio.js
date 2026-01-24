import { useRef, useEffect, useCallback } from 'react';

// Generate audio tones using Web Audio API
const useGameAudio = () => {
  const audioContextRef = useRef(null);
  const isMutedRef = useRef(false);
  const bgMusicIntervalRef = useRef(null);
  const bgMusicGainRef = useRef(null);

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
    };

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
      if (bgMusicIntervalRef.current) {
        clearInterval(bgMusicIntervalRef.current);
      }
    };
  }, []);

  const playTone = useCallback((frequency, duration, type = 'sine', volume = 0.3) => {
    if (isMutedRef.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, []);

  // Cute bubble/bloop sound for fish flap
  const playFlapSound = useCallback(() => {
    if (isMutedRef.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    
    // Create a fun "bloop" sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    // Start at higher freq and sweep down for bubble effect
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);

    // Add a subtle secondary tone for richness
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(800, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
    gain2.gain.setValueAtTime(0.1, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.1);
  }, []);

  // Score point sound - cheerful ding
  const playScoreSound = useCallback(() => {
    if (isMutedRef.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    
    // Happy arpeggio
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.05 + 0.2);
      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 0.2);
    });
  }, []);

  // Coin collect sound - sparkly
  const playCoinSound = useCallback(() => {
    if (isMutedRef.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  }, []);

  // Game over sound - descending sad tone
  const playGameOverSound = useCallback(() => {
    if (isMutedRef.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }, []);

  // Fun friendly underwater background music
  const startBackgroundMusic = useCallback(() => {
    if (!audioContextRef.current) return;
    if (bgMusicIntervalRef.current) return; // Already playing

    const ctx = audioContextRef.current;
    
    // Create master gain for music
    bgMusicGainRef.current = ctx.createGain();
    bgMusicGainRef.current.connect(ctx.destination);
    bgMusicGainRef.current.gain.setValueAtTime(isMutedRef.current ? 0 : 0.08, ctx.currentTime);

    // Happy underwater melody notes (pentatonic scale for pleasant sound)
    const melody = [
      { note: 329.63, duration: 0.3 }, // E4
      { note: 392.00, duration: 0.3 }, // G4
      { note: 440.00, duration: 0.3 }, // A4
      { note: 392.00, duration: 0.3 }, // G4
      { note: 329.63, duration: 0.3 }, // E4
      { note: 293.66, duration: 0.3 }, // D4
      { note: 329.63, duration: 0.6 }, // E4
      { note: 0, duration: 0.3 },       // rest
      { note: 392.00, duration: 0.3 }, // G4
      { note: 440.00, duration: 0.3 }, // A4
      { note: 523.25, duration: 0.3 }, // C5
      { note: 440.00, duration: 0.3 }, // A4
      { note: 392.00, duration: 0.3 }, // G4
      { note: 329.63, duration: 0.6 }, // E4
      { note: 0, duration: 0.3 },       // rest
    ];

    let noteIndex = 0;
    let nextNoteTime = ctx.currentTime;

    const playNextNote = () => {
      if (!bgMusicGainRef.current) return;
      
      const { note, duration } = melody[noteIndex];
      
      if (note > 0) {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        
        osc.connect(noteGain);
        noteGain.connect(bgMusicGainRef.current);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, ctx.currentTime);
        
        noteGain.gain.setValueAtTime(0.5, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration * 0.9);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);

        // Add subtle bass
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.connect(bassGain);
        bassGain.connect(bgMusicGainRef.current);
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(note / 2, ctx.currentTime);
        bassGain.gain.setValueAtTime(0.3, ctx.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration * 0.9);
        bassOsc.start(ctx.currentTime);
        bassOsc.stop(ctx.currentTime + duration);
      }
      
      noteIndex = (noteIndex + 1) % melody.length;
    };

    bgMusicIntervalRef.current = setInterval(playNextNote, 300);
    playNextNote();
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    if (bgMusicIntervalRef.current) {
      clearInterval(bgMusicIntervalRef.current);
      bgMusicIntervalRef.current = null;
    }
    bgMusicGainRef.current = null;
  }, []);

  const setMuted = useCallback((muted) => {
    isMutedRef.current = muted;
    if (bgMusicGainRef.current && audioContextRef.current) {
      bgMusicGainRef.current.gain.setValueAtTime(
        muted ? 0 : 0.08, 
        audioContextRef.current.currentTime
      );
    }
  }, []);

  return {
    playFlapSound,
    playScoreSound,
    playCoinSound,
    playGameOverSound,
    startBackgroundMusic,
    stopBackgroundMusic,
    setMuted,
  };
};

export default useGameAudio;
