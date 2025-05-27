'use client';

import React from 'react';
import { useVideo } from '@/context/video';
import { LoadingModal } from '@/components/ui/loading-modal';
import { VideoPreviewSection } from '@/components/create-video/VideoPreviewSection';
import { VideoControlsForm } from '@/components/create-video/VideoControlsForm';

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
    try {
      await handleSubmit();
    } catch (error) {
      console.error('Error creating video:', error);
    }
  };

  return (
    <div className='p-4 md:p-10 bg-background min-h-screen text-foreground'>
      <h1 className='text-xl md:text-2xl font-bold mb-4 md:mb-5'>
        Create Video
      </h1>

      <div className='flex flex-col lg:flex-row gap-4 md:gap-8'>
        {/* Video Preview Section */}
        <div className='w-full lg:w-1/2 xl:w-3/5 order-first lg:order-last mb-8 lg:mb-0'>
          <VideoPreviewSection videoData={videoData} error={error} />
        </div>

        {/* Video Controls Form Section */}
        <div className='w-full lg:w-1/2 xl:w-2/5 order-last lg:order-first'>
          <VideoControlsForm
            status={status}
            loading={loading}
            selectedStory={selectedStory}
            customPrompt={customPrompt}
            selectedStyle={selectedStyle}
            useMockAudio={useMockAudio}
            useMockCaptions={useMockCaptions}
            handleStorySelect={handleStorySelect}
            setCustomPrompt={setCustomPrompt}
            cancelCustomPrompt={cancelCustomPrompt}
            handleStyleSelect={handleStyleSelect}
            setUseMockAudio={setUseMockAudio}
            setUseMockCaptions={setUseMockCaptions}
            handleCreateVideo={handleCreateVideo}
          />
        </div>
      </div>

      {/* Loading Modal */}
      <LoadingModal isOpen={showLoadingModal} message={loadingModalMessage} />
    </div>
  );
}
