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
    <div className='mb-6 p-4 sm:p-6 rounded-lg bg-background/50'>
      <h2 className='text-lg font-semibold mb-4'>
        Select a Story Type or Enter a Custom Prompt
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-4'>
        {storyOptions.map((option: StoryOption) => (
          <Button
            key={option.label}
            variant={selectedStory === option.label ? 'default' : 'outline'}
            className={`h-auto py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 flex flex-col items-center justify-center w-full
              transition-all duration-300 ease-in-out cursor-pointer border-2 
              transform hover:scale-105 hover:shadow-lg min-h-[60px] sm:min-h-[70px] md:min-h-[80px] ${
                selectedStory === option.label
                  ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary/50 hover:bg-primary/90 hover:ring-4'
                  : 'border-gray-200 hover:border-primary hover:bg-gradient-to-br hover:from-accent/30 hover:to-primary/20'
              }`}
            onClick={() => handleStorySelect(option.label)}
          >
            <span className='font-semibold text-center text-xs sm:text-sm line-clamp-2 break-words'>
              {option.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
