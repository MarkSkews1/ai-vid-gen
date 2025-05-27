import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { StorySelector } from './StorySelector';
import { StyleSelector } from './StyleSelector';
import { CustomPromptInput } from './CustomPromptInput';
import { MockAudioToggle } from './MockAudioToggle';
import { MockCaptionsToggle } from './MockCaptionsToggle';

interface VideoControlsFormProps {
  status: string;
  loading: boolean;
  selectedStory: string;
  customPrompt: string;
  selectedStyle: string;
  useMockAudio: boolean;
  useMockCaptions: boolean;
  handleStorySelect: (story: string) => void;
  setCustomPrompt: (prompt: string) => void;
  cancelCustomPrompt: () => void;
  handleStyleSelect: (style: string) => void;
  setUseMockAudio: (use: boolean) => void;
  setUseMockCaptions: (use: boolean) => void;
  handleCreateVideo: () => Promise<void>;
}

export const VideoControlsForm: React.FC<VideoControlsFormProps> = ({
  status,
  loading,
  selectedStory,
  customPrompt,
  selectedStyle,
  useMockAudio,
  useMockCaptions,
  handleStorySelect,
  setCustomPrompt,
  cancelCustomPrompt,
  handleStyleSelect,
  setUseMockAudio,
  setUseMockCaptions,
  handleCreateVideo,
}) => {
  return (
    <div className='w-full space-y-6'>
      {/* Story Selector Component */}
      <StorySelector
        selectedStory={selectedStory}
        handleStorySelect={handleStorySelect}
      />

      {/* Custom Prompt Input Component */}
      {selectedStory === 'Enter custom prompt' && (
        <CustomPromptInput
          customPrompt={customPrompt}
          setCustomPrompt={setCustomPrompt}
          cancelCustomPrompt={cancelCustomPrompt}
        />
      )}

      {/* Style Selector Component */}
      <StyleSelector
        selectedStyle={selectedStyle}
        handleStyleSelect={handleStyleSelect}
      />

      {/* Mock Audio Toggle */}
      <MockAudioToggle
        useMockAudio={useMockAudio}
        setUseMockAudio={setUseMockAudio}
      />

      {/* Mock Captions Toggle */}
      <MockCaptionsToggle
        useMockCaptions={useMockCaptions}
        setUseMockCaptions={setUseMockCaptions}
      />

      {/* Create Video Button */}
      <div className='mt-4 sm:mt-6'>
        <Button
          onClick={handleCreateVideo}
          className='bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer w-full py-3 text-base font-medium shadow-md transition-all hover:shadow-lg'
          disabled={
            status === 'creating' ||
            loading ||
            (!selectedStory && !customPrompt)
          }
        >
          {status === 'creating' || loading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Creating...
            </>
          ) : (
            'Create Video'
          )}
        </Button>
      </div>
    </div>
  );
};
