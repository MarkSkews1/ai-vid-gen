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
  } = useVideo();

  const handleCreateVideo = async () => {
    await handleSubmit();
  };
  return (
    <div className='p-10 bg-background min-h-screen text-foreground'>
      <h1 className='text-2xl font-bold mb-5'>Create Video Page</h1>
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
      />
      {/* Mock Audio Toggle */}
      <MockAudioToggle
        useMockAudio={useMockAudio}
        setUseMockAudio={setUseMockAudio}
      />
      {/* Create Video Button */}{' '}
      <div className='my-5'>
        <Button
          onClick={handleCreateVideo}
          className='bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
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
      </div>{' '}
      {/* Debug Images Section */}
      <DebugImageGeneration />
      {/* Video Response Component */}
      <VideoResponse videoData={videoData} error={error} />
      {/* Loading Modal */}
      <LoadingModal isOpen={showLoadingModal} message={loadingModalMessage} />
    </div>
  );
}
