import React, { useState, useEffect } from 'react';
import { ValidatedInput } from '@/components/ui/regex-validator';
import { Button } from '@/components/ui/button';

interface CustomPromptInputProps {
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  cancelCustomPrompt: () => void;
}

export function CustomPromptInput({
  customPrompt,
  setCustomPrompt,
  cancelCustomPrompt,
}: CustomPromptInputProps) {
  // Track focus state for enhanced interactions
  const [isFocused, setIsFocused] = useState(false);
  // Track typing activity for animations
  const [isTyping, setIsTyping] = useState(false);

  // Simulate typing detection
  useEffect(() => {
    let typingTimer: NodeJS.Timeout;
    if (customPrompt) {
      setIsTyping(true);
      typingTimer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }

    return () => {
      clearTimeout(typingTimer);
    };
  }, [customPrompt]);

  return (
    <div className='p-8 space-y-6'>
      {/* Enhanced header section */}
      <div className='mb-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 bg-primary/20 rounded-lg'>
            <svg
              className='w-6 h-6 text-primary animate-slight-rotate'
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
          <div>
            <h3 className='text-2xl font-bold text-foreground'>
              Custom Story Prompt
            </h3>
            <p className='text-muted-foreground'>
              Describe your story idea in detail. Be creative and specific to
              get the best results.
            </p>
          </div>
        </div>

        {/* Tips section with enhanced visual effects */}
        <div
          className={`bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-4 border transition-all duration-300 ${
            isFocused ? 'border-accent/40 shadow-lg' : 'border-accent/20'
          }`}
        >
          <div className='flex items-start gap-3'>
            <div
              className={`p-1 rounded-lg mt-0.5 transition-all duration-300 ${
                isFocused ? 'bg-accent/30 animate-pulse' : 'bg-accent/20'
              }`}
            >
              <svg
                className='w-4 h-4 text-accent'
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
              <h4 className='font-medium text-foreground mb-1'>Writing Tips</h4>
              <ul className='text-sm text-muted-foreground space-y-1'>
                <li>• Include characters, setting, and main conflict</li>
                <li>• Describe the mood and atmosphere you want</li>
                <li>• Mention specific visual elements or scenes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Enhanced input section with micro-interactions */}
      <div className='relative'>
        <ValidatedInput
          id='customPrompt'
          label='Your Story Idea'
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder='Tell me about a brave explorer who discovers a hidden magical forest where time moves differently...'
          validationRule={{
            pattern: /^[\s\S]{10,5000}$/,
            message: 'Custom prompt should be between 10 and 5000 characters',
          }}
          onValidationChange={(isValid) => {
            console.log('Custom prompt validation status:', isValid);
          }}
          className={`min-h-[140px] transition-all duration-500 border-2 
            focus:border-primary focus:ring-4 focus:ring-primary/20 
            focus:shadow-2xl resize-none backdrop-blur-sm
            hover:bg-background/70 placeholder:text-muted-foreground/60 ${
              isFocused ? 'bg-background/80' : 'bg-background/60'
            }`}
          labelClassName='text-foreground font-semibold mb-3 text-base'
          containerClassName={`bg-gradient-to-br from-background/90 via-card/50 to-accent/5 p-6 
            rounded-2xl border transition-all duration-500 ${
              isFocused
                ? 'border-primary/60 shadow-xl ring-2 ring-primary/20 scale-[1.01]'
                : 'border-border/50 hover:border-primary/40 hover:shadow-lg'
            } backdrop-blur-md`}
        />

        {/* Animated typing indicator */}
        {isTyping && (
          <div className='absolute top-6 right-6 flex space-x-1'>
            <div
              className='w-2 h-2 bg-primary rounded-full animate-bounce'
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className='w-2 h-2 bg-primary rounded-full animate-bounce'
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className='w-2 h-2 bg-primary rounded-full animate-bounce'
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
        )}

        {/* Floating word count indicator with enhanced states */}
        <div className='absolute bottom-4 right-4'>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              customPrompt.length < 10
                ? 'bg-destructive/10 text-destructive border border-destructive/20'
                : customPrompt.length > 4500
                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                : 'bg-primary/10 text-primary border border-primary/20'
            } ${isFocused ? 'scale-110 shadow-md' : ''}`}
          >
            {customPrompt.length}/5000
          </div>
        </div>
      </div>

      {/* Enhanced action section */}
      <div className='flex items-center justify-between pt-4'>
        <div className='flex items-center gap-2'>
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              customPrompt.length >= 10
                ? 'bg-primary animate-pulse'
                : 'bg-muted'
            }`}
          />
          <span
            className={`text-sm font-medium transition-colors duration-300 ${
              customPrompt.length >= 10
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            {customPrompt.length >= 10
              ? 'Ready to generate!'
              : 'Add more details...'}
          </span>
        </div>
        <Button
          onClick={cancelCustomPrompt}
          variant='outline'
          size='sm'
          className='border-destructive/40 text-destructive hover:bg-destructive/10 
            hover:border-destructive/60 transition-all duration-300 hover:scale-105
            hover:shadow-md backdrop-blur-sm group'
        >
          <svg
            className='w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
          Cancel Custom Prompt
        </Button>
      </div>
    </div>
  );
}
