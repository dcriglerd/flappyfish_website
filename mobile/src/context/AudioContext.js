import React, { createContext, useContext } from 'react';
import useGameAudio from '../hooks/useGameAudio';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audio = useGameAudio();

  return (
    <AudioContext.Provider value={audio}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};
