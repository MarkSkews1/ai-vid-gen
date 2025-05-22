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
  images: [] as string[],
  audio: '',
  captions: [] as object[],
  loading: false,
  showLoadingModal: false,
  loadingModalMessage: 'Processing your request...',
  selectedStory: 'Inspirational Story',
  selectedStyle: 'gta',
  videoTitle: '',
  videoData: null as VideoData | null,
  scenes: [] as Scene[],
  status: 'idle' as VideoStatus,
  error: '',
};

interface VideoContextType {
  images: string[];
  setImages: Dispatch<SetStateAction<string[]>>;
  audio: string;
  setAudio: Dispatch<SetStateAction<string>>;
  captions: object[];
  setCaptions: Dispatch<SetStateAction<object[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  showLoadingModal: boolean;
  setShowLoadingModal: Dispatch<SetStateAction<boolean>>;
  loadingModalMessage: string;
  setLoadingModalMessage: Dispatch<SetStateAction<string>>;
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
  createVideo: (promptContent: string) => Promise<void>;
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
  const [images, setImages] = useState(initialState.images);
  const [audio, setAudio] = useState(initialState.audio);
  const [captions, setCaptions] = useState(initialState.captions);
  const [loading, setLoading] = useState(initialState.loading);
  const [showLoadingModal, setShowLoadingModal] = useState(
    initialState.showLoadingModal
  );
  const [loadingModalMessage, setLoadingModalMessage] = useState(
    initialState.loadingModalMessage
  );
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
    try {
      setLoading(true);
      setShowLoadingModal(true);
      setLoadingModalMessage('Generating video script...');
      console.log('Generating video script...');
      // 1. Create video script using google generative ai
      await createVideo(
        `Create a 30 second long ${
          selectedStory || customPrompt
        } video script. Include AI image prompt for each scene in ${selectedStyle} format. Provive the result in JSON formatwith 'imagePrompt' and 'textContent' fields.`
      );
      // Optionally, you can check the status state here if you want to display a message
      if (status !== 'completed') {
        setLoading(false);
        setShowLoadingModal(false);
        console.log('Failed to generate video script');
      } else {
        console.log('Video script generated successfully');
      }
      // 2. Generate video images with replicate ai and cloudinary
      // 3. Convert script to speech using google cloud text-to-speech
      // 4. Save the audio to cloudinary
      // 5. generate captions unsing assembly ai
    } catch (err) {
      console.log('Error during video creation:', err);
    } finally {
      setLoading(false);
      setShowLoadingModal(false);
    }
  }; // Function to create a new video
  const createVideo = async (promptContent: string) => {
    try {
      setLoading(true);
      setShowLoadingModal(true);
      setLoadingModalMessage('Creating your video...');
      setStatus('creating');
      setError('');
      const promptToSend =
        promptContent || 'Create a short video about nature and wildlife';

      setLoadingModalMessage('Generating script with AI...');
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script: promptToSend }),
      });

      const result = await response.json();

      if (result.success) {
        // Process the response
        try {
          setLoadingModalMessage('Processing AI response...');
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
          setLoadingModalMessage('Your video is ready!');
          // We'll close the modal after a brief delay to show the success message
          setTimeout(() => {
            setShowLoadingModal(false);
          }, 1000);
        } catch (err) {
          console.warn('Failed to parse video data:', err);
          setError('Failed to process video data');
          setStatus('error');
          setLoadingModalMessage('Error: Failed to process video data');
        }
      } else {
        setError(result.error || 'Failed to create video');
        setStatus('error');
        setLoadingModalMessage('Error: Failed to create video');
      }
    } catch (err) {
      console.error('Video creation error:', err);
      setError('An error occurred while creating the video');
      setStatus('error');
      setLoadingModalMessage('Error: An unexpected error occurred');
    } finally {
      setLoading(false);
      // Don't close the modal here, it will be closed after errors are shown or success is displayed
    }
  };
  return (
    <VideoContext.Provider
      value={{
        images,
        setImages,
        audio,
        setAudio,
        captions,
        setCaptions,
        loading,
        setLoading,
        showLoadingModal,
        setShowLoadingModal,
        loadingModalMessage,
        setLoadingModalMessage,
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
