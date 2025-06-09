import React from 'react';
import { Scene } from '@/types/video';

interface SceneProgressIndicatorProps {
  scenes: Scene[];
  activeIndex: number;
  offsetTime: number;
  sceneDurations: number[];
  totalDuration: number;
}

export const SceneProgressIndicator: React.FC<SceneProgressIndicatorProps> = ({
  scenes,
  activeIndex,
  offsetTime,
  sceneDurations,
  totalDuration,
}) => {
  return (
    <div className='absolute bottom-4 left-4 right-4 z-20 flex gap-1'>
      {scenes.map((_, index) => {
        const isDone = index < activeIndex;
        const isActive = index === activeIndex;
        const width = `${(sceneDurations[index] / totalDuration) * 100}%`;

        return (
          <div
            key={index}
            className='h-1 rounded-full overflow-hidden transition-all duration-300'
            style={{ width }}
          >
            <div
              className={`h-full ${
                isActive
                  ? 'bg-primary animate-pulse'
                  : isDone
                  ? 'bg-primary/80'
                  : 'bg-gray-300/50'
              }`}
              style={
                isActive
                  ? {
                      width: `${(offsetTime / sceneDurations[index]) * 100}%`,
                    }
                  : { width: isDone ? '100%' : '0%' }
              }
            />
          </div>
        );
      })}
    </div>
  );
};
