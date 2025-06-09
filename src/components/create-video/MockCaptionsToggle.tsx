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
    <div
      className={`group relative overflow-hidden transition-all duration-500 ease-out ${
        useMockCaptions
          ? 'bg-gradient-to-br from-accent/20 via-accent/10 to-primary/10 border-accent/40 shadow-lg scale-[1.02]'
          : 'bg-gradient-to-br from-muted/20 to-background/50 border-border/50 hover:border-accent/30'
      } rounded-xl border backdrop-blur-sm hover:shadow-md`}
    >
      {/* Enhanced background pattern */}
      {useMockCaptions && (
        <div className='absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5 opacity-50' />
      )}
      {/* Subtle animated background */}
      <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/5 to-transparent rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500' />
      <div className='relative p-6 flex items-center justify-between'>
        <div className='flex-1'>
          <Label htmlFor='mock-captions-toggle' className='cursor-pointer'>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <div
                  className={`p-2.5 rounded-lg transition-all duration-300 ${
                    useMockCaptions
                      ? 'bg-accent/20 ring-2 ring-accent/30'
                      : 'bg-muted/30 group-hover:bg-accent/10'
                  }`}
                >
                  <svg
                    className={`w-5 h-5 transition-colors duration-300 ${
                      useMockCaptions
                        ? 'text-accent-foreground'
                        : 'text-muted-foreground group-hover:text-accent/70'
                    }`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                </div>
                <div>
                  <h4
                    className={`font-semibold transition-colors duration-300 ${
                      useMockCaptions
                        ? 'text-accent-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    Use Mock Captions
                  </h4>
                  {useMockCaptions && (
                    <div className='flex items-center gap-1 mt-1'>
                      <div className='w-1.5 h-1.5 bg-accent rounded-full animate-pulse' />
                      <span className='text-xs text-accent-foreground font-medium'>
                        Active
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <p className='text-sm text-muted-foreground leading-relaxed pl-11'>
                Use sample captions for faster testing instead of generating
                real transcriptions. Ideal for rapid prototyping and
                development.
              </p>
            </div>
          </Label>
        </div>

        <div className='ml-6'>
          <Switch
            id='mock-captions-toggle'
            checked={useMockCaptions}
            onCheckedChange={setUseMockCaptions}
            className='data-[state=checked]:bg-accent data-[state=checked]:border-accent/50 
              transition-all duration-300 hover:scale-105'
          />
        </div>
      </div>{' '}
    </div>
  );
}
