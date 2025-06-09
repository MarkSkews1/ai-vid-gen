import { useCallback, useEffect, useRef, useState } from 'react';
import { Scene } from '@/types/video';
import {
  AudioValidationStatus,
  ensureAudioPlays,
  validateAudioSource,
  testAutoplaySupport,
} from '../utils/audioUtils';
import { AudioValidationState } from '../types/videoPlayer';

interface UseAudioPlayerProps {
  scenes: Scene[];
  isPlaying: boolean;
  activeIndex: number;
  offsetTime: number;
  cumulativeTime: number;
  onTimeUpdate: (time: number) => void;
  onSceneEnd: () => void;
}

export interface AudioPlayerHookReturn {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioValidationStatus: AudioValidationState;
  autoplaySupported: boolean | null;
  handleTimeUpdate: (e: React.SyntheticEvent<HTMLAudioElement>) => void;
  handleAudioEnded: () => void;
  fixAudioSync: () => void;
}

export const useAudioPlayer = ({
  scenes,
  isPlaying,
  activeIndex,
  offsetTime,
  cumulativeTime,
  onTimeUpdate,
  onSceneEnd,
}: UseAudioPlayerProps): AudioPlayerHookReturn => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioValidationStatus, setAudioValidationStatus] =
    useState<AudioValidationState>({});
  const [autoplaySupported, setAutoplaySupported] = useState<boolean | null>(
    null
  );

  // Validate audio sources on component mount
  useEffect(() => {
    const validateAudioSources = async () => {
      console.log('Starting audio validation for all scenes');

      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        if (!scene.audio) continue;

        setAudioValidationStatus((prev) => ({
          ...prev,
          [i]: AudioValidationStatus.PENDING,
        }));

        try {
          await validateAudioSource(scene.audio);
          setAudioValidationStatus((prev) => ({
            ...prev,
            [i]: AudioValidationStatus.VALID,
          }));
          console.log(`Audio validation successful for scene ${i + 1}`);
        } catch (error) {
          console.error(`Audio validation failed for scene ${i + 1}:`, error);
          setAudioValidationStatus((prev) => ({
            ...prev,
            [i]: AudioValidationStatus.ERROR,
          }));
        }
      }
    };

    validateAudioSources();
  }, [scenes]);

  // Test autoplay support
  useEffect(() => {
    const checkAutoplay = async () => {
      const supported = await testAutoplaySupport();
      setAutoplaySupported(supported);

      if (supported) {
        document.documentElement.classList.remove('no-autoplay');
        console.log('Autoplay is supported');
      } else {
        document.documentElement.classList.add('no-autoplay');
        console.log('Autoplay not supported - user interaction required');
      }
    };

    const handleAutoplayBlocked = (event: CustomEvent) => {
      console.log('Autoplay blocked event received:', event.detail);
      setAutoplaySupported(false);
    };

    document.addEventListener(
      'audioAutoplayBlocked',
      handleAutoplayBlocked as EventListener
    );
    checkAutoplay();

    return () => {
      document.removeEventListener(
        'audioAutoplayBlocked',
        handleAutoplayBlocked as EventListener
      );
    };
  }, []);
  // Handle audio element for current scene
  useEffect(() => {
    console.log('useAudioPlayer effect triggered:', {
      hasAudioRef: !!audioRef.current,
      isPlaying,
      activeIndex,
      offsetTime,
      sceneAudio: scenes[activeIndex]?.audio,
    });

    if (!audioRef.current) return;

    const currentScene = scenes[activeIndex];
    if (currentScene && currentScene.audio) {
      const wasPlaying = isPlaying;
      const audioElement = audioRef.current;

      const handleCanPlay = () => {
        console.log('Audio canplay event triggered');
        if (audioElement) {
          audioElement.currentTime = offsetTime;
          audioElement.muted = false;
          audioElement.volume = 1.0;

          if (wasPlaying) {
            console.log('Attempting to play audio from canplay handler');
            ensureAudioPlays(audioElement, { targetTime: offsetTime }).then(
              (success) => {
                if (!success) {
                  console.log(
                    'Audio autoplay failed after scene change - user interaction may be required'
                  );
                }
              }
            );
          }
        }
      };

      audioElement.removeEventListener('canplay', handleCanPlay);
      audioElement.addEventListener('canplay', handleCanPlay);

      if (isPlaying) {
        console.log('Setting up audio playback with timeout');
        setTimeout(() => {
          if (audioElement) {
            audioElement.muted = false;
            audioElement.volume = 1.0;
            console.log('Attempting to play audio from timeout');
            ensureAudioPlays(audioElement, { targetTime: offsetTime });
          }
        }, 100);
      } else {
        console.log('Pausing audio element');
        audioElement.pause();
      }

      return () => {
        audioElement.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [isPlaying, activeIndex, offsetTime, scenes]);

  // Audio recovery monitoring
  useEffect(() => {
    if (!isPlaying || !scenes[activeIndex]?.audio) return;

    let lastPlaybackPosition = audioRef.current?.currentTime || 0;
    let stuckCounter = 0;

    const audioCheckInterval = setInterval(() => {
      if (!audioRef.current) return;

      const currentPosition = audioRef.current.currentTime;
      const hasProgressed =
        Math.abs(currentPosition - lastPlaybackPosition) > 0.01;

      if (
        isPlaying &&
        ((audioRef.current.paused && !audioRef.current.ended) ||
          (!hasProgressed && stuckCounter > 2))
      ) {
        console.log('Audio playback issue detected, attempting to recover');

        const currentTime = audioRef.current.currentTime;
        audioRef.current.currentTime = currentTime + 0.01;
        audioRef.current.muted = false;
        audioRef.current.volume = 1.0;

        ensureAudioPlays(audioRef.current, { targetTime: currentTime }).then(
          (success) => {
            if (!success && stuckCounter > 5) {
              console.log(
                'Audio recovery failed multiple times - may need user interaction'
              );
            }
          }
        );
      }

      if (hasProgressed) {
        stuckCounter = 0;
      } else {
        stuckCounter++;
      }
      lastPlaybackPosition = currentPosition;
    }, 300);

    return () => clearInterval(audioCheckInterval);
  }, [isPlaying, activeIndex, scenes]);

  const handleTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLAudioElement>) => {
      const audioTime = e.currentTarget.currentTime;
      const newCurrentTime = cumulativeTime + audioTime;
      onTimeUpdate(newCurrentTime);
    },
    [cumulativeTime, onTimeUpdate]
  );

  const handleAudioEnded = useCallback(() => {
    console.log(`Scene ${activeIndex + 1} audio ended, moving to next scene`);
    onSceneEnd();
  }, [activeIndex, onSceneEnd]);

  const fixAudioSync = useCallback(() => {
    if (audioRef.current) {
      document.documentElement.classList.remove('no-autoplay');
      audioRef.current.muted = false;
      audioRef.current.volume = 1.0;

      const wasPlaying = !audioRef.current.paused;
      audioRef.current.pause();

      const targetAudioTime = offsetTime;
      audioRef.current.currentTime = targetAudioTime;

      if (wasPlaying || !isPlaying) {
        ensureAudioPlays(audioRef.current, {
          targetTime: targetAudioTime,
        }).then((success) => {
          if (!success) {
            alert(
              'Unable to play audio. Please try clicking elsewhere on the page first, then try again.'
            );
          }
        });
      }
    }
  }, [offsetTime, isPlaying]);

  return {
    audioRef,
    audioValidationStatus,
    autoplaySupported,
    handleTimeUpdate,
    handleAudioEnded,
    fixAudioSync,
  };
};
