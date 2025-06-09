import React from 'react';

interface CaptionControlsProps {
  showCaptions: boolean;
  onToggleCaptions: (show: boolean) => void;
}

export const CaptionControls: React.FC<CaptionControlsProps> = ({
  showCaptions,
  onToggleCaptions,
}) => {
  return (
    <div className='absolute top-2 right-2 flex items-center space-x-2 z-20'>
      <div className='text-xs bg-black/60 text-white px-2 py-1 rounded flex items-center'>
        <span className='mr-2'>Captions: {showCaptions ? 'On' : 'Off'}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCaptions(!showCaptions);
          }}
          className={`w-8 h-5 rounded-full relative transition-colors ${
            showCaptions ? 'bg-purple-500' : 'bg-gray-400'
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
              showCaptions ? 'left-4' : 'left-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
