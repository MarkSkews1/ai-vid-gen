// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

'use server';

import { GoogleGenAI } from '@google/genai';

const defaultMessage =
  "Create a 30-SECOND long ADVENTURE STORY video script. Include AI image prompts in FANTASY FORMAT for each scene in realistic format. Provide the result in JSON format with 'imagePrompt' and 'textContent' fields.";

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
