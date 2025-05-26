'use client';

import { useEffect, useState } from 'react';
import { Caption } from '@/actions/assemblyai';
import { useVideo } from '@/context/video';
import { Scene } from '@/types/video';

interface VideoCaptionsProps {
  currentTime: number;
  scene?: Scene; // Optional scene parameter for specific scene captions
  style?: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
  };
}

export function VideoCaptions({
  currentTime,
  scene,
  style = {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textColor: 'white',
    fontSize: 'text-lg',
  },
}: VideoCaptionsProps) {
  const { captions: globalCaptions } = useVideo();
  const [currentCaption, setCurrentCaption] = useState<Caption | null>(null);

  // Find the caption that corresponds to the current playback time
  useEffect(() => {
    // Use scene-specific captions if provided, otherwise use global captions
    const captionsToUse = scene?.captions || globalCaptions;

    if (!captionsToUse || captionsToUse.length === 0) {
      setCurrentCaption(null);
      return;
    }

    // Find caption that contains the current time (in milliseconds)
    const timeMs = currentTime * 1000;
    const activeCaption = captionsToUse.find(
      (caption) => timeMs >= caption.start && timeMs <= caption.end
    );

    setCurrentCaption(activeCaption || null);
  }, [currentTime, globalCaptions, scene]);

  if (!currentCaption) {
    return null;
  }

  return (
    <div className='absolute bottom-10 left-0 right-0 flex justify-center'>
      <div
        className={`px-4 py-2 rounded-md text-center max-w-[80%] ${style.fontSize}`}
        style={{
          backgroundColor: style.backgroundColor,
          color: style.textColor,
        }}
      >
        {currentCaption.text}
      </div>
    </div>
  );
}

export default VideoCaptions;
