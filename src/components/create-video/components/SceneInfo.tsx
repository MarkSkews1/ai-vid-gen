import React from 'react';
import { Scene } from '@/types/video';
import { formatTime } from '../utils/timeUtils';

interface SceneInfoProps {
  activeScene: Scene;
  activeIndex: number;
  totalScenes: number;
  currentTime: number;
  totalDuration: number;
}

export const SceneInfo: React.FC<SceneInfoProps> = ({
  activeScene,
  activeIndex,
  totalScenes,
  currentTime,
  totalDuration,
}) => {
  return (
    <div className='flex justify-between items-center mb-2'>
      <div className='font-medium'>
        {activeScene.description || `Scene ${activeIndex + 1}`}
      </div>
      <div className='text-xs text-gray-500'>
        Scene {activeIndex + 1} of {totalScenes} • {formatTime(currentTime)} /{' '}
        {formatTime(totalDuration)}
      </div>
    </div>
  );
};
