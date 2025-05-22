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
      <DialogContent className='sm:max-w-md flex flex-col items-center justify-center p-6'>
        <VisuallyHidden>
          <DialogTitle>Loading Progress</DialogTitle>
        </VisuallyHidden>
        <div className='w-32 h-32 relative mb-4'>
          <Image
            src='/progress.gif'
            alt='Loading'
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <p className='text-center text-lg font-medium'>{message}</p>
      </DialogContent>
    </Dialog>
  );
}
