'use client';

import React, { useState } from 'react';
import { useVideo } from '@/context/video';
import { Button } from '@/components/ui/button';

export default function CreateVideoPage() {
  const { script, setScript, setLoading } = useVideo();
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const handleCreateVideo = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script }),
      });

      const result = await response.json();

      if (result.success) {
        setResponse(result.data || '');
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

  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold mb-5'>Create Video Page</h1>
      <div className='mb-5'>
        <label htmlFor='script' className='block text-sm font-medium mb-2'>
          Enter Your Video Script
        </label>
        <textarea
          id='script'
          className='w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
          value={script === 'Script...' ? '' : script}
          onChange={(e) => setScript(e.target.value || 'Script...')}
          placeholder='Enter your video script here...'
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
        <div className='mt-4 p-4 bg-green-50 text-gray-700 rounded-md'>
          <h3 className='font-semibold mb-2'>AI Response:</h3>
          <p className='whitespace-pre-line'>{response}</p>
        </div>
      )}
    </div>
  );
}
