'use server';
import cloudinaryV2 from '@/lib/cloudinary';
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
  };
  // perform the text to speech request
  const [response] = await client.synthesizeSpeech(request);
  const audioBuffer = response.audioContent;

  // generate UID for the audio file
  const fileName = nanoid(6);

  // return a promise to upload the audio file to Cloudinary
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryV2.uploader.upload_stream(
      {
        resource_type: 'video',
        public_id: fileName,
      },
      (error, result) => {
        if (error) {
          console.log('Error uploading audio to Cloudinary:', error);
          return reject(new Error('Upload to Cloudinary failed'));
        } else {
          if (result) {
            console.log('Audio uploaded to Cloudinary:', result.secure_url);
            return resolve({ url: result.secure_url });
          } else {
            console.log('No result returned from Cloudinary upload');
            return reject(
              new Error('No result returned from Cloudinary upload')
            );
          }
        }
      }
    );

    uploadStream.end(audioBuffer);
  });
}
