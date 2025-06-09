'use client';

import React from 'react';
import { useVideo } from '@/context/video';
import { LoadingModal } from '@/components/ui/loading-modal';
import { VideoPreviewSection } from '@/components/create-video/VideoPreviewSection';
import { VideoControlsForm } from '@/components/create-video/VideoControlsForm';
import VideoList from '@/components/create-video/VideoList';

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
    <div className='min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden'>
      {/* Enhanced background patterns with better opacity and positioning */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-accent/5 opacity-25' />
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-primary/5 opacity-30' />
      {/* Animated mesh gradient overlay with improved animations */}
      <div className='absolute inset-0 opacity-40'>
        <div className='absolute top-0 -left-8 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float'></div>
        <div
          className='absolute top-0 -right-8 w-80 h-80 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float'
          style={{ animationDelay: '2s', animationDuration: '6s' }}
        ></div>
        <div
          className='absolute -bottom-16 left-20 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float'
          style={{ animationDelay: '4s', animationDuration: '8s' }}
        ></div>
      </div>
      {/* Hero Section - Enhanced with better animations and spacing */}
      <div className='relative pt-6 pb-12 md:pt-10 md:pb-20 px-4 md:px-10 z-10'>
        {/* Enhanced floating decorative elements with varying sizes and better positioning */}
        <div className='absolute top-20 left-10 w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-xl animate-float shadow-2xl'></div>
        <div
          className='absolute top-32 right-16 w-20 h-20 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-xl animate-float shadow-xl'
          style={{ animationDelay: '1s', animationDuration: '7s' }}
        ></div>
        <div
          className='absolute bottom-10 left-1/4 w-16 h-16 bg-gradient-to-r from-primary/8 to-secondary/8 rounded-full blur-xl animate-float shadow-lg'
          style={{ animationDelay: '2s', animationDuration: '5s' }}
        ></div>

        <div className='relative z-10 max-w-7xl mx-auto'>
          <div className='text-center mb-10'>
            {/* Enhanced badge with better contrast and animation */}
            <div className='inline-flex items-center gap-2 px-5 py-2 bg-primary/10 rounded-full border border-primary/25 mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700 hover:bg-primary/15 transition-colors'>
              <svg
                className='w-4 h-4 text-primary animate-pulse'
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
              <span className='text-sm font-medium text-primary'>
                AI-Powered Video Generation
              </span>
            </div>

            {/* Enhanced heading with better text gradient and animation */}
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700 leading-tight tracking-tight'>
              Create Your Video
            </h1>

            {/* Enhanced subtitle with better spacing and typography */}
            <p
              className='text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 leading-relaxed'
              style={{ animationDelay: '0.2s' }}
            >
              Transform your ideas into captivating videos with AI-powered
              storytelling and stunning visuals
            </p>

            {/* Enhanced feature highlights with better spacing and animations */}
            <div
              className='flex flex-wrap justify-center gap-6 mt-12 animate-in fade-in slide-in-from-bottom-5 duration-700'
              style={{ animationDelay: '0.4s' }}
            >
              <div className='group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary/15'>
                <div className='p-2 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors duration-300'>
                  <svg
                    className='w-4 h-4 text-primary'
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
                </div>
                <span className='text-sm font-semibold text-primary'>
                  AI-Powered Generation
                </span>
              </div>

              <div className='group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-full border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-accent/15'>
                <div className='p-2 bg-accent/20 rounded-full group-hover:bg-accent/30 transition-colors duration-300'>
                  <svg
                    className='w-4 h-4 text-accent-foreground'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <span className='text-sm font-semibold text-accent-foreground'>
                  Lightning Fast
                </span>
              </div>

              <div className='group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-full border border-border hover:border-secondary/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-secondary/15'>
                <div className='p-2 bg-secondary/30 rounded-full group-hover:bg-secondary/40 transition-colors duration-300'>
                  <svg
                    className='w-4 h-4 text-secondary-foreground'
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
                </div>
                <span className='text-sm font-semibold text-secondary-foreground'>
                  Custom Stories
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content - Enhanced with better card styling and responsive design */}{' '}
      <div className='relative px-4 md:px-10 pb-16 z-10'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12'>
            {/* Video Controls Form Section - Enhanced with better sticky positioning and card styling */}
            <div className='xl:col-span-5 order-last xl:order-first'>
              <div className='sticky top-8'>
                <div className='bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl p-1.5 shadow-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)]'>
                  <div className='bg-card/50 backdrop-blur-sm rounded-xl p-4 md:p-6 lg:p-8'>
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
              </div>
            </div>{' '}
            {/* Video Preview Section - Enhanced with better card styling and hover effects */}
            <div className='xl:col-span-7 order-first xl:order-last'>
              <div className='bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl p-1.5 shadow-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.15)]'>
                {' '}
                <div className='bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden'>
                  {' '}
                  <VideoPreviewSection videoData={videoData} error={error} />
                  {/* Show VideoList component for individual scene players */}
                  {videoData &&
                    videoData.scenes &&
                    videoData.scenes.length > 0 && (
                      <div className='p-6 border-t border-border/50'>
                        <VideoList />
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Loading Modal - No changes needed as it's a separate component */}
      <LoadingModal isOpen={showLoadingModal} message={loadingModalMessage} />
    </div>
  );
}
