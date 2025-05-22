// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

'use server';

import { GoogleGenAI } from '@google/genai';

const defaultMessage =
  "Create a 30-SECOND long ADVENTURE STORY video script. Include AI image prompts in FANTASY FORMAT for each scene in realistic format. Provide the result in JSON format with 'imagePrompt' and 'textContent' fields.";

// Static mock response for development mode
const mockResponse = `[
  {
    "imagePrompt": "A young adventurer with tattered map standing at the entrance of a mysterious, mist-shrouded forest. Ancient trees tower overhead, their gnarled branches creating an intimidating canopy. Golden sunlight filters through the leaves, illuminating the path forward.",
    "textContent": "Our journey begins with Alex, a determined explorer, standing at the edge of the Whispering Woods. Legend says a forgotten treasure lies within."
  },
  {
    "imagePrompt": "Deep within the magical forest, glowing blue mushrooms illuminate a hidden path. Fireflies dance in the air, and mysterious runes are carved into the ancient trees. A small, ethereal fox with glowing eyes watches from behind a moss-covered log.",
    "textContent": "Venturing deeper, Alex discovers a hidden path marked by glowing runes. A magical fox appears, seemingly guiding the way forward."
  },
  {
    "imagePrompt": "A massive stone door embedded in a cliff face, covered in ancient symbols that glow with blue light as the adventurer approaches. Stone guardians on either side of the door begin to crack and move, their eyes lighting up with an ancient power.",
    "textContent": "The path leads to an ancient door built into a mountainside. As Alex approaches, stone guardians awaken, their eyes glowing with ancient magic."
  },
  {
    "imagePrompt": "Inside a vast, glittering cavern filled with mountains of gold coins, jewel-encrusted weapons, and artifacts from a lost civilization. In the center, on a pedestal, sits a small, unassuming wooden box that glows with an inner light.",
    "textContent": "After proving worthy to the guardians, the doors open to reveal a treasure chamber beyond imagination. But the true prize is a small glowing box at the center."
  },
  {
    "imagePrompt": "The adventurer holding an open box revealing a brilliant crystal compass that floats above their palm, emitting beams of light that form a map in the air. Their face is illuminated with wonder and new purpose.",
    "textContent": "Alex opens the box to find not gold, but a magical compass—a key to even greater adventures waiting beyond the horizon. The journey has only just begun."
  }
]`;

interface VideoResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export async function createVideoAi(message: string): Promise<VideoResponse> {
  try {
    // Check if message contains 'Script...' and use default message instead
    const finalMessage = message.includes('Script...')
      ? defaultMessage
      : message;

    // Check if we should use mock response in development mode
    const useMockResponse = process.env.USE_MOCK_GEMINI === 'true';

    if (useMockResponse) {
      console.log('Using mock Gemini response for development');
      return { success: true, data: mockResponse };
    }

    // Check for API key in environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY missing from environment variables');
      throw new Error(
        'GEMINI_API_KEY is not configured in environment variables'
      );
    }

    console.log('API Key found with length:', apiKey.length);

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });
    const config = {
      responseMimeType: 'text/plain',
    };
    const model = 'gemini-1.5-pro';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: finalMessage,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullResponse = '';
    for await (const chunk of response) {
      fullResponse += chunk.text || '';
    }

    return { success: true, data: fullResponse };
  } catch (error: unknown) {
    console.error('Error in createVideoAi:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}
