import { useRef, useCallback, useEffect } from 'react';
import { Audio } from 'expo-av';

// Pre-load sound assets
const SOUNDS = {
  flap: require('../../assets/sounds/flap.wav'),
  coin: require('../../assets/sounds/coin.wav'),
  score: require('../../assets/sounds/score.wav'),
  gameover: require('../../assets/sounds/gameover.wav'),
};

/**
 * Custom hook for game audio using expo-av
 * Provides sound effects for game events
 */
const useGameAudio = () => {
  const loadedSoundsRef = useRef({});
  const isMutedRef = useRef(false);
  const isInitializedRef = useRef(false);

  // Initialize audio mode and preload sounds
  useEffect(() => {
    let mounted = true;

    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
        
        // Preload all sounds
        for (const [key, source] of Object.entries(SOUNDS)) {
          try {
            const { sound } = await Audio.Sound.createAsync(source, { volume: 0.5 });
            if (mounted) {
              loadedSoundsRef.current[key] = sound;
            }
          } catch (e) {
            console.log(`[Audio] Failed to load ${key}:`, e.message);
          }
        }
        
        if (mounted) {
          isInitializedRef.current = true;
          console.log('[Audio] Initialized with sounds:', Object.keys(loadedSoundsRef.current));
        }
      } catch (error) {
        console.log('[Audio] Init error:', error);
      }
    };

    initAudio();

    return () => {
      mounted = false;
      // Cleanup sounds on unmount
      Object.values(loadedSoundsRef.current).forEach(async (sound) => {
        try {
          await sound.unloadAsync();
        } catch (e) {}
      });
      loadedSoundsRef.current = {};
    };
  }, []);

  // Helper to play a preloaded sound
  const playSound = useCallback(async (soundKey, volume = 0.5) => {
    if (isMutedRef.current) return;
    
    const sound = loadedSoundsRef.current[soundKey];
    if (!sound) {
      console.log(`[Audio] Sound ${soundKey} not loaded`);
      return;
    }
    
    try {
      await sound.setPositionAsync(0);
      await sound.setVolumeAsync(volume);
      await sound.playAsync();
    } catch (error) {
      console.log(`[Audio] Error playing ${soundKey}:`, error.message);
    }
  }, []);

  // Play flap/swim sound - bubble bloop
  const playFlapSound = useCallback(() => {
    playSound('flap', 0.4);
  }, [playSound]);

  // Play score sound - cheerful ding
  const playScoreSound = useCallback(() => {
    playSound('score', 0.5);
  }, [playSound]);

  // Play coin collect sound - sparkly
  const playCoinSound = useCallback(() => {
    playSound('coin', 0.5);
  }, [playSound]);

  // Play game over sound - sad descending tone
  const playGameOverSound = useCallback(() => {
    playSound('gameover', 0.6);
  }, [playSound]);

  // Set muted state
  const setMuted = useCallback((muted) => {
    isMutedRef.current = muted;
  }, []);

  // Check if muted
  const isMuted = useCallback(() => {
    return isMutedRef.current;
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    isMutedRef.current = !isMutedRef.current;
    return isMutedRef.current;
  }, []);

  return {
    playFlapSound,
    playScoreSound,
    playCoinSound,
    playGameOverSound,
    setMuted,
    isMuted,
    toggleMute,
  };
};

export default useGameAudio;
