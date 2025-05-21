import React from 'react';
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
  return (
    <div className='mb-5'>
      <ValidatedInput
        id='customPrompt'
        label='Enter Your Custom Prompt'
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        placeholder='Enter your custom prompt here...'
        validationRule={{
          pattern: /^[\s\S]{10,5000}$/,
          message: 'Custom prompt should be between 10 and 5000 characters',
        }}
        onValidationChange={(isValid) => {
          console.log('Custom prompt validation status:', isValid);
        }}
        className='transition-all duration-300 border-2 
          focus:border-purple-500 focus:ring-4 focus:ring-purple-200 
          focus:shadow-lg focus:outline-none active:border-purple-700
          hover:border-purple-300'
        labelClassName='text-purple-700 font-semibold transform transition-all 
          duration-300 scale-105 mb-2'
        containerClassName='bg-gradient-to-r from-blue-50 to-purple-50 p-5 
          rounded-lg border border-purple-100 shadow-md transition-all 
          duration-500 hover:shadow-lg hover:from-blue-100 hover:to-purple-100
          focus-within:shadow-xl focus-within:from-white focus-within:to-purple-100'
      />
      <div className='mt-3 flex justify-end'>
        <Button
          onClick={cancelCustomPrompt}
          variant='outline'
          className='border-red-300 hover:bg-red-50 hover:text-red-600'
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
