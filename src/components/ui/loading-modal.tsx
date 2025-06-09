import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export function LoadingModal({
  isOpen,
  message = 'Processing your request...',
}: LoadingModalProps) {
  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent className='sm:max-w-md flex flex-col items-center justify-center p-8 bg-card/95 backdrop-blur-md border border-border/50 shadow-2xl'>
        <VisuallyHidden>
          <DialogTitle>Loading Progress</DialogTitle>
        </VisuallyHidden>

        {/* Enhanced loading animation */}
        <div className='relative mb-6'>
          {/* Outer pulsing ring */}
          <div className='absolute inset-0 w-24 h-24 rounded-full border-4 border-primary/20 animate-pulse-ring'></div>

          {/* Main loading container */}
          <div className='w-24 h-24 relative'>
            <Image
              src='/progress.gif'
              alt='Loading'
              fill
              style={{ objectFit: 'contain' }}
              priority
              unoptimized
              className='rounded-full'
            />
          </div>

          {/* Inner glowing dot */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-2 h-2 bg-primary rounded-full animate-pulse'></div>
          </div>
        </div>

        {/* Message with shimmer effect */}
        <div className='text-center space-y-2'>
          <p className='text-lg font-semibold text-foreground animate-pulse'>
            {message}
          </p>
          <div className='flex items-center justify-center gap-1'>
            <div className='w-2 h-2 bg-primary rounded-full animate-bounce'></div>
            <div
              className='w-2 h-2 bg-primary rounded-full animate-bounce'
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className='w-2 h-2 bg-primary rounded-full animate-bounce'
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className='w-full mt-6'>
          <div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
            <div className='h-full bg-gradient-to-r from-primary to-primary/70 animate-shimmer'></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
