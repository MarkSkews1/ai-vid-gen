/**
 * Audio-related utility functions and constants
 */

export enum AudioValidationStatus {
  PENDING = 'pending',
  VALID = 'valid',
  INVALID = 'invalid',
  ERROR = 'error',
}

export interface AudioPlaybackOptions {
  targetTime?: number;
  retryCount?: number;
  maxRetries?: number;
}

/**
 * Check if device is mobile
 */
export const isMobileDevice = (): boolean => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
};

/**
 * Ensure audio plays with proper error handling and retry logic
 */
export const ensureAudioPlays = async (
  audioElement: HTMLAudioElement,
  options: AudioPlaybackOptions = {}
): Promise<boolean> => {
  const { targetTime = 0, retryCount = 0, maxRetries = 3 } = options;

  if (!audioElement) return false;

  try {
    // Set basic audio properties
    audioElement.muted = false;
    audioElement.volume = 1.0;
    audioElement.currentTime = targetTime;

    // Check for crossOrigin support if not already set
    if (!audioElement.crossOrigin) {
      audioElement.crossOrigin = 'anonymous';
    }

    // Mobile-specific optimizations
    if (isMobileDevice()) {
      (
        audioElement as HTMLAudioElement & { playsInline: boolean }
      ).playsInline = true;
    }

    // Handle existing errors
    if (audioElement.error) {
      const errorCode = audioElement.error.code;
      if (errorCode === MediaError.MEDIA_ERR_NETWORK) {
        console.warn('Network error detected, attempting reload');
        const currentSrc = audioElement.src;
        audioElement.src = '';
        audioElement.load();
        audioElement.src = currentSrc;
        audioElement.load();
      } else if (errorCode === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        console.error('Audio format not supported');
        return false;
      }
    }

    // Attempt to play
    await audioElement.play();
    return true;
  } catch (error: unknown) {
    console.error(`Audio play attempt ${retryCount + 1} failed:`, error);

    const err = error as Error;
    if (err.name === 'NotAllowedError') {
      // Autoplay policy violation
      if (retryCount === 0) {
        console.log('Autoplay blocked - user interaction required');
        // Dispatch custom event for UI feedback
        const event = new CustomEvent('audioAutoplayBlocked', {
          detail: { message: 'Click to enable audio playback' },
        });
        document.dispatchEvent(event);
      }
      return false;
    }

    // Retry with exponential backoff
    if (retryCount < maxRetries) {
      const delay = 300 * Math.pow(2, retryCount);
      console.log(`Retrying audio playback in ${delay}ms`);

      return new Promise((resolve) => {
        setTimeout(async () => {
          const result = await ensureAudioPlays(audioElement, {
            ...options,
            retryCount: retryCount + 1,
          });
          resolve(result);
        }, delay);
      });
    }

    return false;
  }
};

/**
 * Validate audio source with timeout
 */
export const validateAudioSource = (
  audioSrc: string,
  timeout = 5000
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const tempAudio = document.createElement('audio');
    tempAudio.crossOrigin = 'anonymous';

    const timeoutId = setTimeout(() => {
      tempAudio.remove();
      reject(new Error('Audio validation timeout'));
    }, timeout);

    tempAudio.addEventListener(
      'canplaythrough',
      () => {
        clearTimeout(timeoutId);
        tempAudio.remove();
        resolve(true);
      },
      { once: true }
    );

    tempAudio.addEventListener(
      'error',
      (e) => {
        clearTimeout(timeoutId);
        tempAudio.remove();
        reject(e);
      },
      { once: true }
    );

    tempAudio.src = audioSrc;
    tempAudio.load();
  });
};

/**
 * Test autoplay capability
 */
export const testAutoplaySupport = async (): Promise<boolean> => {
  try {
    const audio = document.createElement('audio');
    audio.src =
      'data:audio/mpeg;base64,/+MYxAAAAANIAAAAAExBTUUzLjk4LjIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    audio.volume = 0;
    (audio as HTMLAudioElement & { playsInline: boolean }).playsInline = true;
    audio.crossOrigin = 'anonymous';

    await audio.play();
    audio.remove();
    return true;
  } catch {
    return false;
  }
};
