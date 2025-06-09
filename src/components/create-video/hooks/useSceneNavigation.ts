import { useCallback, useEffect, useState } from 'react';
import { Scene } from '@/types/video';
import {
  calculateSceneDurations,
  calculateActiveScene,
} from '../utils/timeUtils';
import {
  SceneCalculation,
  SceneNavigationHookReturn,
} from '../types/videoPlayer';

interface UseSceneNavigationProps {
  scenes: Scene[];
  isPlaying: boolean;
}

export const useSceneNavigation = ({
  scenes,
  isPlaying,
}: UseSceneNavigationProps): SceneNavigationHookReturn => {
  const [currentTime, setCurrentTime] = useState(0);

  const sceneDurations = calculateSceneDurations(scenes);
  const totalDuration = sceneDurations.reduce((a, b) => a + b, 0);
  const { activeIndex, offsetTime, cumulativeTime } = calculateActiveScene(
    currentTime,
    sceneDurations
  );
  const activeScene = scenes[activeIndex];

  const sceneCalculation: SceneCalculation = {
    activeIndex,
    offsetTime,
    cumulativeTime,
    sceneDurations,
    totalDuration,
    activeScene,
  };

  // Debug scene transitions
  useEffect(() => {
    console.log(
      `Switched to scene ${activeIndex + 1} at time ${currentTime.toFixed(
        2
      )}s, offset: ${offsetTime.toFixed(2)}s`
    );
    console.log(`Scene has audio: ${Boolean(activeScene.audio)}`);
  }, [activeIndex, currentTime, offsetTime, activeScene.audio]);

  // Auto-advance scenes with no audio
  useEffect(() => {
    if (isPlaying && (!activeScene.audio || activeScene.audio.trim() === '')) {
      if (activeIndex < scenes.length - 1) {
        console.log(
          `Scene ${activeIndex + 1} has no audio, will auto-advance after ${
            sceneDurations[activeIndex]
          }s`
        );

        const sceneTimeout = setTimeout(() => {
          const nextSceneStartTime =
            cumulativeTime + sceneDurations[activeIndex];
          setCurrentTime(nextSceneStartTime);
        }, sceneDurations[activeIndex] * 1000);

        return () => clearTimeout(sceneTimeout);
      }
    }
  }, [
    activeIndex,
    activeScene,
    isPlaying,
    sceneDurations,
    cumulativeTime,
    scenes.length,
  ]);

  const goToNextScene = useCallback(() => {
    if (activeIndex < scenes.length - 1) {
      const nextSceneStartTime = cumulativeTime + sceneDurations[activeIndex];
      console.log(`Moving to next scene at time ${nextSceneStartTime}s`);
      setCurrentTime(nextSceneStartTime);
    } else {
      console.log('Reached end of all scenes');
      setCurrentTime(totalDuration);
    }
  }, [
    activeIndex,
    scenes.length,
    cumulativeTime,
    sceneDurations,
    totalDuration,
  ]);

  return {
    sceneCalculation,
    goToNextScene,
    setCurrentTime,
  };
};
