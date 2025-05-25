'use server';
import { uploadStream } from '@/lib/cloudinary';
import * as textToSpeech from '@google-cloud/text-to-speech';
import { nanoid } from 'nanoid';

export async function generateAudioFromText(text: string) {
  const client = new textToSpeech.TextToSpeechClient({
    apiKey: process.env.GOOGLE_API_KEY,
  });

  // add a short pause at the end of the text
  const textWithPause = text + '. <break time="500ms"/>';
  const request = {
    input: { ssml: `<speak>${textWithPause}</speak>` },
    voice: {
      languageCode: 'en-US',
      name: 'en-US-Neural2-F',
      ssmlGender:
        textToSpeech.protos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE,
    },
    audioConfig: {
      audioEncoding:
        textToSpeech.protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
    },
  }; // perform the text to speech request
  const [response] = await client.synthesizeSpeech(request);
  const audioContent = response.audioContent;

  if (!audioContent) {
    throw new Error('Failed to generate audio: No content returned');
  }

  // Ensure we have a proper Buffer for Cloudinary
  const audioBuffer = Buffer.isBuffer(audioContent)
    ? audioContent
    : Buffer.from(audioContent);

  // generate UID for the audio file
  const fileName = nanoid(6);

  try {
    // Upload to Cloudinary using our server function
    const result = await uploadStream(audioBuffer, {
      resource_type: 'video',
      public_id: fileName,
    });

    if (result) {
      console.log('Audio uploaded to Cloudinary:', result.secure_url);
      return { url: result.secure_url };
    } else {
      console.log('No result returned from Cloudinary upload');
      throw new Error('No result returned from Cloudinary upload');
    }
  } catch (error) {
    console.log('Error uploading audio to Cloudinary:', error);
    throw new Error('Upload to Cloudinary failed');
  }
}
