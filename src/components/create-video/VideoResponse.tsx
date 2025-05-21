import React from 'react';
import { JsonRenderer, JsonResponse } from './JsonRenderer';

interface VideoResponseProps {
  videoData: JsonResponse;
  error: string | null;
}

export function VideoResponse({ videoData, error }: VideoResponseProps) {
  if (!videoData && !error) return null;

  return (
    <>
      {error && (
        <div className='mt-4 p-4 bg-red-100 text-red-700 rounded-md'>
          {error}
        </div>
      )}

      {videoData && (
        <div className='mt-4 p-4 bg-green-50 text-gray-700 rounded-md overflow-auto'>
          <h3 className='font-semibold mb-2'>AI Response:</h3>
          <div className='rounded-md bg-white p-4 border border-gray-200'>
            <JsonRenderer data={videoData} />
          </div>
          <details className='mt-4'>
            <summary className='cursor-pointer text-sm text-gray-500'>
              View Raw JSON
            </summary>
            <pre className='mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-60'>
              {JSON.stringify(videoData, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </>
  );
}
