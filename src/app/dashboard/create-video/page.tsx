'use client';

import React from 'react';
import { useVideo } from '@/context/video';
import { Button } from '@/components/ui/button';

// Import new components
import { StorySelector } from '@/components/create-video/StorySelector';
import { CustomPromptInput } from '@/components/create-video/CustomPromptInput';
import { ScriptInput } from '@/components/create-video/ScriptInput';
import { VideoResponse } from '@/components/create-video/VideoResponse';

export default function CreateVideoPage() {
  const {
    script,
    setScript,
    status,
    videoData,
    error,
    createVideo,
    handleStorySelect,
    selectedStory,
    customPrompt,
    setCustomPrompt,
    cancelCustomPrompt,
  } = useVideo();

  const handleCreateVideo = async () => {
    await createVideo(script);
  };

  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold mb-5'>Create Video Page</h1>

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

      {/* Script Input Component */}
      <ScriptInput script={script} setScript={setScript} />

      {/* Create Video Button */}
      <div className='my-5'>
        <Button
          onClick={handleCreateVideo}
          className='bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
          disabled={!script || script === 'Script...' || status === 'creating'}
        >
          {status === 'creating' ? 'Creating...' : 'Create Video'}
        </Button>
      </div>

      {/* Video Response Component */}
      <VideoResponse videoData={videoData} error={error} />
    </div>
  );
}
