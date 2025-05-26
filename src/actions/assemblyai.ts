'use server';
import { AssemblyAI } from 'assemblyai';

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export async function generateCaptions(audioFileUrl: string) {
  try {
    const data = {
      audio_url: audioFileUrl,
    };

    const transcript: any = await client.transcripts.transcribe(data);
    console.log(transcript.words);
    return transcript.words;
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
