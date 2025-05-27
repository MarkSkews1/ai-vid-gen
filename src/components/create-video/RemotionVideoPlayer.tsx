'use client';

import { Player } from '@remotion/player';
import { Scene } from '@/types/video';
import { SceneComposition } from './SceneComposition';
import { useEffect, useState } from 'react';

interface RemotionVideoPlayerProps {
  scene: Scene & {
    captionSettings?: {
      enabled: boolean;
      style: {
        backgroundColor: string;
        textColor: string;
        fontSize: string;
      };
    };
  };
}

export default function RemotionVideoPlayer({
  scene,
}: RemotionVideoPlayerProps) {
  const [duration, setDuration] = useState<number>(5); // Default to 5 seconds

  // Calculate duration based on the last caption's end time
  useEffect(() => {
    if (scene.captions && scene.captions.length > 0) {
      const lastCaption = scene.captions[scene.captions.length - 1];
      const calculatedDuration = Math.ceil(lastCaption.end / 1000); // Convert ms to seconds
      setDuration(calculatedDuration > 0 ? calculatedDuration : 5); // Ensure positive duration
    }
  }, [scene.captions]);

  // Ensure we always have a positive duration (minimum 5 seconds)
  const videoDuration = Math.max(duration, 5);

  return (
    <Player
      component={SceneComposition}
      durationInFrames={videoDuration * 30} // 30 fps
      compositionWidth={1280}
      compositionHeight={720}
      fps={30}
      style={{
        width: '100%',
        height: 'auto',
        aspectRatio: '16/9',
      }}
      inputProps={{
        scene,
        showCaptions: scene.captionSettings?.enabled ?? true,
        captionStyle: scene.captionSettings?.style ?? {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          textColor: 'white',
          fontSize: 'text-lg',
        },
      }}
    />
  );
}
