import { useCallback, useEffect, useRef } from 'react';
import { PlayerRef } from '@remotion/player';
import { timeToFrame } from '../utils/timeUtils';
import { VideoSyncHookReturn } from '../types/videoPlayer';

interface UseVideoSyncProps {
  isPlaying: boolean;
  currentTime: number;
}

export const useVideoSync = ({
  isPlaying,
  currentTime,
}: UseVideoSyncProps): VideoSyncHookReturn => {
  const playerRef = useRef<PlayerRef | null>(null);
  // Sync Remotion Player with current time
  useEffect(() => {
    if (!playerRef.current) return;

    const frame = timeToFrame(currentTime);
    const currentPlayerFrame = playerRef.current.getCurrentFrame();

    // More aggressive sync threshold for better accuracy
    if (Math.abs(currentPlayerFrame - frame) > 1) {
      console.log(
        `Syncing video: currentTime=${currentTime.toFixed(
          2
        )}s, currentFrame=${currentPlayerFrame}, targetFrame=${frame}, diff=${Math.abs(
          currentPlayerFrame - frame
        )} frames`
      );
      playerRef.current.seekTo(frame);
    }
  }, [currentTime]);
  // Play/pause Remotion Player when isPlaying changes
  useEffect(() => {
    if (!playerRef.current) {
      console.warn('VideoSync: playerRef not available for play/pause control');
      return;
    }

    console.log(`VideoSync: ${isPlaying ? 'Playing' : 'Pausing'} video player`);

    if (isPlaying) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
  }, [isPlaying]);
  // Continuous sync mechanism
  useEffect(() => {
    if (!isPlaying || !playerRef.current) return;

    let syncFrameId: number | null = null;
    let lastSyncTime = 0;

    const checkSync = (timestamp: number) => {
      // Check sync every 500ms when playing
      if (timestamp - lastSyncTime > 500 && playerRef.current) {
        const currentFrame = playerRef.current.getCurrentFrame();
        const expectedFrame = timeToFrame(currentTime);
        const frameDiff = Math.abs(currentFrame - expectedFrame);

        // More aggressive sync threshold for continuous playback
        if (frameDiff > 1) {
          console.log(
            `Continuous resyncing video: currentFrame=${currentFrame} (${
              currentFrame / 30
            }s), expectedFrame=${expectedFrame} (${currentTime.toFixed(
              2
            )}s), diff=${frameDiff} frames (${frameDiff / 30}s)`
          );
          playerRef.current.seekTo(expectedFrame);
        }

        lastSyncTime = timestamp;
      }

      syncFrameId = requestAnimationFrame(checkSync);
    };

    syncFrameId = requestAnimationFrame(checkSync);

    return () => {
      if (syncFrameId !== null) {
        cancelAnimationFrame(syncFrameId);
      }
    };
  }, [isPlaying, currentTime]);
  const syncVideoWithAudio = useCallback(
    (audioTime: number, cumulativeTime: number) => {
      if (!playerRef.current) {
        console.warn('VideoSync: playerRef not available for audio sync');
        return;
      }

      const expectedCurrentTime = cumulativeTime + audioTime;
      const expectedFrame = timeToFrame(expectedCurrentTime);
      const currentFrame = playerRef.current.getCurrentFrame();
      const frameDiff = Math.abs(currentFrame - expectedFrame);

      // More precise sync threshold for audio-driven sync
      if (frameDiff > 2) {
        console.log(
          `Audio-driven sync: audioTime=${audioTime.toFixed(
            2
          )}s, cumulativeTime=${cumulativeTime.toFixed(
            2
          )}s, expectedTime=${expectedCurrentTime.toFixed(
            2
          )}s, currentFrame=${currentFrame}, expectedFrame=${expectedFrame}, diff=${frameDiff} frames`
        );
        playerRef.current.seekTo(expectedFrame);
      }
    },
    []
  );

  return {
    playerRef,
    syncVideoWithAudio,
  };
};
