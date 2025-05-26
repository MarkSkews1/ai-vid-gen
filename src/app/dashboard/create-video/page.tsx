'use client';

import React from 'react';
import { useVideo } from '@/context/video';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Import components
import { StorySelector } from '@/components/create-video/StorySelector';
import { StyleSelector } from '@/components/create-video/StyleSelector';
import { CustomPromptInput } from '@/components/create-video/CustomPromptInput';
import { VideoResponse } from '@/components/create-video/VideoResponse';
import { LoadingModal } from '@/components/ui/loading-modal';
import DebugImageGeneration from '@/components/create-video/DebugImageGeneration';
import { MockAudioToggle } from '@/components/create-video/MockAudioToggle';
import { MockCaptionsToggle } from '@/components/create-video/MockCaptionsToggle';

export default function CreateVideoPage() {
  const {
    status,
    videoData,
    error,
    handleSubmit,
    handleStorySelect,
    selectedStory,
    customPrompt,
    setCustomPrompt,
    cancelCustomPrompt,
    handleStyleSelect,
    selectedStyle,
    loading,
    showLoadingModal,
    loadingModalMessage,
    useMockAudio,
    setUseMockAudio,
    useMockCaptions,
    setUseMockCaptions,
  } = useVideo();

  const handleCreateVideo = async () => {
    await handleSubmit();
  };
  return (
    <div className='p-4 md:p-10 bg-background min-h-screen text-foreground'>
      <h1 className='text-xl md:text-2xl font-bold mb-4 md:mb-5'>
        Create Video
      </h1>{' '}
      <div className='flex flex-col lg:flex-row gap-4 md:gap-8'>
        {/* Video Preview - Shows above on mobile, right side on large screens */}
        <div className='w-full lg:w-1/2 xl:w-3/5 order-first lg:order-last mb-8 lg:mb-0'>
          {/* Debug Images Section */}
          <DebugImageGeneration />
          {/* Video Response Component */}
          <VideoResponse videoData={videoData} error={error} />
        </div>

        {/* Selectors - Shows below on mobile, left side on large screens */}
        <div className='w-full lg:w-1/2 xl:w-2/5 space-y-6 order-last lg:order-first'>
          {/* Story Selector Component */}
          <StorySelector
            selectedStory={selectedStory}
            handleStorySelect={handleStorySelect}
          />{' '}
          {/* Custom Prompt Input Component */}{' '}
          {selectedStory === 'Enter custom prompt' && (
            <CustomPromptInput
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              cancelCustomPrompt={cancelCustomPrompt}
            />
          )}
          {/* Style Selector Component */}{' '}
          <StyleSelector
            selectedStyle={selectedStyle}
            handleStyleSelect={handleStyleSelect}
          />{' '}
          {/* Mock Audio Toggle */}
          <MockAudioToggle
            useMockAudio={useMockAudio}
            setUseMockAudio={setUseMockAudio}
          />
          {/* Mock Captions Toggle */}
          <MockCaptionsToggle
            useMockCaptions={useMockCaptions}
            setUseMockCaptions={setUseMockCaptions}
          />{' '}
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
      </div>
      {/* Loading Modal */}
      <LoadingModal isOpen={showLoadingModal} message={loadingModalMessage} />
    </div>
  );
}
