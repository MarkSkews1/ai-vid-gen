// Custom hooks for video functionality

import { useState } from 'react';
import { generateImageAi } from '@/actions/replicateai';
import { generateAudioFromText } from '@/actions/googlecloud';
import {
  generateVideoScript,
  processVideoScriptResponse,
} from '@/services/videoService';
import {
  VideoState,
  Scene,
  VideoStatus,
  VideoData,
  DebugImageGeneration,
} from '@/types/video';

// Initial state for video context
const initialState: VideoState = {
  images: [],
  audio: '',
  captions: [],
  loading: false,
  showLoadingModal: false,
  loadingModalMessage: 'Processing your request...',
  selectedStory: 'Inspirational Story',
  selectedStyle: 'gta',
  videoTitle: '',
  videoData: null,
  scenes: [],
  status: 'idle',
  error: '',
  customPrompt: 'Create a short video about nature and wildlife',
  debugImageGeneration: [],
  useMockAudio: false,
};

/**
 * Hook for managing video creation state and functions
 */
export function useVideoCreation() {
  // Core state
  const [images, setImages] = useState(initialState.images);
  const [audio, setAudio] = useState(initialState.audio);
  const [captions, setCaptions] = useState(initialState.captions);
  const [videoTitle, setVideoTitle] = useState(initialState.videoTitle);
  const [videoData, setVideoData] = useState(initialState.videoData);
  const [scenes, setScenes] = useState(initialState.scenes);
  const [status, setStatus] = useState<VideoStatus>(initialState.status);
  const [error, setError] = useState(initialState.error);

  // UI state
  const [loading, setLoading] = useState(initialState.loading);
  const [showLoadingModal, setShowLoadingModal] = useState(
    initialState.showLoadingModal
  );
  const [loadingModalMessage, setLoadingModalMessage] = useState(
    initialState.loadingModalMessage
  );

  // Input state
  const [selectedStory, setSelectedStory] = useState(
    initialState.selectedStory
  );
  const [selectedStyle, setSelectedStyle] = useState(
    initialState.selectedStyle
  );
  const [customPrompt, setCustomPrompt] = useState(initialState.customPrompt);

  // Mock settings
  const [useMockAudio, setUseMockAudio] = useState(initialState.useMockAudio);

  // Debug state
  const [debugImageGeneration, setDebugImageGeneration] = useState<
    DebugImageGeneration[]
  >(initialState.debugImageGeneration);

  /**
   * Creates a video script based on the provided prompt
   */
  const createVideo = async (promptContent: string): Promise<Scene[]> => {
    try {
      setLoading(true);
      setShowLoadingModal(true);
      setLoadingModalMessage('Creating your video...');
      setStatus('creating');
      setError('');

      setLoadingModalMessage('Generating script with AI...');
      const result = await generateVideoScript(promptContent);

      if (result.success) {
        try {
          setLoadingModalMessage('Processing AI response...');

          // Process the API response
          const {
            videoData: processedData,
            extractedScenes,
            title,
          } = processVideoScriptResponse(result);

          // Update state with the processed data
          setVideoData(processedData);

          if (title) {
            setVideoTitle(title);
          }

          // Set the scenes if available
          setScenes(extractedScenes);
          setStatus('completed');
          setLoadingModalMessage(
            'Script generated! Preparing to create images...'
          );

          return extractedScenes;
        } catch (err) {
          console.warn('Failed to parse video data:', err);
          setError('Failed to process video data');
          setStatus('error');
          setLoadingModalMessage('Error: Failed to process video data');
          return [];
        }
      } else {
        setError(result.error || 'Failed to create video');
        setStatus('error');
        setLoadingModalMessage('Error: Failed to create video');
        return [];
      }
    } catch (err) {
      console.error('Video creation error:', err);
      setError('An error occurred while creating the video');
      setStatus('error');
      setLoadingModalMessage('Error: An unexpected error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generates images for each scene in the video
   */
  const generateImages = async (
    scenesToProcess: Scene[]
  ): Promise<string[]> => {
    if (!scenesToProcess.length) return [];

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
              error: errorMessage,
              scene: JSON.stringify(scene).substring(0, 200) + '...',
            },
          ]);

          // Set error state
          setError(
            `Image generation error on scene ${index + 1}: ${errorMessage}`
          );
          return '';
        }
      }
    );

    return await Promise.all(imagePromises);
  };
  /**
   * Generates audio for each scene in the video
   */
  const generateAudios = async (scenesToProcess: Scene[]): Promise<Scene[]> => {
    if (!scenesToProcess.length) return [];

    const updatedScenes = [...scenesToProcess];

    // Process each scene sequentially to generate audio
    for (let i = 0; i < updatedScenes.length; i++) {
      const scene = updatedScenes[i];

      if (scene.textContent) {
        try {
          setLoadingModalMessage(
            `Generating audio ${i + 1} of ${updatedScenes.length}...`
          );
          console.log(`Starting audio generation for scene ${i + 1}`);

          // Pass the useMockAudio flag to the generateAudioFromText function
          const audioResult = await generateAudioFromText(
            scene.textContent,
            useMockAudio
          );
          const audioUrl =
            audioResult &&
            typeof audioResult === 'object' &&
            'url' in audioResult
              ? String(audioResult.url)
              : '';

          console.log(`Successfully generated audio for scene ${i + 1}`);

          // Update the scene with the audio URL
          updatedScenes[i] = { ...scene, audio: audioUrl };
        } catch (error) {
          // Enhanced error handling with more details
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error(
            `Error generating audio for scene ${i + 1}:`,
            errorMessage,
            error
          );

          // Continue with other scenes even if one fails
          updatedScenes[i] = { ...scene, audio: '' };
        }
      }
    }

    return updatedScenes;
  };
  /**
   * Updates scenes with generated image URLs
   */
  const updateScenesWithImages = (
    scenes: Scene[],
    imageUrls: string[]
  ): Scene[] => {
    return scenes.map((scene, index) => ({
      ...scene,
      imageUrl: imageUrls[index] || '',
    }));
  };

  /**
   * Submits the video creation request
   */
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setShowLoadingModal(true);
      setLoadingModalMessage('Generating video script...');
      console.log('Generating video script...');
      // Clear previous debug data
      setDebugImageGeneration([]);

      // 1. Create video script
      const extractedScenes = await createVideo(
        `Create a 30 second long ${
          selectedStory || customPrompt
        } video script. Include AI image prompt for each scene in ${selectedStyle} format. Provide the result in JSON format with 'imagePrompt' and 'textContent' fields.`
      );

      // Use the returned scenes directly
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

      // 2. Generate images for each scene
      if (scenesToProcess.length > 0) {
        const generatedImages = await generateImages(scenesToProcess);
        const filteredImages = generatedImages.filter((url) => url !== '');

        setImages(filteredImages);

        // 3. Update scenes with image URLs
        const updatedScenes = updateScenesWithImages(
          scenesToProcess,
          generatedImages
        );
        setScenes(updatedScenes); // 4. Update videoData with the new scenes containing image URLs
        if (videoData) {
          const updatedVideoData = {
            ...videoData,
            scenes: updatedScenes,
          };
          setVideoData(updatedVideoData);
          console.log('Updated videoData with image URLs');
        }

        // 5. Generate audio for each scene
        setLoadingModalMessage('Generating audio for scenes...');
        const scenesWithAudio = await generateAudios(updatedScenes);

        // 6. Update scenes with audio URLs
        setScenes(scenesWithAudio);

        // 7. Update videoData with the new scenes containing audio URLs
        if (videoData) {
          const updatedVideoDataWithAudio = {
            ...videoData,
            scenes: scenesWithAudio,
          };
          setVideoData(updatedVideoDataWithAudio);
          console.log('Updated videoData with audio URLs');
        }
        console.log('Image generation completed successfully');
        setLoadingModalMessage('Images generated successfully!');
      } else {
        console.log('No scenes available for image generation');
        setLoadingModalMessage('No scenes available for image generation');
      }
    } catch (err) {
      console.error('Error during video creation:', err);
      setError(
        `Error during video creation: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
      setShowLoadingModal(false);
    }
  };
  return {
    // State
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
    selectedStory,
    setSelectedStory,
    selectedStyle,
    setSelectedStyle,
    customPrompt,
    setCustomPrompt,
    useMockAudio,
    setUseMockAudio,
    debugImageGeneration,
    setDebugImageGeneration,
    // Functions
    createVideo,
    generateImages,
    generateAudios,
    updateScenesWithImages,
    handleSubmit,
  };
}

/**
 * Hook for managing input handling and UI interactions
 */
export function useVideoInputHandling(
  setSelectedStory: (story: string) => void,
  setSelectedStyle: (style: string) => void,
  setCustomPrompt: (prompt: string) => void
) {
  const handleStorySelect = (story: string) => {
    setSelectedStory(story);
    if (story !== 'Enter custom prompt') {
      setCustomPrompt('');
    }
  };

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
  };

  const handleCustomPromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCustomPrompt(event.target.value);
    setSelectedStory('Enter custom prompt');
  };

  const cancelCustomPrompt = () => {
    setSelectedStory(initialState.selectedStory);
    setCustomPrompt('');
  };

  return {
    handleStorySelect,
    handleStyleSelect,
    handleCustomPromptChange,
    cancelCustomPrompt,
  };
}
