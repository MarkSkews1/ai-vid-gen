'use client';

import {
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  ChangeEvent,
} from 'react';

// Define types for video creation
export type Scene = {
  description: string;
  textContent: string;
  imagePrompt: string;
  visuals?: string;
  audio?: string;
  [key: string]: string | number | boolean | object | undefined;
};

export type VideoData = {
  title: string;
  scenes: Scene[];
  metadata?: {
    [key: string]: string | number | boolean | object | undefined;
  };
  [key: string]: string | number | boolean | object | Scene[] | undefined;
};

export type VideoStatus =
  | 'idle'
  | 'creating'
  | 'processing'
  | 'completed'
  | 'error';

const initialState = {
  script: 'Script...',
  images: [] as string[],
  audio: '',
  captions: [] as object[],
  loading: false,
  selectedStory: 'Inspirational Story',
  selectedStyle: 'gta',
  videoTitle: '',
  videoData: null as VideoData | null,
  scenes: [] as Scene[],
  status: 'idle' as VideoStatus,
  error: '',
};

interface VideoContextType {
  script: string;
  setScript: Dispatch<SetStateAction<string>>;
  images: string[];
  setImages: Dispatch<SetStateAction<string[]>>;
  audio: string;
  setAudio: Dispatch<SetStateAction<string>>;
  captions: object[];
  setCaptions: Dispatch<SetStateAction<object[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  videoTitle: string;
  setVideoTitle: Dispatch<SetStateAction<string>>;
  videoData: VideoData | null;
  setVideoData: Dispatch<SetStateAction<VideoData | null>>;
  scenes: Scene[];
  setScenes: Dispatch<SetStateAction<Scene[]>>;
  status: VideoStatus;
  setStatus: Dispatch<SetStateAction<VideoStatus>>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  createVideo: (scriptContent: string) => Promise<void>;
  selectedStory: string;
  setSelectedStory: Dispatch<SetStateAction<string>>;
  selectedStyle: string;
  setSelectedStyle: Dispatch<SetStateAction<string>>;
  customPrompt: string;
  setCustomPrompt: Dispatch<SetStateAction<string>>;
  handleStorySelect: (story: string) => void;
  handleStyleSelect: (style: string) => void;
  handleCustomPromptChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => Promise<void>;
  cancelCustomPrompt: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  //state
  const [script, setScript] = useState(initialState.script);
  const [images, setImages] = useState(initialState.images);
  const [audio, setAudio] = useState(initialState.audio);
  const [captions, setCaptions] = useState(initialState.captions);
  const [loading, setLoading] = useState(initialState.loading);
  const [videoTitle, setVideoTitle] = useState(initialState.videoTitle);
  const [videoData, setVideoData] = useState(initialState.videoData);
  const [scenes, setScenes] = useState(initialState.scenes);
  const [status, setStatus] = useState(initialState.status);
  const [error, setError] = useState(initialState.error);
  const [selectedStory, setSelectedStory] = useState(
    initialState.selectedStory
  );
  const [selectedStyle, setSelectedStyle] = useState(
    initialState.selectedStyle
  );
  const [customPrompt, setCustomPrompt] = useState(
    'Create a short video about nature and wildlife'
  );
  const handleStorySelect = (story: string) => {
    setSelectedStory(story);
    if (story !== 'Enter custom prompt') {
      setCustomPrompt('');
    }
  };

  const cancelCustomPrompt = () => {
    setSelectedStory(initialState.selectedStory);
    setCustomPrompt('');
  };

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
  };
  const handleCustomPromptChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCustomPrompt(event.target.value);
    setSelectedStory('Enter custom prompt');
  };

  const handleSubmit = async () => {
    const videoData = {
      story: selectedStory || customPrompt,
      style: selectedStyle,
      prompt: customPrompt || selectedStory,
    };
    // send to server action
    console.log('Video Data:', videoData);
  };

  // Function to create a new video
  const createVideo = async (scriptContent: string) => {
    try {
      setLoading(true);
      setStatus('creating');
      setError('');

      // Use a default message if script is the placeholder
      const scriptToSend =
        scriptContent === 'Script...'
          ? 'Create a short video about nature and wildlife'
          : scriptContent;

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script: scriptToSend }),
      });

      const result = await response.json();

      if (result.success) {
        // Process the response
        try {
          // Parse the response data if needed
          const parsedData =
            typeof result.data === 'string'
              ? JSON.parse(result.data)
              : result.data;

          // Update state with the received video data
          setVideoData(parsedData);

          // Set the title if available
          if (parsedData.title) {
            setVideoTitle(parsedData.title);
          }

          // Set the scenes if available
          if (parsedData.scenes && Array.isArray(parsedData.scenes)) {
            setScenes(parsedData.scenes);
          }

          setStatus('completed');
        } catch (err) {
          console.warn('Failed to parse video data:', err);
          setError('Failed to process video data');
          setStatus('error');
        }
      } else {
        setError(result.error || 'Failed to create video');
        setStatus('error');
      }
    } catch (err) {
      console.error('Video creation error:', err);
      setError('An error occurred while creating the video');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <VideoContext.Provider
      value={{
        script,
        setScript,
        images,
        setImages,
        audio,
        setAudio,
        captions,
        setCaptions,
        loading,
        setLoading,
        videoTitle,
        setVideoTitle,
        videoData,
        setVideoData,
        scenes,
        setScenes,
        status,
        setStatus,
        error,
        setError,
        createVideo,
        selectedStory,
        setSelectedStory,
        selectedStyle,
        setSelectedStyle,
        customPrompt,
        setCustomPrompt,
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
