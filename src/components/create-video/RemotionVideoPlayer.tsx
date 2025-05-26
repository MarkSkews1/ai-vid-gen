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
  const [duration, setDuration] = useState<number>(0);

  // Calculate duration based on the last caption's end time
  useEffect(() => {
    if (scene.captions && scene.captions.length > 0) {
      const lastCaption = scene.captions[scene.captions.length - 1];
      setDuration(Math.ceil(lastCaption.end / 1000)); // Convert ms to seconds
    }
  }, [scene.captions]);

  return (
    <Player
      component={SceneComposition}
      durationInFrames={duration * 30} // 30 fps
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
