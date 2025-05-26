'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface MockCaptionsToggleProps {
  useMockCaptions: boolean;
  setUseMockCaptions: (useMock: boolean) => void;
}

export function MockCaptionsToggle({
  useMockCaptions,
  setUseMockCaptions,
}: MockCaptionsToggleProps) {
  return (
    <div className='flex items-center space-x-2 my-3 p-3 sm:p-4 border rounded-md bg-card shadow-sm'>
      <Switch
        id='mock-captions-toggle'
        checked={useMockCaptions}
        onCheckedChange={setUseMockCaptions}
      />
      <Label htmlFor='mock-captions-toggle' className='cursor-pointer flex-1'>
        <div>
          <h4 className='font-medium text-sm'>Use Mock Captions</h4>
          <p className='text-xs text-muted-foreground'>
            Toggle to use mock captions instead of generating real
            transcriptions. This helps save API costs and speeds up development.
          </p>
        </div>
      </Label>
    </div>
  );
}
