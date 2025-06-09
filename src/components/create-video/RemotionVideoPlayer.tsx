'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { Scene } from '@/types/video';
import { CaptionSettings as CaptionSettingsUI } from './CaptionSettings';
import { SceneComposition } from './SceneComposition';

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
  // Use caption settings from parent if provided, otherwise use defaults
  const initialCaptionsEnabled = scene.captionSettings?.enabled ?? true;
  const initialCaptionStyle = scene.captionSettings?.style ?? {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textColor: 'white',
    fontSize: 'text-lg',
  };

  const [showCaptions, setShowCaptions] = useState(initialCaptionsEnabled);
  const [captionStyle, setCaptionStyle] = useState(initialCaptionStyle);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<PlayerRef>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Load audio duration
  useEffect(() => {
    if (!scene.audio) return;
    const audio = new Audio(scene.audio);
    audio.addEventListener('loadedmetadata', () => {
      setAudioDuration(audio.duration);
    });
    return () => {
      audio.remove();
    };
  }, [scene.audio]);

  // Keep Remotion Player in sync with audio element
  useEffect(() => {
    if (!playerRef.current) return;
    const frame = Math.floor(currentTime * 30);
    playerRef.current.seekTo(frame);
  }, [currentTime]);

  // Play/pause Remotion Player when audio plays/pauses
  useEffect(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className='relative rounded-xl overflow-hidden border border-gray-200 shadow-md'>
      {/* Remotion Player */}
      <div className='w-full aspect-video'>
        <Player
          ref={playerRef}
          component={() => (
            <SceneComposition
              scene={scene}
              showCaptions={showCaptions}
              captionStyle={captionStyle}
              currentTime={currentTime} // Pass currentTime for captions sync
            />
          )}
          durationInFrames={audioDuration ? Math.ceil(audioDuration * 30) : 300} // 30fps, default to 10 seconds
          compositionWidth={1280}
          compositionHeight={720}
          fps={30}
          style={{ width: '100%', height: '100%' }}
          autoPlay={false}
          loop
          inputProps={{}}
          controls={false} // Hide Remotion controls, use audio controls instead
        />
      </div>

      {/* Caption controls */}
      {scene.captions && scene.captions.length > 0 && (
        <div className='absolute top-2 right-2 flex items-center space-x-2 z-20'>
          {/* Caption status indicator */}
          <div className='text-xs bg-black/60 text-white px-2 py-1 rounded flex items-center'>
            <span className='mr-2'>
              Captions: {showCaptions ? 'On' : 'Off'}
            </span>
            {/* Toggle button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCaptions(!showCaptions);
              }}
              className={`w-8 h-5 rounded-full relative transition-colors ${
                showCaptions ? 'bg-purple-500' : 'bg-gray-400'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  showCaptions ? 'left-4' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Scene details and controls */}
      <div className='p-4 bg-white'>
        <div className='mb-2 font-medium'>{scene.description || 'Scene'}</div>
        {/* Audio controls - master playback */}
        {scene.audio && (
          <audio
            className='w-full'
            ref={audioRef}
            controls
            src={scene.audio}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onSeeked={(e) => setCurrentTime(e.currentTarget.currentTime)}
          />
        )}
        {/* Caption settings panel */}
        {scene.captions && scene.captions.length > 0 && (
          <div className='mt-4'>
            <CaptionSettingsUI
              showCaptions={showCaptions}
              onToggleCaptions={setShowCaptions}
              onStyleChange={setCaptionStyle}
            />
          </div>
        )}
        <div className='mt-2 text-sm text-gray-600'>{scene.textContent}</div>
      </div>
    </div>
  );
}
