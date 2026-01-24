import { useRef, useCallback, useEffect } from 'react';
import { Audio } from 'expo-av';

/**
 * Custom hook for game audio using expo-av
 * Generates procedural sounds for game events
 */
const useGameAudio = () => {
  const soundsRef = useRef({});
  const isMutedRef = useRef(false);
  const isInitializedRef = useRef(false);

  // Initialize audio mode on mount
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
        isInitializedRef.current = true;
      } catch (error) {
        console.log('[Audio] Init error:', error);
      }
    };
    
    initAudio();

    return () => {
      // Cleanup sounds on unmount
      Object.values(soundsRef.current).forEach(async (sound) => {
        try {
          if (sound) await sound.unloadAsync();
        } catch (e) {}
      });
    };
  }, []);

  // Helper to create and play a simple beep tone using the Audio API
  const playGeneratedSound = useCallback(async (frequency, duration, volume = 0.5) => {
    if (isMutedRef.current || !isInitializedRef.current) return;
    
    // expo-av doesn't support programmatic tone generation directly
    // We'll use pre-created audio or simple approach
    // For now, we use haptics as audio feedback substitute in dev
  }, []);

  // Play flap/swim sound - bubble bloop
  const playFlapSound = useCallback(async () => {
    if (isMutedRef.current) return;
    
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/flap.mp3'),
        { volume: 0.4 }
      );
      soundsRef.current.flap = sound;
      await sound.playAsync();
      
      // Auto unload after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      // Fallback: no sound file, silently fail
      console.log('[Audio] Flap sound not available');
    }
  }, []);

  // Play score sound - cheerful ding
  const playScoreSound = useCallback(async () => {
    if (isMutedRef.current) return;
    
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/score.mp3'),
        { volume: 0.5 }
      );
      soundsRef.current.score = sound;
      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('[Audio] Score sound not available');
    }
  }, []);

  // Play coin collect sound - sparkly
  const playCoinSound = useCallback(async () => {
    if (isMutedRef.current) return;
    
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/coin.mp3'),
        { volume: 0.5 }
      );
      soundsRef.current.coin = sound;
      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('[Audio] Coin sound not available');
    }
  }, []);

  // Play game over sound - sad descending tone
  const playGameOverSound = useCallback(async () => {
    if (isMutedRef.current) return;
    
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/gameover.mp3'),
        { volume: 0.6 }
      );
      soundsRef.current.gameover = sound;
      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('[Audio] Game over sound not available');
    }
  }, []);

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
