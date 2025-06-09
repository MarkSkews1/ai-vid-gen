// filepath: src/components/create-video/MultiSceneComposition.tsx
'use client';

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene } from '@/types/video';
import { SceneComposition } from './SceneComposition';

interface MultiSceneCompositionProps {
  scenes: Scene[];
  showCaptions: boolean;
  captionStyle: {
    backgroundColor: string;
    textColor: string;
    fontSize: string;
  };
  // Add timing props to sync with audio player
  activeIndex?: number;
  offsetTime?: number;
  sceneDurations?: number[];
}

export const MultiSceneComposition: React.FC<MultiSceneCompositionProps> = (
  props
) => {
  const {
    scenes,
    showCaptions,
    captionStyle,
    activeIndex,
    offsetTime,
    sceneDurations,
  } = props;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Use the timing information passed from parent instead of calculating independently
  // This ensures the video composition is synchronized with the audio player
  console.log(
    `MultiSceneComposition: frame=${frame}, activeIndex=${activeIndex}, offsetTime=${offsetTime}, scenes.length=${
      scenes?.length || 0
    }`
  );

  // Validate that we have scenes
  if (!scenes || scenes.length === 0) {
    console.error('MultiSceneComposition: No scenes provided');
    return <AbsoluteFill />;
  }

  // Fallback calculation if timing props are not provided (shouldn't happen)
  let fallbackActiveIndex = activeIndex;
  let fallbackOffsetTime = offsetTime;

  if (activeIndex === undefined || offsetTime === undefined) {
    console.warn(
      'MultiSceneComposition: Missing timing props, falling back to frame-based calculation'
    );
    const timeInSec = frame / fps;
    const durations =
      sceneDurations ||
      scenes.map((scene) => {
        if (scene.captions && scene.captions.length > 0) {
          const last = scene.captions[scene.captions.length - 1];
          return Math.max(Math.ceil(last.end / 1000), 5);
        }
        return 5;
      });

    let cum = 0;
    fallbackActiveIndex = 0;
    fallbackOffsetTime = 0;
    for (let i = 0; i < durations.length; i++) {
      if (timeInSec < cum + durations[i]) {
        fallbackActiveIndex = i;
        fallbackOffsetTime = timeInSec - cum;
        break;
      }
      cum += durations[i];
    }
  }
  // Use the synchronized timing
  const currentActiveIndex = Math.max(
    0,
    Math.min(fallbackActiveIndex || 0, scenes.length - 1)
  );
  const currentOffsetTime = fallbackOffsetTime || 0;

  // Ensure we have a valid scene
  const currentScene = scenes[currentActiveIndex];
  if (!currentScene) {
    console.error(
      `MultiSceneComposition: No scene found at index ${currentActiveIndex}`
    );
    return <AbsoluteFill />;
  } // render scene composition at offset frame
  return (
    <AbsoluteFill>
      <SceneComposition
        scene={currentScene}
        showCaptions={showCaptions}
        captionStyle={captionStyle}
        currentTime={currentOffsetTime} // Pass offset time for correct scene playback
      />
    </AbsoluteFill>
  );
};
