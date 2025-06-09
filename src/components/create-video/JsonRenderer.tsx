import React from 'react';
import Image from 'next/image';
import VideoPlayer from './VideoPlayer';
import { Scene } from '@/types/video';
import { Caption } from '@/actions/assemblyai';

// Define types for the response data
export type JsonResponse =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null
  | JsonResponse[]
  | { text: string };

// Helper function to format time in milliseconds to MM:SS format
function formatTime(ms: number): string {
  if (!ms && ms !== 0) return '00:00';

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

interface SceneViewProps {
  scene: Record<string, unknown> & {
    textContent?: string;
    imagePrompt?: string;
    imageUrl?: string;
    audio?: string;
    captions?: Caption[];
    description?: string;
  };
  index: number;
}

function SceneView({ scene, index }: SceneViewProps) {
  // If we have imageUrl and audio, use the enhanced VideoPlayer
  if (
    'imageUrl' in scene &&
    scene.imageUrl &&
    'audio' in scene &&
    scene.audio
  ) {
    return (
      <div className='relative overflow-hidden bg-gradient-to-br from-card/60 via-card/40 to-background/20 backdrop-blur-sm border border-border/50 rounded-xl p-6 mb-6 shadow-lg'>
        <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl' />

        <div className='relative'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 bg-primary/20 rounded-lg'>
              <svg
                className='w-5 h-5 text-primary'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
            </div>
            <h4 className='text-lg font-semibold text-foreground'>
              Scene {index + 1}
            </h4>
          </div>

          <VideoPlayer scene={scene as Scene} />

          {/* Show the image prompt for context */}
          {'imagePrompt' in scene && (
            <div className='mt-6 relative overflow-hidden bg-gradient-to-r from-emerald-50/80 via-green-50/60 to-emerald-100/70 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4'>
              <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full blur-xl' />
              <div className='relative'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='p-1.5 bg-emerald-500/20 rounded-lg'>
                    <svg
                      className='w-4 h-4 text-emerald-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                  </div>
                  <span className='font-semibold text-emerald-800'>
                    Image Prompt
                  </span>
                </div>
                <div className='text-emerald-700/90 text-sm leading-relaxed whitespace-pre-wrap'>
                  {String(scene.imagePrompt)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fall back to the original display for scenes without media
  return (
    <div className='bg-gray-50 p-4 rounded-md'>
      <h4 className='text-md font-semibold mb-2'>Scene {index + 1}</h4>
      {/* Prioritize displaying textContent and imagePrompt */}
      {'textContent' in scene && (
        <div className='mb-4 border-l-4 border-blue-400 pl-3 py-2 bg-blue-50 rounded'>
          <div className='font-medium mb-1'>Text Content:</div>
          <div className='text-gray-700 whitespace-pre-wrap'>
            {String(scene.textContent)}
          </div>
        </div>
      )}
      {'imagePrompt' in scene && (
        <div className='mb-4 border-l-4 border-green-400 pl-3 py-2 bg-green-50 rounded'>
          <div className='font-medium mb-1'>Image Prompt:</div>
          <div className='text-gray-700 whitespace-pre-wrap'>
            {String(scene.imagePrompt)}
          </div>
        </div>
      )}
      {'imageUrl' in scene && scene.imageUrl && (
        <div className='mb-4'>
          <div className='font-medium mb-1'>Generated Image:</div>
          <Image
            src={String(scene.imageUrl)}
            alt={`Scene ${index + 1}`}
            className='rounded-md border border-gray-200 shadow-sm'
            width={500}
            height={300}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}{' '}
      {'audio' in scene && scene.audio && (
        <div className='mb-4'>
          <div className='font-medium mb-1'>Generated Audio:</div>
          <audio controls src={String(scene.audio)} className='w-full mt-1' />
        </div>
      )}{' '}
      {'captions' in scene &&
        scene.captions &&
        Array.isArray(scene.captions) &&
        scene.captions.length > 0 && (
          <div className='mb-4 border-l-4 border-purple-400 pl-3 py-2 bg-purple-50 rounded'>
            <div className='font-medium mb-1'>
              Captions:{' '}
              <span className='text-sm font-normal text-gray-600'>
                ({scene.captions.length} segments)
              </span>
            </div>
            <div className='max-h-60 overflow-y-auto mt-2 text-sm'>
              {(scene.captions as Caption[]).map((caption, idx) => (
                <div
                  key={idx}
                  className='mb-2 pb-2 border-b border-purple-100 last:border-0'
                >
                  <div className='text-gray-700 font-medium'>
                    {caption.text}
                  </div>
                  <div className='text-xs text-gray-500 mt-1 flex justify-between'>
                    <span>
                      {formatTime(caption.start)} → {formatTime(caption.end)}
                    </span>
                    <span className='text-purple-600'>
                      {((caption.end - caption.start) / 1000).toFixed(1)}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      {/* Display other scene properties */}
      {Object.entries(scene).map(([sceneKey, sceneValue]) => {
        // Skip properties that are already displayed above
        if (
          sceneKey === 'textContent' ||
          sceneKey === 'imagePrompt' ||
          sceneKey === 'imageUrl' ||
          sceneKey === 'audio' ||
          sceneKey === 'captions'
        )
          return null;

        return (
          <div key={sceneKey} className='mb-2'>
            <span className='font-medium'>{sceneKey}: </span>
            {typeof sceneValue === 'object' && sceneValue !== null ? (
              <div className='pl-4 mt-1'>
                <JsonRenderer data={sceneValue as JsonResponse} />
              </div>
            ) : (
              <div className='text-gray-700 whitespace-pre-wrap'>
                {String(sceneValue)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface JsonRendererProps {
  data: JsonResponse;
}

export function JsonRenderer({ data }: JsonRendererProps) {
  if (!data) return null;

  // Special handling for scenes with textContent and imagePrompt
  if (typeof data === 'object' && data !== null && 'scenes' in data) {
    return (
      <div className='space-y-4'>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className='border-b border-gray-200 pb-4'>
            <span className='font-semibold text-lg'>{key}: </span>
            {key === 'scenes' && Array.isArray(value) ? (
              <div className='mt-2 space-y-4'>
                {value.map((scene, index) => (
                  <SceneView
                    key={index}
                    scene={scene as Record<string, unknown>}
                    index={index}
                  />
                ))}
              </div>
            ) : typeof value === 'object' && value !== null ? (
              <div className='pl-4 mt-1'>
                <JsonRenderer data={value as JsonResponse} />
              </div>
            ) : (
              <span className='text-gray-700'>{String(value)}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Standard object rendering
  if (typeof data === 'object' && data !== null) {
    return (
      <div className='space-y-2'>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className='border-b border-gray-200 pb-2'>
            <span className='font-semibold'>{key}: </span>
            {typeof value === 'object' && value !== null ? (
              <div className='pl-4 mt-1'>
                <JsonRenderer data={value as JsonResponse} />
              </div>
            ) : (
              <span className='text-gray-700 whitespace-pre-wrap'>
                {String(value)}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return <span className='whitespace-pre-wrap'>{String(data)}</span>;
}
