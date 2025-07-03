import React from 'react';
import { Volume2, VolumeX, Music, Music2 as MusicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/contexts/AudioContext';

const AudioControls = () => {
  const { isMusicEnabled, isSoundEnabled, toggleMusic, toggleSound } = useAudio();

  return (
    <div className="fixed top-4 right-4 flex space-x-2 z-50">
      <Button
        onClick={toggleMusic}
        variant="outline"
        size="icon"
      >
        {isMusicEnabled ? <Music className="w-4 h-4" /> : <MusicOff className="w-4 h-4" />}
      </Button>
      <Button
        onClick={toggleSound}
        variant="outline"
        size="icon"
      >
        {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default AudioControls;