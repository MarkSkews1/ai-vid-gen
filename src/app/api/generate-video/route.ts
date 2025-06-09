import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Mock response for development mode
const mockResponse = {
  title: "Alex's Treasure Hunt Adventure",
  scenes: [
    {
      description: 'Scene 1: The Beginning of the Adventure',
      textContent:
        'Our journey begins with Alex, a determined explorer, standing at the edge of the Whispering Woods. Legend says a forgotten treasure lies within.',
      imagePrompt:
        'A young adventurer with tattered map standing at the entrance of a mysterious, mist-shrouded forest. Ancient trees tower overhead, their gnarled branches creating an intimidating canopy. Golden sunlight filters through the leaves, illuminating the path forward.',
      visuals:
        'Wide shot of Alex at forest entrance, sunlight streaming through trees',
      audio: 'Soft ambient forest sounds, gentle wind',
    },
    {
      description: 'Scene 2: Discovering the Hidden Path',
      textContent:
        'Venturing deeper, Alex discovers a hidden path marked by glowing runes. A magical fox appears, seemingly guiding the way forward.',
      imagePrompt:
        'Deep within the magical forest, glowing blue mushrooms illuminate a hidden path. Fireflies dance in the air, and mysterious runes are carved into the ancient trees. A small, ethereal fox with glowing eyes watches from behind a moss-covered log.',
      visuals: 'Close-up of glowing runes, then reveal of magical fox',
      audio: 'Mystical chimes, fox sounds',
    },
    {
      description: 'Scene 3: The Ancient Door',
      textContent:
        'The path leads to an ancient door built into a mountainside. As Alex approaches, stone guardians awaken, their eyes glowing with ancient magic.',
      imagePrompt:
        'A massive stone door embedded in a cliff face, covered in ancient symbols that glow with blue light as the adventurer approaches. Stone guardians on either side of the door begin to crack and move, their eyes lighting up with an ancient power.',
      visuals: 'Pan up to reveal massive door, zoom in on awakening guardians',
      audio: 'Stone grinding, magical humming',
    },
    {
      description: 'Scene 4: The Treasure Chamber',
      textContent:
        'After proving worthy to the guardians, the doors open to reveal a treasure chamber beyond imagination. But the true prize is a small glowing box at the center.',
      imagePrompt:
        'Inside a vast, glittering cavern filled with mountains of gold coins, jewel-encrusted weapons, and artifacts from a lost civilization. In the center, on a pedestal, sits a small, unassuming wooden box that glows with an inner light.',
      visuals: 'Wide shot of treasure room, focus pull to the glowing box',
      audio: 'Chorus of wonder, gentle magical tones',
    },
    {
      description: 'Scene 5: The True Treasure',
      textContent:
        'Alex opens the box to find not gold, but a magical compass—a key to even greater adventures waiting beyond the horizon. The journey has only just begun.',
      imagePrompt:
        'The adventurer holding an open box revealing a brilliant crystal compass that floats above their palm, emitting beams of light that form a map in the air. Their face is illuminated with wonder and new purpose.',
      visuals:
        "Close-up of Alex's face in wonder, pull back to show compass floating",
      audio: 'Triumphant music, magical chimes',
    },
  ],
  metadata: {
    duration: '30 seconds',
    style: 'Fantasy adventure',
    mood: 'Wonder and discovery',
    targetAudience: 'All ages',
  },
};

export async function POST(request: NextRequest) {
  try {
    const { script } = await request.json();

    if (!script) {
      return NextResponse.json(
        { success: false, error: 'Script is required' },
        { status: 400 }
      );
    } // Check if we should use mock response in development mode
    const mockEnvValue = process.env.USE_MOCK_GEMINI;
    console.log('API route - USE_MOCK_GEMINI env value:', mockEnvValue);
    const useMockResponse = mockEnvValue === 'true';

    if (useMockResponse) {
      console.log('API route - Using mock Gemini response for development');
      return NextResponse.json({ success: true, data: mockResponse });
    }

    // Removed forced development mode override that was causing issues
    // The mock response should only be used when USE_MOCK_GEMINI=true

    // Check for API key in environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY missing from environment variables');
      return NextResponse.json(
        { success: false, error: 'API key is not configured' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });
    const config = {
      responseMimeType: 'application/json',
    };
    const model = 'gemini-1.5-flash';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Generate a JSON response for the following video script. Format the output as a valid JSON object with sections for 'title', 'scenes', and 'metadata'. Each scene should have the following fields: 'description', 'textContent' (containing the narration text), 'imagePrompt' (containing the visual description for image generation), 'visuals', and 'audio'. Here's the script: ${script}`,
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
    } // Try to parse the response as JSON directly
    try {
      const jsonResponse = JSON.parse(fullResponse);
      return NextResponse.json({ success: true, data: jsonResponse });
    } catch {
      // If parsing fails, return the raw text response
      return NextResponse.json({ success: true, data: { text: fullResponse } });
    }
  } catch (error: unknown) {
    console.error('Error in API route:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
