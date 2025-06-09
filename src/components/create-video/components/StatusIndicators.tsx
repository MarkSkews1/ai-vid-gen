import React from 'react';
import { Scene } from '@/types/video';
import { AudioValidationState } from '../types/videoPlayer';
import { isMobileDevice } from '../utils/audioUtils';

interface StatusIndicatorsProps {
  activeScene: Scene;
  activeIndex: number;
  audioValidationStatus: AudioValidationState;
  autoplaySupported: boolean | null;
  onFixAudioSync: () => void;
}

export const StatusIndicators: React.FC<StatusIndicatorsProps> = ({
  activeScene,
  activeIndex,
  audioValidationStatus,
  autoplaySupported,
  onFixAudioSync,
}) => {
  return (
    <div className='flex items-center gap-2 flex-wrap'>
      {/* No audio indicator */}
      {!activeScene.audio && (
        <div className='text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200'>
          No audio available for this scene - will auto-advance
        </div>
      )}

      {/* Audio validation status */}
      {activeScene.audio && audioValidationStatus[activeIndex] && (
        <div
          className={`text-xs px-2 py-1 rounded-full border ${
            audioValidationStatus[activeIndex] === 'valid'
              ? 'text-green-600 bg-green-50 border-green-200'
              : audioValidationStatus[activeIndex] === 'invalid'
              ? 'text-red-600 bg-red-50 border-red-200'
              : audioValidationStatus[activeIndex] === 'error'
              ? 'text-orange-600 bg-orange-50 border-orange-200'
              : 'text-gray-600 bg-gray-50 border-gray-200'
          }`}
        >
          Audio:{' '}
          {audioValidationStatus[activeIndex] === 'valid'
            ? '✓ Ready'
            : audioValidationStatus[activeIndex] === 'invalid'
            ? '⚠ Issues'
            : audioValidationStatus[activeIndex] === 'error'
            ? '✗ Error'
            : 'Checking...'}
        </div>
      )}

      {/* Autoplay support indicator */}
      {autoplaySupported === false && (
        <div className='text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200'>
          ⓘ{' '}
          {isMobileDevice()
            ? 'Tap play to start audio'
            : 'Click play to start audio'}
        </div>
      )}

      {/* Audio troubleshooting button */}
      {activeScene.audio && (
        <button
          onClick={onFixAudioSync}
          className='text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200 hover:bg-blue-100'
          title="Click if you can't hear any audio or if audio is out of sync"
        >
          Fix Audio/Sync Issues
        </button>
      )}
    </div>
  );
};
