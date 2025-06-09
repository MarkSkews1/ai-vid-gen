import React from 'react';
import { Scene } from '@/types/video';

interface AudioPlayerComponentProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  activeScene: Scene;
  activeIndex: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onTimeUpdate: (e: React.SyntheticEvent<HTMLAudioElement>) => void;
  onEnded: () => void;
}

export const AudioPlayerComponent: React.FC<AudioPlayerComponentProps> = ({
  audioRef,
  activeScene,
  activeIndex,
  isPlaying,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
}) => {
  if (!activeScene.audio) {
    return (
      <div className='w-full h-10 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500'>
        Audio not available for this scene
      </div>
    );
  }
  return (
    <audio
      ref={audioRef}
      className='w-full'
      controls
      src={activeScene.audio}
      key={`audio-${activeIndex}`}
      muted={false}
      onPlay={onPlay}
      onPause={onPause}
      onTimeUpdate={onTimeUpdate}
      onSeeked={onTimeUpdate}
      onEnded={onEnded}
      preload='auto'
      playsInline
      onError={(e) => {
        console.error('Audio error:', e);
        const audio = e.currentTarget;
        if (audio.error && audio.error.code) {
          console.log(`Audio error code: ${audio.error.code}`);
          setTimeout(() => {
            const currentSrc = audio.src;
            audio.src = '';
            audio.src = currentSrc;
            if (isPlaying) {
              audio
                .play()
                .catch((err) =>
                  console.error('Failed to restart audio after error:', err)
                );
            }
          }, 1000);
        }
      }}
    />
  );
};
