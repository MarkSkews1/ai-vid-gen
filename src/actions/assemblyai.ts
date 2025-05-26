'use server';
import { AssemblyAI } from 'assemblyai';

// Check if API key exists
if (!process.env.ASSEMBLYAI_API_KEY) {
  console.error(
    'AssemblyAI API key is missing! Please add it to your environment variables.'
  );
}

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export type CaptionWord = {
  text: string;
  start: number;
  end: number;
  confidence: number;
};

export type Caption = {
  text: string;
  start: number;
  end: number;
  words: CaptionWord[];
};

/**
 * Generates captions for an audio file using AssemblyAI
 * @param audioFileUrl URL of the audio file to transcribe
 * @returns An array of caption objects with timing information
 */
export async function generateCaptions(
  audioFileUrl: string
): Promise<Caption[]> {
  try {
    const data = {
      audio_url: audioFileUrl,
      word_boost: ['AI', 'video', 'generation'],
      format_text: true,
      punctuate: true,
      // Set the language to English for better accuracy
      language_code: 'en_us',
    };

    console.log(
      `Requesting transcription for audio: ${audioFileUrl.substring(0, 50)}...`
    );
    const transcript = await client.transcripts.transcribe(data);

    if (!transcript || !transcript.words || transcript.words.length === 0) {
      console.warn('No words returned from transcription');
      return [];
    }

    console.log(
      `Transcription successful, received ${transcript.words.length} words`
    );

    // Create captions by grouping words into sentences/phrases
    const captions: Caption[] = [];
    let currentCaption: Caption = {
      text: '',
      start: 0,
      end: 0,
      words: [],
    };

    let wordCount = 0;

    // Group words into caption segments (roughly 7-10 words per caption)
    transcript.words.forEach((word: CaptionWord, index: number) => {
      // Start a new caption if this is the first word
      if (index === 0) {
        currentCaption.text = word.text;
        currentCaption.start = word.start;
        currentCaption.end = word.end;
        currentCaption.words = [word];
        wordCount = 1;
      }
      // Create a new caption every ~7 words or at punctuation
      else if (
        wordCount >= 7 ||
        word.text.includes('.') ||
        word.text.includes('!') ||
        word.text.includes('?')
      ) {
        // Add the current word to complete this caption
        currentCaption.text += ' ' + word.text;
        currentCaption.end = word.end;
        currentCaption.words.push(word);

        // Save the completed caption
        captions.push({ ...currentCaption });

        // Start a new caption
        currentCaption = {
          text: '',
          start: word.end,
          end: word.end,
          words: [],
        };
        wordCount = 0;
      }
      // Continue adding to the current caption
      else {
        currentCaption.text += ' ' + word.text;
        currentCaption.end = word.end;
        currentCaption.words.push(word);
        wordCount++;
      }
    });

    // Add the last caption if it has content
    if (currentCaption.text.trim() !== '') {
      captions.push(currentCaption);
    }

    console.log(`Generated ${captions.length} caption segments`);
    return captions;
  } catch (err: unknown) {
    console.error('Error generating captions:', err);
    throw new Error(
      typeof err === 'string'
        ? err
        : err instanceof Error
        ? err.message
        : JSON.stringify(err)
    );
  }
}
