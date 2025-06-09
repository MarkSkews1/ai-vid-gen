import React from 'react';
import { Button } from '@/components/ui/button';
import { storyOptions, StoryOption } from '@/constants';

interface StorySelectorProps {
  selectedStory: string;
  handleStorySelect: (story: string) => void;
}

export function StorySelector({
  selectedStory,
  handleStorySelect,
}: StorySelectorProps) {
  return (
    <div className='p-8'>
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
                d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
              />
            </svg>
          </div>
          <div>
            <h2 className='text-2xl font-bold text-foreground'>
              Choose Your Story
            </h2>
            <p className='text-muted-foreground'>
              Select a story type or create your own custom prompt
            </p>
          </div>
        </div>

        {/* Story count indicator */}
        <div className='inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20'>
          <div className='w-2 h-2 bg-primary rounded-full animate-pulse' />
          <span className='text-sm font-medium text-primary'>
            {storyOptions.length} story options available
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
        {storyOptions.map((option: StoryOption, index) => (
          <Button
            key={option.label}
            variant={selectedStory === option.label ? 'default' : 'outline'}
            className={`h-auto p-6 flex flex-col items-center justify-center w-full
              transition-all duration-500 ease-in-out cursor-pointer group
              relative overflow-hidden min-h-[140px] ${
                selectedStory === option.label
                  ? 'bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground border-primary shadow-2xl scale-105 ring-4 ring-primary/30'
                  : 'border-border hover:border-primary/50 hover:bg-gradient-to-br hover:from-accent/20 hover:to-primary/10 hover:shadow-xl hover:scale-[1.03]'
              }`}
            onClick={() => handleStorySelect(option.label)}
            style={{
              animationDelay: `${index * 50}ms`,
              transitionDelay: `${index * 50}ms`,
            }}
          >
            {/* Enhanced background patterns */}
            {option.type === 'custom' ? (
              <>
                <div className='absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/30 opacity-60' />
                <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-accent/10 to-transparent' />
                {/* Animated particles for custom option */}
                <div className='absolute h-2 w-2 rounded-full bg-primary/40 top-[20%] left-[10%] animate-float-slow'></div>
                <div
                  className='absolute h-1 w-1 rounded-full bg-accent/40 top-[70%] left-[80%] animate-float'
                  style={{ animationDelay: '1s' }}
                ></div>
              </>
            ) : (
              <div className='absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500'>
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    option.label.includes('Adventure')
                      ? 'from-amber-500/30 to-orange-500/30'
                      : option.label.includes('Sci-Fi')
                      ? 'from-blue-500/30 to-indigo-500/30'
                      : option.label.includes('Romance')
                      ? 'from-pink-500/30 to-rose-500/30'
                      : option.label.includes('Mystery')
                      ? 'from-purple-500/30 to-violet-500/30'
                      : option.label.includes('Comedy')
                      ? 'from-green-500/30 to-emerald-500/30'
                      : 'from-primary/30 to-accent/30'
                  }`}
                />
              </div>
            )}

            {/* Enhanced selection glow effect */}
            {selectedStory === option.label && (
              <>
                <div className='absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-30 animate-pulse' />
                <div className='absolute inset-0 bg-primary/10 animate-pulse-ring rounded-xl'></div>
              </>
            )}

            <div className='relative z-10 text-center'>
              {/* Enhanced icon based on story type */}
              <div
                className={`mb-4 p-3 rounded-full transition-all duration-300 ${
                  selectedStory === option.label
                    ? 'bg-primary-foreground/20 scale-110'
                    : 'bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110'
                }`}
              >
                {option.type === 'custom' ? (
                  <svg
                    className='w-8 h-8 mx-auto animate-slight-rotate'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                    />
                  </svg>
                ) : option.label.includes('Adventure') ? (
                  <svg
                    className='w-6 h-6 mx-auto'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                ) : option.label.includes('Romance') ? (
                  <svg
                    className='w-6 h-6 mx-auto'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                    />
                  </svg>
                ) : option.label.includes('Sci-Fi') ? (
                  <svg
                    className='w-6 h-6 mx-auto'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                ) : option.label.includes('Mystery') ? (
                  <svg
                    className='w-6 h-6 mx-auto'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                ) : option.label.includes('Comedy') ? (
                  <svg
                    className='w-6 h-6 mx-auto'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-6 h-6 mx-auto'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
                    />
                  </svg>
                )}
              </div>{' '}
              <h3
                className={`font-bold transition-all duration-300 ${
                  selectedStory === option.label
                    ? 'text-base text-primary-foreground mb-2'
                    : 'text-sm text-foreground mb-1 group-hover:text-primary'
                }`}
              >
                {option.label}
              </h3>{' '}
              <p
                className={`text-xs transition-all duration-300 ${
                  selectedStory === option.label
                    ? 'text-primary-foreground/80'
                    : 'text-muted-foreground group-hover:text-foreground'
                }`}
              >
                {option.label}
              </p>
              {/* Selection indicator */}
              {selectedStory === option.label && (
                <div className='mt-4 inline-flex items-center gap-1 px-2 py-1 bg-primary-foreground/20 rounded-full'>
                  <div className='w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse'></div>
                  <span className='text-xs font-medium text-primary-foreground'>
                    Selected
                  </span>
                </div>
              )}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
