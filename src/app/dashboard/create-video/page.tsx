'use client';

import React from 'react';
import { useVideo } from '@/context/video';
import { Button } from '@/components/ui/button';
import {
  ValidatedTextArea,
  ValidatedInput,
} from '@/components/ui/regex-validator';
import { storyOptions, StoryOption } from '@/constants';

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
  const {
    script,
    setScript,
    status,
    videoData,
    error,
    createVideo,
    handleStorySelect,
    selectedStory,
    customPrompt,
    setCustomPrompt,
    cancelCustomPrompt,
  } = useVideo();
  const handleCreateVideo = async () => {
    await createVideo(script);
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
                <div className='mt-2 space-y-4'>
                  {value.map((scene, index) => (
                    <div key={index} className='bg-gray-50 p-4 rounded-md'>
                      <h4 className='text-md font-semibold mb-2'>
                        Scene {index + 1}
                      </h4>{' '}
                      {/* Prioritize displaying textContent and imagePrompt */}
                      {'textContent' in scene && (
                        <div className='mb-4 border-l-4 border-blue-400 pl-3 py-2 bg-blue-50 rounded'>
                          <div className='font-medium mb-1'>Text Content:</div>
                          <div className='text-gray-700 whitespace-pre-wrap'>
                            {typeof scene.textContent === 'string'
                              ? scene.textContent
                              : String(scene.textContent)}
                          </div>
                        </div>
                      )}
                      {'imagePrompt' in scene && (
                        <div className='mb-4 border-l-4 border-green-400 pl-3 py-2 bg-green-50 rounded'>
                          <div className='font-medium mb-1'>Image Prompt:</div>
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
                  ))}
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
      <div className='mb-8 p-6 bg-gradient-to-r from-blue-300 to-purple-300 rounded-lg shadow-md border border-purple-400'>
        <h2 className='text-lg font-semibold mb-4'>
          Select a Story Type or Enter a Custom Prompt
        </h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-5'>
          {storyOptions.map((option: StoryOption) => (
            <Button
              key={option.label}
              variant={selectedStory === option.label ? 'default' : 'outline'}
              className={`h-auto py-6 px-3 flex flex-col items-center justify-center w-full              transition-all duration-300 ease-in-out cursor-pointer border-2 
                transform hover:scale-105 hover:shadow-lg ${
                  selectedStory === option.label
                    ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary/50 hover:bg-primary/90 hover:ring-4'
                    : 'border-gray-200 hover:border-primary hover:bg-gradient-to-br hover:from-accent/30 hover:to-primary/20'
                }`}
              onClick={() => handleStorySelect(option.label)}
            >
              <span className='font-semibold text-center'>{option.label}</span>{' '}
            </Button>
          ))}{' '}
        </div>
      </div>
      {selectedStory === 'Enter custom prompt' && (
        <div className='mb-5'>
          <ValidatedInput
            id='customPrompt'
            label='Enter Your Custom Prompt'
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder='Enter your custom prompt here...'
            validationRule={{
              pattern: /^[\s\S]{10,5000}$/,
              message: 'Custom prompt should be between 10 and 5000 characters',
            }}
            onValidationChange={(isValid) => {
              console.log('Custom prompt validation status:', isValid);
            }}
            className='transition-all duration-300 border-2 
              focus:border-purple-500 focus:ring-4 focus:ring-purple-200 
              focus:shadow-lg focus:outline-none active:border-purple-700
              hover:border-purple-300'
            labelClassName='text-purple-700 font-semibold transform transition-all 
              duration-300 scale-105 mb-2'
            containerClassName='bg-gradient-to-r from-blue-50 to-purple-50 p-5 
              rounded-lg border border-purple-100 shadow-md transition-all 
              duration-500 hover:shadow-lg hover:from-blue-100 hover:to-purple-100
              focus-within:shadow-xl focus-within:from-white focus-within:to-purple-100'
          />{' '}
          <div className='mt-3 flex justify-end'>
            <Button
              onClick={cancelCustomPrompt}
              variant='outline'
              className='border-red-300 hover:bg-red-50 hover:text-red-600'
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      <div className='mb-5'>
        <ValidatedTextArea
          id='script'
          label='Enter Your Video Script'
          className='h-40'
          value={script === 'Script...' ? '' : script}
          onChange={(e) => setScript(e.target.value || 'Script...')}
          placeholder='Enter your video script here...'
          validationRule={{
            pattern: /^[\s\S]{10,5000}$/,
            message: 'Script should be between 10 and 5000 characters',
          }}
          onValidationChange={(isValid) => {
            console.log('Script validation status:', isValid);
          }}
        />{' '}
      </div>{' '}
      <div className='my-5'>
        <Button
          onClick={handleCreateVideo}
          className='bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
          disabled={!script || script === 'Script...' || status === 'creating'}
        >
          {status === 'creating' ? 'Creating...' : 'Create Video'}
        </Button>
      </div>
      {error && (
        <div className='mt-4 p-4 bg-red-100 text-red-700 rounded-md'>
          {error}
        </div>
      )}
      {videoData && (
        <div className='mt-4 p-4 bg-green-50 text-gray-700 rounded-md overflow-auto'>
          <h3 className='font-semibold mb-2'>AI Response:</h3>
          <div className='rounded-md bg-white p-4 border border-gray-200'>
            {renderJsonData(videoData)}
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
    </div>
  );
}
