import React, { useMemo } from 'react';
import { VideoData, Scene } from '@/types/video';
import { VideoResponse } from './VideoResponse';
import DebugImageGeneration from './DebugImageGeneration';
import VideoPlayer from './VideoPlayer';
import { useVideo } from '@/context/video';
import Image from 'next/image';

// Helper function to calculate scene duration based on captions
const calculateSceneDuration = (scene: Scene): number => {
  if (!scene.captions || scene.captions.length === 0) {
    return 5; // Default duration if no captions
  }

  const lastCaption = scene.captions[scene.captions.length - 1];
  const durationInSeconds = Math.ceil(lastCaption.end / 1000); // Convert ms to seconds
  return Math.max(durationInSeconds, 5); // Ensure minimum 5 seconds duration
};

// Helper function to format seconds to MM:SS format
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface VideoPreviewSectionProps {
  videoData: VideoData | null;
  error: string | null;
}

export const VideoPreviewSection: React.FC<VideoPreviewSectionProps> = ({
  videoData,
  error,
}) => {
  const { scenes } = useVideo();
  const hasMediaScenes = useMemo(() => {
    const hasScenes = scenes.some((scene) => {
      const hasImage = scene.imageUrl && scene.imageUrl.trim() !== '';
      if (hasImage) {
        console.log('Found scene with image:', scene.imageUrl);
      }
      return hasImage;
    });

    console.log('Has media scenes:', hasScenes);
    return hasScenes;
  }, [scenes]); // Get the first scene with an image
  const firstMediaScene = useMemo(() => {
    const scene = scenes.find(
      (scene) => scene.imageUrl && scene.imageUrl.trim() !== ''
    );
    if (scene) {
      console.log('Found first scene with image:', scene.imageUrl);
    } else {
      console.log('No scenes with images found');
    }
    return scene;
  }, [scenes]);

  // Calculate durations for all scenes with captions
  const scenesWithDuration = useMemo(() => {
    return scenes.map((scene) => ({
      ...scene,
      duration: calculateSceneDuration(scene),
    }));
  }, [scenes]);

  // Calculate total video duration
  const totalDuration = useMemo(() => {
    return scenesWithDuration.reduce(
      (total, scene) => total + scene.duration,
      0
    );
  }, [scenesWithDuration]);
  // Add default caption settings if scene has captions
  const sceneWithSettings = useMemo(() => {
    if (!firstMediaScene) return null;

    return firstMediaScene.captions && firstMediaScene.captions.length > 0
      ? {
          ...firstMediaScene,
          captionSettings: {
            enabled: true,
            style: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              textColor: 'white',
              fontSize: 'text-lg',
            },
          },
        }
      : firstMediaScene;
  }, [firstMediaScene]);

  return (
    <div className='w-full'>
      <div className='mb-6 bg-card p-4 sm:p-6 rounded-lg border border-border shadow-sm'>
        <h2 className='text-lg font-semibold mb-3'>Video Preview</h2>
        <div className='text-muted-foreground text-sm'>
          {hasMediaScenes
            ? null
            : 'Your generated video will appear here after processing.'}
        </div>
        {/* Display first scene image if available */}
        {firstMediaScene && firstMediaScene.imageUrl && (
          <div className='mt-4'>
            <div className='relative aspect-video w-full overflow-hidden rounded-lg border border-border'>
              <Image
                src={firstMediaScene.imageUrl}
                alt={firstMediaScene.description || 'First scene image'}
                fill
                style={{ objectFit: 'cover' }}
                className='rounded-lg'
                unoptimized={true}
                priority={true}
                onError={(e) => {
                  console.error(
                    'Image failed to load:',
                    firstMediaScene.imageUrl
                  );
                  // Replace with fallback image
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/fantasy.jpg'; // Use a fallback image from public folder
                  target.style.objectFit = 'cover';
                }}
              />
              {/* Add an invisible debug element that shows the URL in dev tools */}
              <div className='hidden'>{`Debug URL: ${firstMediaScene.imageUrl}`}</div>
            </div>
            <p className='mt-2 text-sm font-medium'>
              {firstMediaScene.description ||
                firstMediaScene.textContent ||
                'No description available'}
            </p>
          </div>
        )}
        {/* Display total duration if there are media scenes */}
        {hasMediaScenes && (
          <div className='mt-3 text-sm'>
            <span className='font-medium'>Total video duration:</span>{' '}
            {formatDuration(totalDuration)} ({totalDuration} seconds)
          </div>
        )}{' '}
      </div>

      {/* Video Player Component */}
      {firstMediaScene && (
        <div className='mt-6 bg-card p-4 sm:p-6 rounded-lg border border-border shadow-sm'>
          <h3 className='text-lg font-semibold mb-3'>Video Player</h3>

          {/* Only show the VideoPlayer if the scene has both image and audio */}
          {sceneWithSettings && sceneWithSettings.audio ? (
            <VideoPlayer scene={sceneWithSettings} />
          ) : (
            <div className='mt-4 p-3 bg-amber-50 text-amber-700 rounded-md text-sm'>
              <p>
                Audio is being generated. The video player will appear once
                audio is available.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Debug Images Section */}
      <DebugImageGeneration />

      {/* Scene durations section - collapsible */}
      {hasMediaScenes && scenesWithDuration.length > 0 && (
        <div className='mt-6 bg-card p-4 sm:p-6 rounded-lg border border-border shadow-sm'>
          <details>
            <summary className='text-lg font-semibold mb-3 cursor-pointer'>
              Scene Durations
              {scenesWithDuration.some(
                (scene) => scene.duration < 2 || scene.duration > 30
              ) && (
                <span
                  className='text-amber-500 ml-2'
                  title='Some scenes have unusual durations'
                >
                  ⚠️
                </span>
              )}
            </summary>
            <div className='space-y-3 mt-4'>
              {scenesWithDuration.map((scene, index) => {
                // Determine if this scene's duration is unusual (< 2s or > 30s)
                const isUnusualDuration =
                  scene.duration < 2 || scene.duration > 30;

                return (
                  <div key={index} className='p-3 bg-muted rounded-md'>
                    <div className='flex justify-between items-center'>
                      <span className='font-medium'>Scene {index + 1}</span>
                      <div className='flex items-center gap-2'>
                        {isUnusualDuration && (
                          <span
                            className='text-amber-500'
                            title={
                              scene.duration < 2
                                ? 'Duration might be too short'
                                : 'Duration might be too long'
                            }
                          >
                            ⚠️
                          </span>
                        )}
                        <span className='bg-primary/10 text-primary px-2 py-1 rounded-md text-sm'>
                          {formatDuration(scene.duration)}
                        </span>
                      </div>
                    </div>
                    <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
                      {scene.description ||
                        scene.textContent ||
                        'No description available'}
                    </p>
                    {scene.captions && (
                      <p className='text-xs text-muted-foreground mt-1'>
                        {scene.captions.length} caption
                        {scene.captions.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </details>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className='mt-4 p-4 bg-red-100 text-red-700 rounded-md'>
          {error}
        </div>
      )}
      {/* Video Response Component - Now hidden by default */}
      {videoData && (
        <div className='mt-6'>
          <details className='bg-card p-4 sm:p-6 rounded-lg border border-border shadow-sm'>
            <summary className='text-lg font-semibold cursor-pointer'>
              View AI Response Details
            </summary>
            <div className='mt-4'>
              <VideoResponse videoData={videoData} error={null} />
            </div>
          </details>
        </div>
      )}
    </div>
  );
};
