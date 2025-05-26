'use server';

import { Caption, CaptionWord } from './assemblyai';

// Sample mock captions data with different lengths and patterns
const MOCK_CAPTIONS: Record<string, Caption[]> = {
  short: [
    {
      text: '[MOCK] This is a short caption for testing.',
      start: 0,
      end: 2000,
      words: generateMockWords(
        '[MOCK] This is a short caption for testing.',
        0,
        2000
      ),
    },
    {
      text: 'It helps developers reduce API calls during development.',
      start: 2100,
      end: 4000,
      words: generateMockWords(
        'It helps developers reduce API calls during development.',
        2100,
        4000
      ),
    },
    {
      text: 'And it saves costs while working on the UI.',
      start: 4100,
      end: 6000,
      words: generateMockWords(
        'And it saves costs while working on the UI.',
        4100,
        6000
      ),
    },
  ],
  medium: [
    {
      text: '[MOCK] Welcome to our video generation platform.',
      start: 0,
      end: 2000,
      words: generateMockWords(
        '[MOCK] Welcome to our video generation platform.',
        0,
        2000
      ),
    },
    {
      text: 'Here you can create amazing videos with AI.',
      start: 2100,
      end: 4000,
      words: generateMockWords(
        'Here you can create amazing videos with AI.',
        2100,
        4000
      ),
    },
    {
      text: 'Choose from various styles and themes.',
      start: 4100,
      end: 6000,
      words: generateMockWords(
        'Choose from various styles and themes.',
        4100,
        6000
      ),
    },
    {
      text: 'Our system will generate images and audio automatically.',
      start: 6100,
      end: 8000,
      words: generateMockWords(
        'Our system will generate images and audio automatically.',
        6100,
        8000
      ),
    },
    {
      text: 'Then we add captions to make your video more accessible.',
      start: 8100,
      end: 10000,
      words: generateMockWords(
        'Then we add captions to make your video more accessible.',
        8100,
        10000
      ),
    },
  ],
  long: [
    {
      text: '[MOCK] Our journey begins with Alex, a determined explorer.',
      start: 0,
      end: 2000,
      words: generateMockWords(
        '[MOCK] Our journey begins with Alex, a determined explorer.',
        0,
        2000
      ),
    },
    {
      text: 'Standing at the edge of the Whispering Woods.',
      start: 2100,
      end: 4000,
      words: generateMockWords(
        'Standing at the edge of the Whispering Woods.',
        2100,
        4000
      ),
    },
    {
      text: 'Legend says a forgotten treasure lies within.',
      start: 4100,
      end: 6000,
      words: generateMockWords(
        'Legend says a forgotten treasure lies within.',
        4100,
        6000
      ),
    },
    {
      text: 'The ancient trees tower overhead, creating an intimidating canopy.',
      start: 6100,
      end: 8000,
      words: generateMockWords(
        'The ancient trees tower overhead, creating an intimidating canopy.',
        6100,
        8000
      ),
    },
    {
      text: 'Golden sunlight filters through the leaves, illuminating the path forward.',
      start: 8100,
      end: 10000,
      words: generateMockWords(
        'Golden sunlight filters through the leaves, illuminating the path forward.',
        8100,
        10000
      ),
    },
    {
      text: 'With a deep breath, Alex steps into the unknown.',
      start: 10100,
      end: 12000,
      words: generateMockWords(
        'With a deep breath, Alex steps into the unknown.',
        10100,
        12000
      ),
    },
    {
      text: 'The journey has just begun.',
      start: 12100,
      end: 14000,
      words: generateMockWords('The journey has just begun.', 12100, 14000),
    },
  ],
};

/**
 * Helper function to generate mock word objects for captions
 * @param text The text to split into words
 * @param start The start time for the first word
 * @param end The end time for the last word
 * @returns Array of CaptionWord objects
 */
function generateMockWords(
  text: string,
  start: number,
  end: number
): CaptionWord[] {
  const words = text.split(' ');
  const duration = end - start;
  const wordDuration = duration / words.length;

  return words.map((word, index) => {
    const wordStart = start + index * wordDuration;
    const wordEnd = wordStart + wordDuration;

    return {
      text: word,
      start: Math.round(wordStart),
      end: Math.round(wordEnd),
      confidence: 0.99,
    };
  });
}

/**
 * Generates mock captions for testing purposes
 * @param audioFileUrl URL of the audio file (used to determine which mock to use)
 * @returns An array of caption objects with timing information
 */
export async function generateMockCaptions(
  audioFileUrl: string
): Promise<Caption[]> {
  try {
    // Select a mock caption set based on URL hash to ensure consistent selection
    const urlHash = audioFileUrl
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Choose from one of the three sets based on hash
    const mockType = ['short', 'medium', 'long'][urlHash % 3];
    const selectedMockCaptions = MOCK_CAPTIONS[mockType];

    // Add a delay to simulate real API latency
    const mockDelay = Math.floor(Math.random() * 500) + 500; // Random delay between 500-1000ms
    await new Promise((resolve) => setTimeout(resolve, mockDelay));

    // Add a debug tag to help identify these are mock captions
    const mockedCaptions = selectedMockCaptions.map((caption, index) => {
      // Only add the [MOCK] tag to captions that don't already have it
      if (index > 0 && index % 2 === 0 && !caption.text.startsWith('[MOCK]')) {
        return {
          ...caption,
          text: `[MOCK] ${caption.text}`,
          words: generateMockWords(
            `[MOCK] ${caption.text}`,
            caption.start,
            caption.end
          ),
        };
      }
      return caption;
    });

    console.log(
      `Mock captions generated successfully (${mockType} set with ${mockedCaptions.length} segments)`
    );
    return mockedCaptions;
  } catch (error) {
    console.error('Error generating mock captions:', error);
    throw new Error('Failed to generate mock captions');
  }
}
