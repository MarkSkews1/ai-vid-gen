'use client';

import { createContext, useContext, ReactNode, ChangeEvent } from 'react';
import {
  Scene,
  VideoData,
  VideoStatus,
  DebugImageGeneration,
} from '@/types/video';
import { Caption } from '@/actions/assemblyai';
import { useVideoCreation, useVideoInputHandling } from '@/hooks/useVideo';

/**
 * Context interface for video functionality
 */
interface VideoContextType {
  // State
  images: string[];
  audio: string;
  captions: Caption[];
  loading: boolean;
  showLoadingModal: boolean;
  loadingModalMessage: string;
  videoTitle: string;
  videoData: VideoData | null;
  scenes: Scene[];
  status: VideoStatus;
  error: string;
  selectedStory: string;
  selectedStyle: string;
  customPrompt: string;
  debugImageGeneration: DebugImageGeneration[];
  useMockAudio: boolean;
  setUseMockAudio: (useMock: boolean) => void;
  setCustomPrompt: (prompt: string) => void;

  // Functions
  createVideo: (promptContent: string) => Promise<Scene[]>;
  handleStorySelect: (story: string) => void;
  handleStyleSelect: (style: string) => void;
  handleCustomPromptChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => Promise<void>;
  cancelCustomPrompt: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  // Use the custom video creation hook for main functionality
  const {
    images,
    audio,
    captions,
    loading,
    showLoadingModal,
    loadingModalMessage,
    videoTitle,
    videoData,
    scenes,
    status,
    error,
    selectedStory,
    setSelectedStory,
    selectedStyle,
    setSelectedStyle,
    customPrompt,
    setCustomPrompt,
    useMockAudio,
    setUseMockAudio,
    debugImageGeneration,
    createVideo,
    handleSubmit,
  } = useVideoCreation();
  // Use the input handling hook for UI interactions
  const {
    handleStorySelect,
    handleStyleSelect,
    handleCustomPromptChange,
    cancelCustomPrompt,
  } = useVideoInputHandling(
    setSelectedStory,
    setSelectedStyle,
    setCustomPrompt
  );
  return (
    <VideoContext.Provider
      value={{
        // State
        images,
        audio,
        captions,
        loading,
        showLoadingModal,
        loadingModalMessage,
        videoTitle,
        videoData,
        scenes,
        status,
        error,
        selectedStory,
        selectedStyle,
        customPrompt,
        setCustomPrompt,
        debugImageGeneration,
        useMockAudio,
        setUseMockAudio,

        // Functions
        createVideo,
        handleStorySelect,
        handleStyleSelect,
        handleCustomPromptChange,
        handleSubmit,
        cancelCustomPrompt,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};
