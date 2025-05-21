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
    <div className='mb-8 p-6 rounded-lg'>
      <h2 className='text-lg font-semibold mb-4'>
        Select a Story Type or Enter a Custom Prompt
      </h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-5'>
        {storyOptions.map((option: StoryOption) => (
          <Button
            key={option.label}
            variant={selectedStory === option.label ? 'default' : 'outline'}
            className={`h-auto py-6 px-3 flex flex-col items-center justify-center w-full
              transition-all duration-300 ease-in-out cursor-pointer border-2 
              transform hover:scale-105 hover:shadow-lg ${
                selectedStory === option.label
                  ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary/50 hover:bg-primary/90 hover:ring-4'
                  : 'border-gray-200 hover:border-primary hover:bg-gradient-to-br hover:from-accent/30 hover:to-primary/20'
              }`}
            onClick={() => handleStorySelect(option.label)}
          >
            <span className='font-semibold text-center'>{option.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
