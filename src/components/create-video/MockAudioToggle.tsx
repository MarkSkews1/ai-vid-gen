'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface MockAudioToggleProps {
  useMockAudio: boolean;
  setUseMockAudio: (useMock: boolean) => void;
}

export function MockAudioToggle({
  useMockAudio,
  setUseMockAudio,
}: MockAudioToggleProps) {
  return (
    <div className='flex items-center space-x-2 my-4 p-4 border rounded-md bg-card'>
      <Switch
        id='mock-audio-toggle'
        checked={useMockAudio}
        onCheckedChange={setUseMockAudio}
      />
      <Label htmlFor='mock-audio-toggle' className='cursor-pointer'>
        <div>
          <h4 className='font-medium text-sm'>Use Mock Audio</h4>
          <p className='text-xs text-muted-foreground'>
            Toggle to use mock audio files instead of generating real audio
          </p>
        </div>
      </Label>
    </div>
  );
}
