'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Scene } from '@/types/video';
import VideoCaptions from './VideoCaptions';
import { CaptionSettings as CaptionSettingsUI } from './CaptionSettings';

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

export default function VideoPlayer({ scene }: VideoPlayerProps) {
  // Use caption settings from parent if provided, otherwise use defaults
  const initialCaptionsEnabled = scene.captionSettings?.enabled ?? true;
  const initialCaptionStyle = scene.captionSettings?.style ?? {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textColor: 'white',
    fontSize: 'text-lg',
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showCaptions, setShowCaptions] = useState(initialCaptionsEnabled);
  const [captionStyle, setCaptionStyle] = useState(initialCaptionStyle);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Play/pause the audio
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update current time for captions
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle when audio ends
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className='relative rounded-xl overflow-hidden border border-gray-200 shadow-md'>
      {/* Image */}
      {scene.imageUrl && (
        <div className='relative w-full h-64 md:h-80 lg:h-96'>
          <Image
            src={scene.imageUrl}
            alt={scene.description || 'Video scene'}
            fill
            className='object-cover'
          />
          {/* Play button overlay */}
          <div
            className='absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-colors'
            onClick={togglePlay}
          >
            {!isPlaying && (
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='white'
                  className='w-8 h-8 ml-1'
                >
                  <path d='M8 5v14l11-7z' />
                </svg>
              </div>
            )}
          </div>{' '}
          {/* Captions overlay */}
          {isPlaying && showCaptions && (
            <VideoCaptions
              currentTime={currentTime}
              scene={scene}
              style={captionStyle}
            />
          )}
          {/* Caption controls */}
          {isPlaying && (
            <div className='absolute top-2 right-2 flex items-center space-x-2'>
              {/* Caption status indicator */}
              <div className='text-xs bg-black/60 text-white px-2 py-1 rounded flex items-center'>
                <span className='mr-2'>
                  Captions:{' '}
                  {scene.captions && scene.captions.length > 0
                    ? showCaptions
                      ? 'On'
                      : 'Off'
                    : 'Not available'}
                </span>

                {/* Toggle button - only show if captions are available */}
                {scene.captions && scene.captions.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering play/pause
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
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Audio controls */}
      <div className='p-4 bg-white'>
        <div className='mb-2 font-medium'>{scene.description || 'Scene'}</div>

        {scene.audio && (
          <audio
            ref={audioRef}
            src={scene.audio}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleAudioEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className='w-full'
            controls
          />
        )}
        {/* Caption settings panel - only show if captions are available */}
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
