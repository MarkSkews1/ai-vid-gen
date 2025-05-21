import React from 'react';
import { ValidatedTextArea } from '@/components/ui/regex-validator';

interface ScriptInputProps {
  script: string;
  setScript: (script: string) => void;
}

export function ScriptInput({ script, setScript }: ScriptInputProps) {
  return (
    <div className='mb-5'>
      <ValidatedTextArea
        id='script'
        label='Enter Your Video Script'
        className='h-40'
        value={script === 'Script...' ? '' : script}
        onChange={(e) => setScript(e.target.value || 'Script...')}
        placeholder='Enter your video script here...'
        validationRule={{
          pattern: /^[\s\S]{10,5000}$/,
          message: 'Script should be between 10 and 5000 characters',
        }}
        onValidationChange={(isValid) => {
          console.log('Script validation status:', isValid);
        }}
      />
    </div>
  );
}
