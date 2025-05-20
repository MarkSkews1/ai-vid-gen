import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const { script } = await request.json();

    if (!script) {
      return NextResponse.json(
        { success: false, error: 'Script is required' },
        { status: 400 }
      );
    }

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
