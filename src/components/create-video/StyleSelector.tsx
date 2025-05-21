import React from 'react';
import Image from 'next/image';
import { styleOptions } from '@/constants';

interface StyleSelectorProps {
  selectedStyle: string;
  handleStyleSelect: (style: string) => void;
}

export function StyleSelector({
  selectedStyle,
  handleStyleSelect,
}: StyleSelectorProps) {
  return (
    <div className='mb-8'>
      <h2 className='text-lg font-semibold mb-4'>Select a video style</h2>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-5'>
        {styleOptions.map((style, index) => (
          <div
            key={style.name}
            onClick={() => handleStyleSelect(style.name.toLowerCase())}
            className={`flex flex-col items-center p-3 border rounded-lg transition-all cursor-pointer group
              ${
                selectedStyle === style.name.toLowerCase()
                  ? 'border-primary border-2 bg-primary/10 shadow-md scale-105 ring-2 ring-primary ring-opacity-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
          >
            <div className='w-full h-32 overflow-hidden rounded-md relative'>
              <Image
                src={style.image}
                alt={`${style.name} style`}
                fill
                sizes='(max-width: 768px) 50vw, 25vw'
                className='object-cover'
                priority={index < 4} // Load first 4 images with priority
              />
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='bg-black bg-opacity-40 px-3 py-1 rounded-md'>
                  <span
                    className={`font-semibold text-white text-center
                    ${
                      selectedStyle === style.name.toLowerCase()
                        ? 'text-white font-bold'
                        : ''
                    }`}
                  >
                    {style.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
