'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface CaptionSettingsProps {
  showCaptions: boolean;
  onToggleCaptions: (value: boolean) => void;
  onStyleChange: (style: {
    backgroundColor: string;
    textColor: string;
    fontSize: string;
  }) => void;
}

const backgroundOptions = [
  { label: 'Black', value: 'rgba(0, 0, 0, 0.7)' },
  { label: 'Dark Gray', value: 'rgba(45, 45, 45, 0.8)' },
  { label: 'Blue', value: 'rgba(30, 64, 175, 0.7)' },
  { label: 'Purple', value: 'rgba(88, 28, 135, 0.7)' },
];

const textColorOptions = [
  { label: 'White', value: 'white' },
  { label: 'Yellow', value: '#FBBF24' },
  { label: 'Light Gray', value: '#E5E7EB' },
];

const fontSizeOptions = [
  { label: 'Small', value: 'text-base' },
  { label: 'Medium', value: 'text-lg' },
  { label: 'Large', value: 'text-xl' },
  { label: 'Extra Large', value: 'text-2xl' },
  { label: 'XXL', value: 'text-3xl' },
];

export function CaptionSettings({
  showCaptions,
  onToggleCaptions,
  onStyleChange,
}: CaptionSettingsProps) {
  const [backgroundColor, setBackgroundColor] = useState(
    backgroundOptions[0].value
  );
  const [textColor, setTextColor] = useState(textColorOptions[0].value);
  const [fontSize, setFontSize] = useState(fontSizeOptions[2].value);

  const handleBackgroundChange = (value: string) => {
    setBackgroundColor(value);
    onStyleChange({
      backgroundColor: value,
      textColor,
      fontSize,
    });
  };

  const handleTextColorChange = (value: string) => {
    setTextColor(value);
    onStyleChange({
      backgroundColor,
      textColor: value,
      fontSize,
    });
  };

  const handleFontSizeChange = (value: string) => {
    setFontSize(value);
    onStyleChange({
      backgroundColor,
      textColor,
      fontSize: value,
    });
  };

  return (
    <div className='p-4 bg-white border rounded-lg shadow-sm'>
      <h3 className='text-lg font-medium mb-4'>Caption Settings</h3>

      <div className='space-y-4'>
        {/* Toggle switch for captions */}
        <div className='flex items-center justify-between'>
          <Label htmlFor='caption-toggle' className='text-sm font-medium'>
            Show Captions
          </Label>
          <Switch
            id='caption-toggle'
            checked={showCaptions}
            onCheckedChange={onToggleCaptions}
          />
        </div>

        {/* Only show style options if captions are enabled */}
        {showCaptions && (
          <>
            {/* Background color dropdown */}
            <div className='flex items-center justify-between'>
              <Label className='text-sm font-medium'>Background</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='w-32'>
                    <div
                      className='w-4 h-4 rounded-full mr-2'
                      style={{ backgroundColor: backgroundColor }}
                    />
                    {
                      backgroundOptions.find(
                        (opt) => opt.value === backgroundColor
                      )?.label
                    }
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {backgroundOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleBackgroundChange(option.value)}
                      className='flex items-center'
                    >
                      <div
                        className='w-4 h-4 rounded-full mr-2'
                        style={{ backgroundColor: option.value }}
                      />
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Text color dropdown */}
            <div className='flex items-center justify-between'>
              <Label className='text-sm font-medium'>Text Color</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='w-32'>
                    <div
                      className='w-4 h-4 rounded-full mr-2'
                      style={{ backgroundColor: textColor }}
                    />
                    {
                      textColorOptions.find((opt) => opt.value === textColor)
                        ?.label
                    }
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {textColorOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleTextColorChange(option.value)}
                      className='flex items-center'
                    >
                      <div
                        className='w-4 h-4 rounded-full mr-2'
                        style={{ backgroundColor: option.value }}
                      />
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Font size dropdown */}
            <div className='flex items-center justify-between'>
              <Label className='text-sm font-medium'>Font Size</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='w-32'>
                    {
                      fontSizeOptions.find((opt) => opt.value === fontSize)
                        ?.label
                    }
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {fontSizeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleFontSizeChange(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
