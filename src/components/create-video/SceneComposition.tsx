'use client';

import Image from 'next/image';
import { Scene } from '@/types/video';

interface SceneCompositionProps {
  scene: Scene;
  currentTime?: number;
  showCaptions: boolean;
  captionStyle: {
    backgroundColor: string;
    textColor: string;
    fontSize: string;
  };
}

export const SceneComposition: React.FC<SceneCompositionProps> = ({
  scene,
  currentTime,
  showCaptions,
  captionStyle,
}) => {
  // Find the caption that corresponds to the current playback time
  const getCurrentCaption = () => {
    if (!showCaptions || !scene.captions || scene.captions.length === 0) {
      return null;
    } // Find caption that contains the current time (in milliseconds)
    if (typeof currentTime !== 'number') {
      return null;
    }
    const timeMs = currentTime * 1000;
    return scene.captions.find(
      (caption) => timeMs >= caption.start && timeMs <= caption.end
    );
  };

  const currentCaption = getCurrentCaption();

  return (
    <div className='absolute inset-0 w-full h-full'>
      {/* Background image */}
      {scene.imageUrl && (
        <Image
          src={scene.imageUrl}
          alt={scene.description || 'Video scene'}
          fill
          className='object-cover'
        />
      )}

      {/* Captions overlay */}
      {currentCaption && (
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              textAlign: 'center',
              maxWidth: '80%',
              backgroundColor: captionStyle.backgroundColor,
              color: captionStyle.textColor,
            }}
            className={captionStyle.fontSize}
          >
            {currentCaption.text}
          </div>
        </div>
      )}
    </div>
  );
};
