'use client';

import React, { useState } from 'react';
import { useVideo } from '@/context/video';
import VideoPlayer from './VideoPlayer';
import { Button } from '@/components/ui/button';
import { CaptionSettings as CaptionSettingsUI } from './CaptionSettings';

export default function VideoList() {
  const { scenes, videoTitle } = useVideo();
  const scenesWithMedia = scenes.filter(
    (scene) => scene.imageUrl && scene.audio
  );
  const [showGlobalCaptionSettings, setShowGlobalCaptionSettings] =
    useState(false);
  const [globalCaptionsEnabled, setGlobalCaptionsEnabled] = useState(true);
  const [globalCaptionStyle, setGlobalCaptionStyle] = useState({
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textColor: 'white',
    fontSize: 'text-lg',
  });

  if (!scenesWithMedia || scenesWithMedia.length === 0) {
    return null;
  }

  const hasCaptions = scenesWithMedia.some(
    (scene) => scene.captions && scene.captions.length > 0
  );

  return (
    <div className='mt-8'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold'>
          {videoTitle || 'Your Generated Video'}
        </h2>
        <div className='flex space-x-2'>
          {hasCaptions && (
            <Button
              size='sm'
              variant='outline'
              onClick={() =>
                setShowGlobalCaptionSettings(!showGlobalCaptionSettings)
              }
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-4 h-4 mr-2'
              >
                <path d='M19 9h-2v2h2v2h-4V9h2V7h-2V5h4v4zm-6 2h-2v2h2v-2zm-4 0H7v2h2v-2zM5 7H3v10h10v-2H5V7z' />
              </svg>
              Caption Settings
            </Button>
          )}
          <Button size='sm' variant='outline'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-4 h-4 mr-2'
            >
              <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
            </svg>
            Share
          </Button>
        </div>
      </div>

      {/* Global Caption Settings Panel */}
      {showGlobalCaptionSettings && hasCaptions && (
        <div className='mb-6 border border-gray-200 rounded-lg shadow-sm'>
          <div className='p-3 bg-purple-50 border-b border-gray-200'>
            <h3 className='font-medium text-purple-800'>
              Global Caption Settings
            </h3>
            <p className='text-sm text-gray-600'>
              These settings will apply to all video scenes with captions.
            </p>
          </div>
          <div className='p-4'>
            {' '}
            <CaptionSettingsUI
              showCaptions={globalCaptionsEnabled}
              onToggleCaptions={setGlobalCaptionsEnabled}
              onStyleChange={setGlobalCaptionStyle}
            />
          </div>
        </div>
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {scenesWithMedia.map((scene, index) => {
          // Apply global caption settings to each video player
          const sceneWithSettings =
            globalCaptionsEnabled && hasCaptions
              ? {
                  ...scene,
                  captionSettings: {
                    enabled: globalCaptionsEnabled,
                    style: globalCaptionStyle,
                  },
                }
              : scene;

          return <VideoPlayer key={index} scene={sceneWithSettings} />;
        })}
      </div>

      <div className='mt-6 p-3 bg-gray-50 rounded-md text-sm text-gray-600'>
        <p className='mb-2'>
          <strong>Video Information:</strong>
        </p>
        <ul className='list-disc pl-5 space-y-1'>
          <li>
            <strong>Scenes:</strong> {scenesWithMedia.length}
          </li>
          <li>
            <strong>Captions:</strong>{' '}
            {scenesWithMedia.some(
              (scene) => scene.captions && scene.captions.length > 0
            )
              ? 'Available'
              : 'Not available'}
          </li>
          <li>
            <strong>Total Duration:</strong> ~{scenesWithMedia.length * 5}{' '}
            seconds
          </li>
        </ul>
      </div>
    </div>
  );
}
