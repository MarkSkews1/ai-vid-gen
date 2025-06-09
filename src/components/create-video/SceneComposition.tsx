'use client';

import React from 'react';
import Image from 'next/image';
import { Scene } from '@/types/video';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

interface SceneCompositionProps {
  scene: Scene;
  showCaptions: boolean;
  captionStyle: {
    backgroundColor: string;
    textColor: string;
    fontSize: string;
  };
  currentTime?: number; // Add currentTime prop for external sync
}

export const SceneComposition: React.FC<SceneCompositionProps> = React.memo(
  ({ scene, showCaptions, captionStyle, currentTime }) => {
    // Always call hooks unconditionally
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    // Use external currentTime if provided, otherwise use Remotion's time
    const timeInSeconds =
      typeof currentTime === 'number' ? currentTime : frame / fps;

    // Find the caption that corresponds to the current playback time
    const getCurrentCaption = () => {
      if (!showCaptions || !scene.captions || scene.captions.length === 0) {
        return null;
      }
      const timeMs = timeInSeconds * 1000;
      const caption = scene.captions.find(
        (caption) => timeMs >= caption.start && timeMs <= caption.end
      );
      return caption;
    };

    const currentCaption = getCurrentCaption();

    // Debug information (remove in production)
    React.useEffect(() => {
      console.log('SceneComposition render:', {
        timeInSeconds,
        frame,
        showCaptions,
        captionsCount: scene.captions?.length || 0,
        currentCaption: currentCaption?.text || 'none',
        audioSrc: scene.audio || 'none',
      });
    }, [
      timeInSeconds,
      frame,
      showCaptions,
      currentCaption,
      scene.captions,
      scene.audio,
    ]);

    return (
      <AbsoluteFill>
        {/* Background image */}
        {scene.imageUrl && (
          <div className='absolute inset-0 w-full h-full'>
            <Image
              src={scene.imageUrl}
              alt={scene.description || 'Video scene'}
              fill
              className='object-cover'
              unoptimized={true}
              priority={true}
            />
          </div>
        )}{' '}
        {/* Audio handled externally via HTMLAudioElement for synchronization */}
        {/* <Audio src={scene.audio} volume={1} loop={false} /> */}
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
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
                maxWidth: '80%',
                backgroundColor: captionStyle.backgroundColor,
                color: captionStyle.textColor,
                fontSize:
                  captionStyle.fontSize === 'text-lg'
                    ? '1.125rem'
                    : captionStyle.fontSize === 'text-xl'
                    ? '1.25rem'
                    : captionStyle.fontSize === 'text-2xl'
                    ? '1.5rem'
                    : '1rem',
                fontWeight: '600',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                lineHeight: '1.4',
                wordBreak: 'break-word',
              }}
            >
              {currentCaption.text}
            </div>
          </div>
        )}{' '}
      </AbsoluteFill>
    );
  }
);

SceneComposition.displayName = 'SceneComposition';
