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
import { generateImageAi } from '@/actions/replicateai';

// Define types for video creation
export type Scene = {
  description: string;
  textContent: string;
  imagePrompt: string;
  imageUrl?: string;
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
  debugImageGeneration: [] as {
    sceneIndex: number;
    success: boolean;
    imageUrl: string;
    timestamp: string;
    error?: string; // Added error field for debugging
    scene?: string; // Added scene field for debugging
  }[], // Added for debugging
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
  createVideo: (promptContent: string) => Promise<Scene[]>;
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
  debugImageGeneration: {
    sceneIndex: number;
    success: boolean;
    imageUrl: string;
    timestamp: string;
  }[]; // Added for debugging
  setDebugImageGeneration: Dispatch<
    SetStateAction<
      {
        sceneIndex: number;
        success: boolean;
        imageUrl: string;
        timestamp: string;
      }[]
    >
  >; // Added for debugging
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
  const [debugImageGeneration, setDebugImageGeneration] = useState(
    initialState.debugImageGeneration
  ); // Added for debugging
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
  }; // Function to create a new video
  const createVideo = async (promptContent: string): Promise<Scene[]> => {
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

          // Extract scenes from the response
          const extractedScenes =
            parsedData.scenes && Array.isArray(parsedData.scenes)
              ? parsedData.scenes
              : [];

          // Log the extracted scenes for debugging
          console.log(`Found ${extractedScenes.length} scenes in response`);
          if (extractedScenes.length === 0) {
            console.warn('No scenes found in the response data');
          }

          // Update state with the received video data - ensure we have a title
          const videoDataToSet = {
            ...parsedData,
            title: parsedData.title || 'Untitled Video', // Provide default title if missing
          };
          setVideoData(videoDataToSet);

          // Set the title if available
          if (parsedData.title) {
            setVideoTitle(parsedData.title);
          }

          // Set the scenes if available
          setScenes(extractedScenes);

          setStatus('completed');
          setLoadingModalMessage(
            'Script generated! Preparing to create images...'
          );

          // Return the extracted scenes so we can use them in handleSubmit
          return extractedScenes;
        } catch (err) {
          console.warn('Failed to parse video data:', err);
          setError('Failed to process video data');
          setStatus('error');
          setLoadingModalMessage('Error: Failed to process video data');
          return []; // Return empty array so we don't try to process undefined scenes
        }
      } else {
        setError(result.error || 'Failed to create video');
        setStatus('error');
        setLoadingModalMessage('Error: Failed to create video');
        return []; // Return empty array in case of API error
      }
    } catch (err) {
      console.error('Video creation error:', err);
      setError('An error occurred while creating the video');
      setStatus('error');
      setLoadingModalMessage('Error: An unexpected error occurred');
      return []; // Return empty array in case of unexpected error
    } finally {
      setLoading(false);
      // Don't close the modal here, it will be closed after errors are shown or success is displayed
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setShowLoadingModal(true);
      setLoadingModalMessage('Generating video script...');
      console.log('Generating video script...');
      // Clear previous debug data
      setDebugImageGeneration([]);

      // 1. Create video script using google generative ai
      // The createVideo function now returns the extracted scenes
      const extractedScenes = await createVideo(
        `Create a 30 second long ${
          selectedStory || customPrompt
        } video script. Include AI image prompt for each scene in ${selectedStyle} format. Provide the result in JSON format with 'imagePrompt' and 'textContent' fields.`
      );

      // Use the returned scenes directly instead of relying on state update
      const scenesToProcess = extractedScenes || [];

      // Check if we have scenes after script generation
      if (!scenesToProcess.length) {
        setLoading(false);
        setShowLoadingModal(false);
        console.log(
          'Failed to generate video script or no scenes were generated'
        );
        return;
      }
      console.log(
        `Video script generated successfully with ${scenesToProcess.length} scenes`
      );
      setLoadingModalMessage('Generating images from the script...');
      // 2. Generate video images with replicate ai and cloudinary
      if (scenesToProcess.length > 0) {
        const imagePromises = scenesToProcess.map(
          async (scene: Scene, index: number) => {
            setLoadingModalMessage(
              `Generating image ${index + 1} of ${scenesToProcess.length}...`
            );
            try {
              console.log(`Starting image generation for scene ${index + 1}`);
              console.log(
                `Image prompt: ${scene.imagePrompt.substring(0, 100)}...`
              );
              const imageUrl = await generateImageAi(scene.imagePrompt);
              const timestamp = new Date().toISOString();
              console.log(
                `Successfully generated image for scene ${
                  index + 1
                }: ${imageUrl.substring(0, 50)}...`
              );

              // Update debug information
              setDebugImageGeneration((prev) => [
                ...prev,
                { sceneIndex: index, success: true, imageUrl, timestamp },
              ]);
              return imageUrl;
            } catch (error) {
              // Enhanced error handling with more details
              const errorMessage =
                error instanceof Error ? error.message : String(error);
              console.error(
                `Error generating image for scene ${index + 1}:`,
                errorMessage,
                error
              );

              const timestamp = new Date().toISOString();
              // Update debug information with more details
              setDebugImageGeneration((prev) => [
                ...prev,
                {
                  sceneIndex: index,
                  success: false,
                  imageUrl: '',
                  timestamp,
                  error: errorMessage, // Store the error message for debugging
                  scene: JSON.stringify(scene).substring(0, 200) + '...', // Store part of the scene data for debugging
                },
              ]);

              // Also set error state with more descriptive message
              setError(
                `Image generation error on scene ${index + 1}: ${errorMessage}`
              );

              return ''; // Return empty string if image generation fails
            }
          }
        );
        const generatedImages = await Promise.all(imagePromises);
        setImages(generatedImages.filter((url: string) => url !== ''));
        // Update scenes with image URLs - use scenesToProcess directly
        const updatedScenes = scenesToProcess.map(
          (scene: Scene, index: number) => ({
            ...scene,
            imageUrl: generatedImages[index] || '',
          })
        );
        setScenes(updatedScenes);

        // Also update videoData with the new scenes containing image URLs
        if (videoData) {
          const updatedVideoData = {
            ...videoData,
            scenes: updatedScenes,
          };
          setVideoData(updatedVideoData);
          console.log('Updated videoData with image URLs');
        }

        console.log('Image generation completed successfully');
        setLoadingModalMessage('Images generated successfully!');
      } else {
        console.log('No scenes available for image generation');
        setLoadingModalMessage('No scenes available for image generation');
      }
      // 3. Convert script to speech using google cloud text-to-speech
      // 4. Save the audio to cloudinary
      // 5. generate captions unsing assembly ai
    } catch (err) {
      console.log('Error during video creation:', err);
    } finally {
      setLoading(false);
      setShowLoadingModal(false);
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
        debugImageGeneration,
        setDebugImageGeneration, // Added for debugging
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
