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
  const isCreating = status === 'creating' || loading;
  const canCreate = selectedStory || customPrompt;
  return (
    <div className='w-full space-y-6'>
      {/* Enhanced Progress Steps Indicator */}
      <div className='bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg relative overflow-hidden'>
        {/* Background pattern */}
        <div className='absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-50' />

        {/* Animated particles for visual interest */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute h-2 w-2 rounded-full bg-primary/30 top-[20%] left-[10%] animate-float-slow'></div>
          <div
            className='absolute h-1 w-1 rounded-full bg-accent/30 top-[70%] left-[80%] animate-float'
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className='absolute h-1.5 w-1.5 rounded-full bg-secondary/30 top-[40%] left-[60%] animate-float-fast'
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        <div className='relative z-10'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-xl font-bold text-foreground mb-1'>
                Create Your Video
              </h2>
              <p className='text-sm text-muted-foreground'>
                Follow these simple steps to generate your AI video
              </p>
            </div>
            <div className='flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20'>
              <div className='w-2 h-2 bg-primary rounded-full animate-pulse' />
              <span className='text-sm font-medium text-primary'>
                Step {selectedStory ? (selectedStyle ? '3' : '2') : '1'} of 3
              </span>
            </div>
          </div>

          {/* Enhanced progress bar */}
          <div className='flex items-center gap-3'>
            <div
              className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                selectedStory
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg scale-110'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {selectedStory && (
                <div className='absolute inset-0 bg-primary/20 rounded-full animate-ping' />
              )}
              <span className='relative z-10'>1</span>
            </div>

            <div className='flex-1 relative'>
              <div className='h-2 bg-muted rounded-full overflow-hidden'>
                <div
                  className={`h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ${
                    selectedStory ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            </div>

            <div
              className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                selectedStyle
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg scale-110'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {selectedStyle && (
                <div className='absolute inset-0 bg-primary/20 rounded-full animate-ping' />
              )}
              <span className='relative z-10'>2</span>
            </div>

            <div className='flex-1 relative'>
              <div className='h-2 bg-muted rounded-full overflow-hidden'>
                <div
                  className={`h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ${
                    selectedStyle ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            </div>

            <div
              className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                canCreate && selectedStyle
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg scale-110'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {canCreate && selectedStyle && (
                <div className='absolute inset-0 bg-primary/20 rounded-full animate-ping' />
              )}
              <span className='relative z-10'>3</span>
            </div>
          </div>
        </div>
      </div>{' '}
      {/* Enhanced Story Selector Component */}
      <div className='group bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300'>
        <div className='bg-gradient-to-r from-primary/5 via-transparent to-accent/5 p-px'>
          <div className='bg-card/80 backdrop-blur-sm rounded-2xl'>
            <div className='relative overflow-hidden'>
              {/* Animated background elements */}
              <div className='absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-70'></div>
              <div className='absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl opacity-70'></div>

              <StorySelector
                selectedStory={selectedStory}
                handleStorySelect={handleStorySelect}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Enhanced Custom Prompt Input Component */}
      {selectedStory === 'Enter custom prompt' && (
        <div className='bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-300 hover:shadow-xl'>
          <div className='bg-gradient-to-r from-accent/5 via-transparent to-primary/5 p-px'>
            <div className='bg-card/80 backdrop-blur-sm rounded-2xl'>
              <CustomPromptInput
                customPrompt={customPrompt}
                setCustomPrompt={setCustomPrompt}
                cancelCustomPrompt={cancelCustomPrompt}
              />
            </div>
          </div>
        </div>
      )}
      {/* Enhanced Style Selector Component */}
      <div className='group bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300'>
        <div className='bg-gradient-to-r from-primary/5 via-transparent to-accent/5 p-px'>
          <div className='bg-card/80 backdrop-blur-sm rounded-2xl'>
            <div className='relative overflow-hidden'>
              {/* Animated background elements */}
              <div className='absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl opacity-70'></div>
              <div className='absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl opacity-70'></div>

              <StyleSelector
                selectedStyle={selectedStyle}
                handleStyleSelect={handleStyleSelect}
              />
            </div>
          </div>
        </div>
      </div>{' '}
      {/* Enhanced Advanced Settings */}
      <div className='bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg relative overflow-hidden hover:shadow-xl transition-all duration-300'>
        <div className='absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 opacity-50' />

        {/* Decorative elements */}
        <div className='absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-bl from-secondary/20 to-transparent rounded-full blur-2xl'></div>
        <div className='absolute -left-8 -bottom-8 w-32 h-32 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-2xl'></div>

        <div className='relative z-10'>
          {' '}
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-2 bg-secondary/20 rounded-lg'>
              <svg
                className='w-5 h-5 text-secondary-foreground animate-slight-rotate'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-lg font-bold text-foreground'>
                Advanced Settings
              </h3>
              <p className='text-sm text-muted-foreground'>
                Fine-tune your video generation
              </p>
            </div>

            {/* New tooltip button */}
            <div className='relative group ml-auto'>
              <div className='p-2 bg-muted/40 rounded-full cursor-help hover:bg-muted/60 transition-colors duration-300'>
                <svg
                  className='w-4 h-4 text-muted-foreground'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>

              <div className='absolute right-0 w-64 p-4 bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-sm'>
                <h4 className='font-semibold mb-2'>Advanced Options</h4>
                <ul className='space-y-2'>
                  <li className='flex items-start gap-2'>
                    <span className='w-1.5 h-1.5 bg-primary rounded-full mt-1.5'></span>
                    <span>
                      <span className='font-medium'>Mock Audio:</span> Use
                      pre-recorded audio samples
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='w-1.5 h-1.5 bg-primary rounded-full mt-1.5'></span>
                    <span>
                      <span className='font-medium'>Mock Captions:</span> Use
                      sample caption text
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='space-y-6'>
            {/* Enhanced Mock Audio Toggle */}
            <div className='p-4 bg-card/30 backdrop-blur-sm rounded-xl border border-border/30 hover:border-border/50 transition-all duration-300 hover:bg-card/40'>
              <MockAudioToggle
                useMockAudio={useMockAudio}
                setUseMockAudio={setUseMockAudio}
              />
            </div>

            {/* Enhanced Mock Captions Toggle */}
            <div className='p-4 bg-card/30 backdrop-blur-sm rounded-xl border border-border/30 hover:border-border/50 transition-all duration-300 hover:bg-card/40'>
              <MockCaptionsToggle
                useMockCaptions={useMockCaptions}
                setUseMockCaptions={setUseMockCaptions}
              />
            </div>
          </div>
        </div>
      </div>{' '}
      {/* Enhanced Create Video Button */}
      <div className='sticky bottom-0 bg-gradient-to-t from-background via-background/98 to-transparent pt-8 pb-4'>
        <div className='relative'>
          {/* Glow effect for enabled state */}
          {canCreate && !isCreating && (
            <div className='absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20 animate-pulse' />
          )}

          <Button
            onClick={handleCreateVideo}
            className={`relative w-full py-6 text-lg font-bold rounded-2xl shadow-2xl transition-all duration-500 transform ${
              isCreating
                ? 'bg-gradient-to-r from-primary/60 to-primary/40 cursor-not-allowed scale-95'
                : canCreate
                ? 'bg-gradient-to-r from-primary via-primary/90 to-accent hover:from-primary/90 hover:via-primary/80 hover:to-accent/90 hover:shadow-3xl hover:scale-[1.03] active:scale-[0.97] shadow-primary/25'
                : 'bg-gradient-to-r from-muted to-muted/80 cursor-not-allowed opacity-60'
            }`}
            disabled={isCreating || !canCreate}
          >
            {/* Button content with enhanced animations */}
            <div className='relative z-10'>
              {isCreating ? (
                <div className='flex items-center justify-center gap-4'>
                  <div className='relative'>
                    <Loader2 className='h-6 w-6 animate-spin text-primary-foreground' />
                    <div className='absolute inset-0 h-6 w-6 animate-ping bg-primary-foreground/20 rounded-full' />
                  </div>
                  <div className='flex flex-col items-start'>
                    <span className='text-primary-foreground font-bold'>
                      Creating Your Video...
                    </span>
                    <span className='text-primary-foreground/80 text-sm'>
                      This may take a few moments
                    </span>
                  </div>
                </div>
              ) : (
                <div className='flex items-center justify-center gap-4'>
                  <div className='p-2 bg-primary-foreground/20 rounded-full'>
                    <svg
                      className='w-6 h-6 text-primary-foreground'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a4.5 4.5 0 110 9H9V10z'
                      />
                    </svg>
                  </div>
                  <div className='flex flex-col items-start'>
                    <span className='text-primary-foreground font-bold'>
                      Create Video
                    </span>
                    <span className='text-primary-foreground/90 text-sm'>
                      Generate with AI magic
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Animated background particles for enabled state */}
            {canCreate && !isCreating && (
              <div className='absolute inset-0 overflow-hidden rounded-2xl'>
                <div
                  className='absolute top-2 left-4 w-1 h-1 bg-primary-foreground/30 rounded-full animate-ping'
                  style={{ animationDelay: '0s' }}
                />
                <div
                  className='absolute top-4 right-6 w-1 h-1 bg-primary-foreground/30 rounded-full animate-ping'
                  style={{ animationDelay: '1s' }}
                />
                <div
                  className='absolute bottom-3 left-8 w-1 h-1 bg-primary-foreground/30 rounded-full animate-ping'
                  style={{ animationDelay: '2s' }}
                />
              </div>
            )}
          </Button>
        </div>

        {/* Enhanced helper text */}
        {!canCreate && (
          <div className='mt-4 p-4 bg-muted/50 rounded-xl border border-border/50 animate-in fade-in-50 slide-in-from-bottom-3'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-amber-500/20 rounded-full'>
                <svg
                  className='w-4 h-4 text-amber-600 dark:text-amber-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div>
                <p className='text-sm font-medium text-foreground'>
                  Complete the steps above
                </p>
                <p className='text-xs text-muted-foreground'>
                  Select a story type and style to continue
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
