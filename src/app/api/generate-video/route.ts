import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Get API key from environment variables (only accessible server-side)
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in the environment variables.');
}

// Interface for video scene structure
export interface VideoScene {
  imagePrompt: string;
  textContent: string;
}

// Interface for Gemini content format
interface GeminiContent {
  role: string;
  parts: {
    text: string;
  }[];
}

// Interface for Gemini configuration
interface GeminiConfig {
  responseMimeType: string;
  temperature: number;
  maxOutputTokens: number;
  topK: number;
  topP: number;
}

// Default prompt for generating video scripts
const defaultMessage =
  "Create a 30-SECOND long ADVENTURE STORY video script. Include AI image prompts in FANTASY FORMAT for each scene in realistic format. Return ONLY a valid JSON array where each object has 'imagePrompt' and 'textContent' fields. Do not include any explanations or markdown formatting.";

// Helper function for delay with exponential backoff
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to handle API calls with retry logic
async function callGeminiWithRetry(
  ai: GoogleGenAI,
  modelVersion: string, 
  config: GeminiConfig,
  contents: GeminiContent[],
  maxRetries = 3
) {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      // Generate content
      return await ai.models.generateContentStream({
        model: modelVersion,
        config,
        contents,
      });
    } catch (error: unknown) {
      // Check if it's a rate limit error (429)
      if (error instanceof Error && error.message && error.message.includes('429')) {
        const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Rate limit hit. Retrying in ${waitTime/1000} seconds...`);
        await delay(waitTime);
        retryCount++;
      } else {
        // For other errors, don't retry
        throw error;
      }
    }
  }
  
  // If we've exhausted all retries
  throw new Error(`Rate limit exceeded after ${maxRetries} retries. Please try again later.`);
}

export async function POST(request: Request) {
  try {
    // Check if API key is available
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured on server' },
        { status: 500 }
      );
    }

    // Get request data
    const {
      message = defaultMessage,
      modelVersion = 'gemini-2.5-pro-preview-05-06',
    } = await request.json();

    // Initialize the Google GenAI client with additional safety parameters
    const ai = new GoogleGenAI({
      apiKey,
    });

    const config: GeminiConfig = {
      responseMimeType: 'text/plain',
      temperature: 0.7,
      maxOutputTokens: 1024,
      topK: 40,
      topP: 0.95,
    };

    // Format the prompt to be more reliable
    const formattedPrompt = `
${message}

IMPORTANT: Your response MUST be a valid JSON array where each object has 'imagePrompt' and 'textContent' fields.
Example format:
[
  {
    "imagePrompt": "A magical forest with ancient trees and glowing mushrooms",
    "textContent": "Our adventure begins in an enchanted forest..."
  },
  {
    "imagePrompt": "A crystal cave with shimmering gems and underground lake",
    "textContent": "Exploring deeper, we discover a hidden crystal cave..."
  }
]

Return ONLY the JSON array without any explanations, comments, or markdown formatting.
    `.trim();

    const contents: GeminiContent[] = [
      {
        role: 'user',
        parts: [
          {
            text: formattedPrompt,
          },
        ],
      },
    ];

    // Call Gemini API with retry logic
    const streamResponse = await callGeminiWithRetry(ai, modelVersion, config, contents);

    // Collect all chunks into a single string
    let fullResponse = '';
    for await (const chunk of streamResponse) {
      if (chunk.text) {
        fullResponse += chunk.text;
      }
    }

    // Log the response for debugging
    console.log('Full AI response:', fullResponse);

    try {
      // Clean up the response if it has markdown code blocks
      const jsonStringMatch =
        fullResponse.match(/```json\n([\s\S]*?)\n```/) ||
        fullResponse.match(/```\n([\s\S]*?)\n```/);

      const cleanJsonStr = jsonStringMatch
        ? jsonStringMatch[1]
        : fullResponse.trim();
      console.log('Cleaned JSON string:', cleanJsonStr);

      // Additional checks for empty responses
      if (!cleanJsonStr || cleanJsonStr.trim() === '') {
        throw new Error('Empty response received from Gemini AI');
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanJsonStr);
      } catch {
        // Try to handle common formatting issues
        const fixedJsonStr = cleanJsonStr
          .replace(/\\/g, '\\\\') // Fix escaped backslashes
          .replace(/\n/g, '\\n') // Fix newlines
          .replace(/\r/g, '\\r') // Fix carriage returns
          .replace(/\t/g, '\\t') // Fix tabs
          .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3'); // Fix unquoted keys

        parsedResponse = JSON.parse(fixedJsonStr);
      }

      const result = Array.isArray(parsedResponse)
        ? parsedResponse
        : [parsedResponse];

      // Validate the result structure
      for (const scene of result) {
        if (!scene.imagePrompt || !scene.textContent) {
          throw new Error('Invalid scene structure: missing required fields');
        }
      }

      // Return the result
      return NextResponse.json({ scenes: result });
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.log('Raw response:', fullResponse);

      return NextResponse.json(
        {
          error: `Invalid JSON response from Gemini AI: ${
            parseError instanceof Error
              ? parseError.message
              : 'Unknown parsing error'
          }`,
          rawResponse: fullResponse,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating video script:', error);

    // Check specifically for rate limiting errors
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate video script';
    const statusCode = errorMessage.includes('Rate limit') ? 429 : 500;
    
    return NextResponse.json(
      { 
        error: errorMessage,
        isRateLimit: statusCode === 429,
        retryAfter: statusCode === 429 ? 60 : undefined // Suggest retry after 1 minute
      }, 
      { status: statusCode }
    );
  }
}
