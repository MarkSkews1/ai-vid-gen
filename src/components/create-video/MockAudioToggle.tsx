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
    <div
      className={`group relative overflow-hidden transition-all duration-500 ease-out ${
        useMockAudio
          ? 'bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 border-primary/40 shadow-lg scale-[1.02]'
          : 'bg-gradient-to-br from-muted/20 to-background/50 border-border/50 hover:border-primary/30'
      } rounded-xl border backdrop-blur-sm hover:shadow-md`}
    >
      {/* Enhanced background pattern */}
      {useMockAudio && (
        <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50' />
      )}

      {/* Subtle animated background */}
      <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500' />

      <div className='relative p-6 flex items-center justify-between'>
        <div className='flex-1'>
          <Label htmlFor='mock-audio-toggle' className='cursor-pointer'>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <div
                  className={`p-2.5 rounded-lg transition-all duration-300 ${
                    useMockAudio
                      ? 'bg-primary/20 ring-2 ring-primary/30'
                      : 'bg-muted/30 group-hover:bg-primary/10'
                  }`}
                >
                  <svg
                    className={`w-5 h-5 transition-colors duration-300 ${
                      useMockAudio
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-primary/70'
                    }`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.5 12H12l4 4V8l-4 4H5.5z'
                    />
                  </svg>
                </div>
                <div>
                  <h4
                    className={`font-semibold transition-colors duration-300 ${
                      useMockAudio ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    Use Mock Audio
                  </h4>
                  {useMockAudio && (
                    <div className='flex items-center gap-1 mt-1'>
                      <div className='w-1.5 h-1.5 bg-primary rounded-full animate-pulse' />
                      <span className='text-xs text-primary font-medium'>
                        Active
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <p className='text-sm text-muted-foreground leading-relaxed pl-11'>
                Use sample audio files for faster testing instead of generating
                real AI voiceover. Perfect for development and quick iterations.
              </p>
            </div>
          </Label>
        </div>
        <div className='ml-6'>
          <Switch
            id='mock-audio-toggle'
            checked={useMockAudio}
            onCheckedChange={setUseMockAudio}
            className='data-[state=checked]:bg-primary data-[state=checked]:border-primary/50 
              transition-all duration-300 hover:scale-105'
          />
        </div>{' '}
      </div>
    </div>
  );
}
