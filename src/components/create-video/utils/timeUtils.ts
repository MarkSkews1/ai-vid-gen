/**
 * Time-related utility functions for video player
 */

/**
 * Format time in seconds to MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Calculate durations for each scene based on captions
 */
export const calculateSceneDurations = (
  scenes: Array<{ captions?: Array<{ end: number }> }>
): number[] => {
  return scenes.map((scene) => {
    if (scene.captions && scene.captions.length > 0) {
      const last = scene.captions[scene.captions.length - 1];
      return Math.max(Math.ceil(last.end / 1000), 5);
    }
    return 5;
  });
};

/**
 * Calculate active scene index and offset time based on current time
 */
export const calculateActiveScene = (
  currentTime: number,
  sceneDurations: number[]
): { activeIndex: number; offsetTime: number; cumulativeTime: number } => {
  let cum = 0;
  let activeIndex = 0;
  let offsetTime = 0;

  for (let i = 0; i < sceneDurations.length; i++) {
    if (currentTime < cum + sceneDurations[i]) {
      activeIndex = i;
      offsetTime = currentTime - cum;
      break;
    }
    cum += sceneDurations[i];
  }

  return { activeIndex, offsetTime, cumulativeTime: cum };
};

/**
 * Convert time to frame number (30 fps)
 */
export const timeToFrame = (seconds: number): number => {
  return Math.floor(seconds * 30);
};

/**
 * Convert frame number to time (30 fps)
 */
export const frameToTime = (frame: number): number => {
  return frame / 30;
};
