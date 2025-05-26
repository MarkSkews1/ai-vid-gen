import React, { useState, useEffect } from 'react';
import { useVideo } from '@/context/video';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

// Define the type for the debug image generation items
type DebugImageItem = {
  sceneIndex: number;
  success: boolean;
  imageUrl: string;
  timestamp: string;
  error?: string; // Optional error property
  scene?: string; // Optional scene data for debugging
};

// Interface for environment variables response
interface EnvVarsResponse {
  message: string;
  envVars: {
    USE_MOCK_REPLICATE?: string;
    USE_MOCK_GEMINI?: string;
    [key: string]: string | undefined;
  };
}

export default function DebugImageGeneration() {
  const { debugImageGeneration } = useVideo() as {
    debugImageGeneration: DebugImageItem[];
  };
  const [showDebug, setShowDebug] = useState(false);
  const [envVars, setEnvVars] = useState<EnvVarsResponse['envVars'] | null>(
    null
  );

  // Fetch environment variables for debugging
  useEffect(() => {
    if (showDebug) {
      fetch('/api/env-check')
        .then((res) => res.json())
        .then((data: EnvVarsResponse) => {
          setEnvVars(data.envVars);
        })
        .catch((error) => {
          console.error('Failed to fetch env vars:', error);
        });
    }
  }, [showDebug]);

  // If there's no debug data, provide informative button
  if (debugImageGeneration.length === 0) {
    return (
      <div className='mt-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setShowDebug(!showDebug)}
          className='text-xs'
        >
          Debug: No Image Data Yet
        </Button>

        {showDebug && (
          <div className='mt-2 p-3 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 rounded-md text-sm'>
            <p className='font-medium mb-1'>Debug Information</p>
            <p>No images have been generated yet. Possible reasons:</p>
            <ul className='list-disc pl-5 mt-1 space-y-1 text-xs'>
              <li>Script generation has not completed</li>
              <li>No scenes were extracted from the script</li>{' '}
              <li>Image generation process hasn&apos;t started</li>
              <li>There was an error during the image generation process</li>
            </ul>
            <p className='mt-2 text-xs'>
              Try clicking the &quot;Create Video&quot; button and check this
              section again.
            </p>

            {/* Environment status */}
            {envVars && (
              <div className='mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-800 dark:text-blue-200'>
                <p className='font-medium'>Environment Settings:</p>
                <ul className='list-none mt-1'>
                  <li>
                    <strong>Mock Replicate:</strong>{' '}
                    {envVars.USE_MOCK_REPLICATE === 'true'
                      ? '✅ Enabled (using mock images)'
                      : '❌ Disabled (using real API calls)'}
                  </li>
                  <li>
                    <strong>Mock Gemini:</strong>{' '}
                    {envVars.USE_MOCK_GEMINI === 'true'
                      ? '✅ Enabled (using mock content)'
                      : '❌ Disabled (using real API calls)'}
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className='mt-4'>
      <Button
        variant={showDebug ? 'default' : 'outline'}
        size='sm'
        onClick={() => setShowDebug(!showDebug)}
        className='mb-3 text-xs'
      >
        {showDebug
          ? 'Hide Debug Info'
          : `Debug: ${debugImageGeneration.length} Images Generated`}
      </Button>

      {showDebug && (
        <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 transition-all'>
          <h3 className='text-xl font-semibold mb-4'>
            Debug: Image Generation Status
          </h3>

          <div className='mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded'>
            <div className='flex items-center justify-between mb-2'>
              <span className='font-medium'>Summary</span>
              <div className='flex gap-2'>
                <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'>
                  {debugImageGeneration.filter((item) => item.success).length}{' '}
                  Success
                </span>
                <span className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'>
                  {debugImageGeneration.filter((item) => !item.success).length}{' '}
                  Failed
                </span>
              </div>
            </div>

            {/* Environment status */}
            {envVars && (
              <div className='mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-800 dark:text-blue-200'>
                <p className='font-medium'>Environment Settings:</p>
                <ul className='list-none mt-1'>
                  <li>
                    <strong>Mock Replicate:</strong>{' '}
                    {envVars.USE_MOCK_REPLICATE === 'true'
                      ? '✅ Enabled (using mock images)'
                      : '❌ Disabled (using real API calls)'}
                  </li>
                  <li>
                    <strong>Mock Gemini:</strong>{' '}
                    {envVars.USE_MOCK_GEMINI === 'true'
                      ? '✅ Enabled (using mock content)'
                      : '❌ Disabled (using real API calls)'}
                  </li>
                </ul>
              </div>
            )}

            {/* Add error message display if any errors exist */}
            {debugImageGeneration.some((item) => !item.success) && (
              <div className='mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-800 dark:text-red-200'>
                <p className='font-medium'>Common Error Patterns:</p>
                <ul className='list-disc pl-4 mt-1'>
                  {debugImageGeneration
                    .filter((item) => !item.success)
                    .slice(0, 1)
                    .map((item, idx) => (
                      <li key={idx}>{item.error || 'Unknown error'}</li>
                    ))}
                </ul>
                <p className='mt-2'>
                  <strong>Troubleshooting:</strong> If you see
                  &quot;output_format&quot; or &quot;parameter&quot; errors, the
                  issue may be related to the AI model configuration.
                </p>
              </div>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {debugImageGeneration.map((item) => (
              <div
                key={`scene-${item.sceneIndex}`}
                className={`p-3 rounded-lg ${
                  item.success
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-red-50 dark:bg-red-900/20'
                }`}
              >
                {' '}
                <div className='flex items-center justify-between mb-2'>
                  <span className='font-medium'>
                    Scene {item.sceneIndex + 1}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.success
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}
                  >
                    {item.success ? 'Success' : 'Failed'}
                  </span>
                </div>
                <div className='text-xs text-gray-500 mb-2'>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
                {item.success && item.imageUrl && (
                  <div className='relative h-40 w-full mb-2 overflow-hidden rounded-md'>
                    <Image
                      src={item.imageUrl}
                      alt={`Scene ${item.sceneIndex + 1}`}
                      fill
                      className='object-cover'
                    />
                  </div>
                )}{' '}
                {!item.success && (
                  <div className='h-40 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md mb-2 overflow-auto'>
                    <span className='text-gray-500 dark:text-gray-400 mb-2'>
                      Image generation failed
                    </span>
                    {item.error && (
                      <span className='text-red-500 dark:text-red-400 text-xs p-2 text-center'>
                        Error: {item.error}
                      </span>
                    )}
                    {item.scene && (
                      <div className='text-xs text-gray-400 px-2 mt-1'>
                        <details>
                          <summary className='cursor-pointer'>
                            Scene Data
                          </summary>
                          <pre className='whitespace-pre-wrap text-left'>
                            {item.scene}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
