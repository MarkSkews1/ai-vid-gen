// API service functions for video-related operations

import { Scene } from '@/types/video';

/**
 * Generates a video script based on the provided prompt
 * @param promptContent The content prompt to generate the script
 */
export async function generateVideoScript(promptContent: string) {
  const promptToSend =
    promptContent || 'Create a short video about nature and wildlife';

  const response = await fetch('/api/generate-video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ script: promptToSend }),
  });

  return await response.json();
}

/**
 * Process the video script response from the API
 * @param responseData The data returned from the API
 */
export function processVideoScriptResponse(responseData: any) {
  // Parse the response data if needed
  const parsedData =
    typeof responseData.data === 'string'
      ? JSON.parse(responseData.data)
      : responseData.data;

  // Extract scenes from the response
  const extractedScenes =
    parsedData.scenes && Array.isArray(parsedData.scenes)
      ? parsedData.scenes
      : [];

  // Create a structured video data object
  const videoData = {
    ...parsedData,
    title: parsedData.title || 'Untitled Video', // Provide default title if missing
  };

  return {
    videoData,
    extractedScenes,
    title: parsedData.title || 'Untitled Video',
  };
}
