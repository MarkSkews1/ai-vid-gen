'use server';

/**
 * Interface for video scene structure
 */
interface VideoScene {
  imagePrompt: string;
  textContent: string;
}

/**
 * Default prompt for generating video scripts
 */
const defaultMessage =
  "Create a 30-SECOND long ADVENTURE STORY video script. Include AI image prompts in FANTASY FORMAT for each scene in realistic format. Provide the result in JSON format with 'imagePrompt' and 'textContent' fields.";

/**
 * Creates a video script using Google's Gemini AI via a secure server-side API route
 * @param message - Custom prompt message (optional)
 * @param modelVersion - Gemini model version to use (optional)
 * @returns Promise resolving to an array of video scenes
 */
export async function createVideoAI(
  message: string = defaultMessage,
  modelVersion: string = 'gemini-2.5-pro-preview-05-06'
): Promise<VideoScene[]> {
  try {
    // For server components, we need to use absolute URLs
    // Get the URL dynamically based on whether we're in a browser or server context
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    console.log('Using base URL:', baseUrl);

    // Call the server-side API route with absolute URL
    const response = await fetch(`${baseUrl}/api/generate-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        modelVersion,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate video script');
    } // Get the response data
    const data = await response.json();

    // Return the scenes from the API response
    return data.scenes;
  } catch (error) {
    console.error('Error generating video script:', error);
    throw error;
  }
}
