'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Player } from '@remotion/player';
import { MultiSceneComposition } from './MultiSceneComposition';
import { CaptionSettings as CaptionSettingsUI } from './CaptionSettings';

// Import custom hooks
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useVideoSync } from './hooks/useVideoSync';
import { useSceneNavigation } from './hooks/useSceneNavigation';

// Import components
import { SceneProgressIndicator } from './components/SceneProgressIndicator';
import { CaptionControls } from './components/CaptionControls';
import { VideoPlayerControls } from './components/VideoPlayerControls';
import { SceneInfo } from './components/SceneInfo';
import { AudioPlayerComponent } from './components/AudioPlayerComponent';

// Import types
import { VideoPlayerProps, CaptionStyle } from './types/videoPlayer';
import { ensureAudioPlays } from './utils/audioUtils';

export default function MultiSceneVideoPlayer({ scenes }: VideoPlayerProps) {
  // UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>({
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textColor: 'white',
    fontSize: 'text-xl',
  });

  // Scene navigation hook
  const { sceneCalculation, goToNextScene, setCurrentTime } =
    useSceneNavigation({
      scenes,
      isPlaying,
    });

  const {
    activeIndex,
    offsetTime,
    cumulativeTime,
    sceneDurations,
    totalDuration,
    activeScene,
  } = sceneCalculation;

  // Audio player hook
  const {
    audioRef,
    audioValidationStatus,
    autoplaySupported,
    handleTimeUpdate,
    handleAudioEnded,
    fixAudioSync,
  } = useAudioPlayer({
    scenes,
    isPlaying,
    activeIndex,
    offsetTime,
    cumulativeTime,
    onTimeUpdate: setCurrentTime,
    onSceneEnd: () => {
      if (activeIndex < scenes.length - 1) {
        goToNextScene();
        if (!isPlaying) {
          setIsPlaying(true);
        }
      } else {
        setIsPlaying(false);
      }
    },
  }); // Video sync hook
  const { playerRef, syncVideoWithAudio } = useVideoSync({
    isPlaying,
    currentTime: cumulativeTime + offsetTime,
  });

  // Prepare input props for Remotion composition
  const inputProps = useMemo(
    () => ({
      scenes,
      showCaptions,
      captionStyle,
      activeIndex,
      offsetTime,
      sceneDurations,
    }),
    [
      scenes,
      showCaptions,
      captionStyle,
      activeIndex,
      offsetTime,
      sceneDurations,
    ]
  );
  // Enhanced time update handler that includes video sync
  const handleEnhancedTimeUpdate = (
    e: React.SyntheticEvent<HTMLAudioElement>
  ) => {
    handleTimeUpdate(e);
    const audioTime = e.currentTarget.currentTime;
    syncVideoWithAudio(audioTime, cumulativeTime);

    // Additional logging for debugging
    console.log(
      `Audio time update: audioTime=${audioTime.toFixed(
        2
      )}s, cumulativeTime=${cumulativeTime.toFixed(2)}s, totalTime=${(
        cumulativeTime + audioTime
      ).toFixed(2)}s`
    );
  }; // Play/pause toggle with audio handling
  const handleTogglePlay = () => {
    const newPlayingState = !isPlaying;
    console.log(
      `MultiSceneVideoPlayer: Toggling play state from ${isPlaying} to ${newPlayingState}`
    );
    console.log('Active scene:', activeScene);
    console.log('Audio ref current:', audioRef.current);
    console.log('Offset time:', offsetTime);
    console.log(
      'Current time (cumulative + offset):',
      cumulativeTime + offsetTime
    );

    // Safety check: ensure we have a valid scene with audio
    if (!activeScene || !activeScene.audio) {
      console.warn('Cannot play: no active scene or audio source');
      return;
    }

    // Update playing state first
    setIsPlaying(newPlayingState);

    if (newPlayingState && audioRef.current) {
      console.log('Attempting to play audio...');
      // Immediate audio play attempt
      audioRef.current.muted = false;
      audioRef.current.volume = 1.0;
      audioRef.current.currentTime = offsetTime;

      // Sync video player to current time before starting playback
      if (playerRef.current) {
        const targetFrame = Math.floor((cumulativeTime + offsetTime) * 30);
        console.log(
          `Syncing video to frame ${targetFrame} before starting playback`
        );
        playerRef.current.seekTo(targetFrame);
      }

      // Use the ensureAudioPlays utility for better error handling
      ensureAudioPlays(audioRef.current, { targetTime: offsetTime })
        .then((success: boolean) => {
          if (!success) {
            console.warn(
              'Audio playback failed - user interaction may be required'
            );
            // If audio fails, also pause the video
            setIsPlaying(false);
          } else {
            console.log('Audio playback started successfully');
          }
        })
        .catch((error: unknown) => {
          console.error('Error starting audio playback:', error);
          setIsPlaying(false);
        });
    } else if (!newPlayingState && audioRef.current) {
      console.log('Pausing audio...');
      // Pause audio
      audioRef.current.pause();
    } else if (newPlayingState && !audioRef.current) {
      console.warn('Cannot play: audio ref not available');
      setIsPlaying(false);
    }
  };

  // Initialization effect to ensure video player is properly set up
  useEffect(() => {
    console.log('MultiSceneVideoPlayer: Component initialized with', {
      totalScenes: scenes.length,
      totalDuration,
      activeIndex,
      activeScene: activeScene?.id || 'none',
      hasAudio: !!activeScene?.audio,
      isPlaying,
    });

    // Ensure video player starts at the correct position
    if (playerRef.current) {
      const initialFrame = Math.floor((cumulativeTime + offsetTime) * 30);
      console.log(`Setting initial video frame to ${initialFrame}`);
      playerRef.current.seekTo(initialFrame);

      // Ensure player is paused initially
      if (!isPlaying) {
        playerRef.current.pause();
      }
    }
  }, [
    scenes.length,
    totalDuration,
    activeIndex,
    activeScene?.id,
    activeScene?.audio,
    isPlaying,
    cumulativeTime,
    offsetTime,
    playerRef,
  ]); // Run with all dependencies

  // Effect to handle scene transitions and ensure video stays in sync
  useEffect(() => {
    console.log(
      `Scene transition: activeIndex=${activeIndex}, offsetTime=${offsetTime.toFixed(
        2
      )}s, cumulativeTime=${cumulativeTime.toFixed(2)}s`
    );

    if (playerRef.current) {
      const targetFrame = Math.floor((cumulativeTime + offsetTime) * 30);
      const currentFrame = playerRef.current.getCurrentFrame();
      const frameDiff = Math.abs(currentFrame - targetFrame);

      // Sync video on scene transitions
      if (frameDiff > 1) {
        console.log(
          `Scene transition sync: currentFrame=${currentFrame}, targetFrame=${targetFrame}, diff=${frameDiff}`
        );
        playerRef.current.seekTo(targetFrame);
      }
    }
  }, [activeIndex, cumulativeTime, offsetTime, playerRef]);
  // Debug effect to monitor video player state
  useEffect(() => {
    if (playerRef.current) {
      console.log('Video player state:', {
        isPlaying,
        currentFrame: playerRef.current.getCurrentFrame(),
        expectedFrame: Math.floor((cumulativeTime + offsetTime) * 30),
        totalFrames: totalDuration * 30,
      });
    }
  }, [
    isPlaying,
    activeIndex,
    cumulativeTime,
    offsetTime,
    playerRef,
    totalDuration,
  ]);

  return (
    <div className='relative rounded-xl overflow-hidden border border-gray-200 shadow-md'>
      {' '}
      {/* Remotion Player */}
      <div className='w-full aspect-video'>
        {' '}
        <Player
          ref={playerRef}
          component={MultiSceneComposition}
          durationInFrames={totalDuration * 30}
          compositionWidth={1280}
          compositionHeight={720}
          fps={30}
          style={{ width: '100%', height: '100%' }}
          autoPlay={false}
          loop={false}
          inputProps={inputProps}
          controls={false}
        />
      </div>
      {/* Scene progress indicator */}
      <SceneProgressIndicator
        scenes={scenes}
        activeIndex={activeIndex}
        offsetTime={offsetTime}
        sceneDurations={sceneDurations}
        totalDuration={totalDuration}
      />
      {/* Caption controls */}
      <CaptionControls
        showCaptions={showCaptions}
        onToggleCaptions={setShowCaptions}
      />
      {/* Scene details and controls */}
      <div className='p-4 bg-white'>
        <SceneInfo
          activeScene={activeScene}
          activeIndex={activeIndex}
          totalScenes={scenes.length}
          currentTime={cumulativeTime + offsetTime}
          totalDuration={totalDuration}
        />

        {/* Main player controls */}
        <VideoPlayerControls
          isPlaying={isPlaying}
          activeScene={activeScene}
          activeIndex={activeIndex}
          audioValidationStatus={audioValidationStatus}
          autoplaySupported={autoplaySupported}
          onTogglePlay={handleTogglePlay}
          onFixAudio={fixAudioSync}
        />

        {/* Audio controls for current scene */}
        <AudioPlayerComponent
          audioRef={audioRef}
          activeScene={activeScene}
          activeIndex={activeIndex}
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleEnhancedTimeUpdate}
          onEnded={handleAudioEnded}
        />

        {/* Caption settings panel */}
        {activeScene.captions && activeScene.captions.length > 0 && (
          <div className='mt-4'>
            <CaptionSettingsUI
              showCaptions={showCaptions}
              onToggleCaptions={setShowCaptions}
              onStyleChange={setCaptionStyle}
            />
          </div>
        )}

        <div className='mt-2 text-sm text-gray-600'>
          {activeScene.textContent}
        </div>
      </div>
    </div>
  );
}
