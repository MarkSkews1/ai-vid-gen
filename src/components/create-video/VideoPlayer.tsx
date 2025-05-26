'use client';

import React from 'react';
import RemotionVideoPlayer from './RemotionVideoPlayer';
import { Scene } from '@/types/video';

interface VideoPlayerProps {
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

// This component now uses the RemotionVideoPlayer instead of the custom implementation
export default function VideoPlayer({ scene }: VideoPlayerProps) {
  return <RemotionVideoPlayer scene={scene} />;
}
