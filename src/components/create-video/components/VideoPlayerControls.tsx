import React from 'react';
import { Scene } from '@/types/video';
import { AudioValidationState } from '../types/videoPlayer';
import { StatusIndicators } from './StatusIndicators';

interface VideoPlayerControlsProps {
  isPlaying: boolean;
  activeScene: Scene;
  activeIndex: number;
  audioValidationStatus: AudioValidationState;
  autoplaySupported: boolean | null;
  onTogglePlay: () => void;
  onFixAudio: () => void;
}

export const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  isPlaying,
  activeScene,
  activeIndex,
  audioValidationStatus,
  autoplaySupported,
  onTogglePlay,
  onFixAudio,
}) => {
  return (
    <div className='mb-3 flex items-center gap-2'>
      <button
        onClick={onTogglePlay}
        className='p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors'
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-primary'
          >
            <rect x='6' y='4' width='4' height='16'></rect>
            <rect x='14' y='4' width='4' height='16'></rect>
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-primary'
          >
            <polygon points='5 3 19 12 5 21 5 3'></polygon>
          </svg>
        )}
      </button>

      {/* Status indicators */}
      <StatusIndicators
        activeScene={activeScene}
        activeIndex={activeIndex}
        audioValidationStatus={audioValidationStatus}
        autoplaySupported={autoplaySupported}
        onFixAudioSync={onFixAudio}
      />
    </div>
  );
};
