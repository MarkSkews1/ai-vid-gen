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
    <div className='p-8'>
      {/* Enhanced header section */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 bg-primary/20 rounded-lg'>
            <svg
              className='w-6 h-6 text-primary'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z'
              />
            </svg>
          </div>
          <div>
            <h2 className='text-2xl font-bold text-foreground'>
              Choose Your Style
            </h2>
            <p className='text-muted-foreground'>
              Select a visual style that matches your story&apos;s mood and
              aesthetic
            </p>
          </div>
        </div>

        {/* Style count badge */}
        <div className='inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20'>
          <div className='w-2 h-2 bg-primary rounded-full animate-pulse' />
          <span className='text-sm font-medium text-primary'>
            {styleOptions.length} styles available
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {styleOptions.map((style, index) => (
          <div
            key={style.name}
            onClick={() => handleStyleSelect(style.name.toLowerCase())}
            className={`group cursor-pointer transition-all duration-500 ease-out ${
              selectedStyle === style.name.toLowerCase()
                ? 'scale-105 ring-4 ring-primary/30 ring-offset-2 ring-offset-background'
                : 'hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-1'
            }`}
          >
            <div
              className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-500 backdrop-blur-sm ${
                selectedStyle === style.name.toLowerCase()
                  ? 'border-primary shadow-2xl bg-primary/5'
                  : 'border-border/50 group-hover:border-primary/60 group-hover:bg-accent/10'
              }`}
            >
              {/* Animated background for selected */}
              {selectedStyle === style.name.toLowerCase() && (
                <div className='absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur opacity-25 animate-pulse' />
              )}

              {/* Image Container */}
              <div className='relative aspect-[4/3] overflow-hidden'>
                <Image
                  src={style.image}
                  alt={`${style.name} style`}
                  fill
                  sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw'
                  className={`object-cover transition-all duration-500 ${
                    selectedStyle === style.name.toLowerCase()
                      ? 'scale-110 brightness-110'
                      : 'group-hover:scale-110 group-hover:brightness-105'
                  }`}
                  priority={index < 4}
                  unoptimized={true}
                />

                {/* Enhanced gradient overlay */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    selectedStyle === style.name.toLowerCase()
                      ? 'bg-gradient-to-t from-primary/30 via-black/10 to-transparent'
                      : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/60'
                  }`}
                />

                {/* Style name overlay with enhanced styling */}
                <div className='absolute bottom-0 left-0 right-0 p-4'>
                  <div
                    className={`backdrop-blur-sm rounded-lg p-2 transition-all duration-300 ${
                      selectedStyle === style.name.toLowerCase()
                        ? 'bg-primary/20 border border-primary/30'
                        : 'bg-black/30 group-hover:bg-black/40'
                    }`}
                  >
                    {' '}
                    <h3
                      className={`font-bold text-white transition-all duration-300 ${
                        selectedStyle === style.name.toLowerCase()
                          ? 'text-base'
                          : 'text-sm group-hover:text-base'
                      }`}
                    >
                      {style.name}
                    </h3>
                  </div>
                </div>

                {/* Enhanced selection indicator */}
                {selectedStyle === style.name.toLowerCase() && (
                  <div className='absolute top-3 right-3 animate-in fade-in zoom-in duration-300'>
                    <div className='relative'>
                      <div className='absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-40 animate-pulse' />
                      <div className='relative w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-primary-foreground/20'>
                        <svg
                          className='w-5 h-5 text-primary-foreground'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced hover effect overlay */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    selectedStyle === style.name.toLowerCase()
                      ? 'bg-gradient-to-t from-primary/20 to-transparent opacity-100'
                      : 'bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100'
                  }`}
                />

                {/* Shimmer effect on hover */}
                <div
                  className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out ${
                    selectedStyle !== style.name.toLowerCase()
                      ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
                      : ''
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
