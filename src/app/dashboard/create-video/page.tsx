'use client';
import React from 'react';
import { useVideo } from '@/context/video';

export default function CreateVideoPage() {
  const { script, setScript } = useVideo();
  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold mb-5'>Create Video Page</h1>
      <pre>
        <code>{JSON.stringify(script, null, 4)}</code>
      </pre>
    </div>
  );
}
