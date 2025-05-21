'use client';

import React, { useState } from 'react';
import { useVideo } from '@/context/video';
import { Button } from '@/components/ui/button';
import {
  ValidatedTextArea,
  ValidationPatterns,
} from '@/components/ui/regex-validator';

// Define types for the response data
type JsonResponse =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null
  | JsonResponse[]
  | { text: string };

export default function CreateVideoPage() {
  const { script, setScript, setLoading } = useVideo();
  const [response, setResponse] = useState<JsonResponse | null>(null);
  const [error, setError] = useState<string>('');

  const handleCreateVideo = async () => {
    try {
      setLoading(true);
      setError(''); // Use a default message if script is the placeholder
      const scriptToSend =
        script === 'Script...'
          ? 'Create a short video about nature and wildlife'
          : script;

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script: scriptToSend }),
      });

      const result = await response.json();
      if (result.success) {
        // Parse the response if it's a string containing JSON
        try {
          // Try to parse the response as JSON if it's a string
          const parsedData =
            typeof result.data === 'string'
              ? JSON.parse(result.data)
              : result.data;
          setResponse(parsedData);
        } catch (error) {
          // If parsing fails, just use the original response
          console.warn('Failed to parse JSON response:', error);
          setResponse({ text: result.data });
        }
      } else {
        setError(result.error || 'Failed to create video');
      }
    } catch (err: unknown) {
      setError('An error occurred while creating the video');
      console.error('Video creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to render JSON data in a nice format
  const renderJsonData = (data: JsonResponse) => {
    if (!data) return null;

    // Special handling for scenes with textContent and imagePrompt
    if (typeof data === 'object' && data !== null && 'scenes' in data) {
      return (
        <div className='space-y-4'>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className='border-b border-gray-200 pb-4'>
              <span className='font-semibold text-lg'>{key}: </span>
              {key === 'scenes' && Array.isArray(value) ? (
                <div className='pl-4 mt-2 space-y-6'>
                  {value.map(
                    (scene: Record<string, unknown>, index: number) => (
                      <div key={index} className='bg-gray-50 p-4 rounded-md'>
                        <h4 className='text-md font-semibold mb-2'>
                          Scene {index + 1}
                        </h4>{' '}
                        {/* Prioritize displaying textContent and imagePrompt */}
                        {'textContent' in scene && (
                          <div className='mb-4 border-l-4 border-blue-400 pl-3 py-2 bg-blue-50 rounded'>
                            <div className='font-medium mb-1'>
                              Text Content:
                            </div>
                            <div className='text-gray-700 whitespace-pre-wrap'>
                              {typeof scene.textContent === 'string'
                                ? scene.textContent
                                : String(scene.textContent)}
                            </div>
                          </div>
                        )}
                        {'imagePrompt' in scene && (
                          <div className='mb-4 border-l-4 border-green-400 pl-3 py-2 bg-green-50 rounded'>
                            <div className='font-medium mb-1'>
                              Image Prompt:
                            </div>
                            <div className='text-gray-700 whitespace-pre-wrap'>
                              {typeof scene.imagePrompt === 'string'
                                ? scene.imagePrompt
                                : String(scene.imagePrompt)}
                            </div>
                          </div>
                        )}
                        {/* Display other scene properties */}
                        {Object.entries(scene).map(([sceneKey, sceneValue]) => {
                          // Skip textContent and imagePrompt as they're already displayed above
                          if (
                            sceneKey === 'textContent' ||
                            sceneKey === 'imagePrompt'
                          )
                            return null;

                          return (
                            <div key={sceneKey} className='mb-2'>
                              <span className='font-medium'>{sceneKey}: </span>
                              {typeof sceneValue === 'object' &&
                              sceneValue !== null ? (
                                <div className='pl-4 mt-1'>
                                  {renderJsonData(sceneValue as JsonResponse)}
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
                    )
                  )}
                </div>
              ) : typeof value === 'object' && value !== null ? (
                <div className='pl-4 mt-1'>
                  {renderJsonData(value as JsonResponse)}
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
                  {renderJsonData(value as JsonResponse)}
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
  };

  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold mb-5'>Create Video Page</h1>{' '}
      <div className='mb-5'>
        <ValidatedTextArea
          id='script'
          label='Enter Your Video Script'
          className='h-40'
          value={script === 'Script...' ? '' : script}
          onChange={(e) => setScript(e.target.value || 'Script...')}
          placeholder='Enter your video script here...'
          // Example of using a custom validation rule
          validationRule={{
            pattern: /^[\s\S]{10,5000}$/,
            message: 'Script should be between 10 and 5000 characters',
          }}
          onValidationChange={(isValid) => {
            // You can use this to track validation state
            console.log('Script validation status:', isValid);
          }}
        />
      </div>{' '}
      <div className='my-5'>
        <Button
          onClick={handleCreateVideo}
          className='bg-primary text-primary-foreground hover:bg-primary/90'
          disabled={!script || script === 'Script...'}
        >
          Create Video
        </Button>
      </div>
      {error && (
        <div className='mt-4 p-4 bg-red-100 text-red-700 rounded-md'>
          {error}
        </div>
      )}
      {response && (
        <div className='mt-4 p-4 bg-green-50 text-gray-700 rounded-md overflow-auto'>
          <h3 className='font-semibold mb-2'>AI Response:</h3>
          <div className='rounded-md bg-white p-4 border border-gray-200'>
            {renderJsonData(response)}
          </div>
          <details className='mt-4'>
            <summary className='cursor-pointer text-sm text-gray-500'>
              View Raw JSON
            </summary>
            <pre className='mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-60'>
              {JSON.stringify(response, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
