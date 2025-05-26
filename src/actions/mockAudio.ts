'use server';

import { nanoid } from 'nanoid';
import { uploadStream } from '@/lib/cloudinary';

// Sample mock audio URLs
const MOCK_AUDIO_URLS = [
  'https://res.cloudinary.com/demo/video/upload/v1624523009/samples/audio1.mp3',
  'https://res.cloudinary.com/demo/video/upload/v1624523009/samples/audio2.mp3',
  'https://res.cloudinary.com/demo/video/upload/v1624523009/samples/audio3.mp3',
  'https://res.cloudinary.com/demo/video/upload/v1624523009/samples/audio4.mp3',
  'https://res.cloudinary.com/demo/video/upload/v1624523009/samples/audio5.mp3',
];

/**
 * Generates a mock audio file for testing purposes
 * @param text The text content to generate audio for (used as seed for selection)
 * @returns Object with URL to the mock audio file
 */
export async function generateMockAudio(text: string) {
  try {
    // Select a mock audio URL based on text hash to ensure consistent selection
    // for the same text
    const textHash = text
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selectedMockAudio =
      MOCK_AUDIO_URLS[textHash % MOCK_AUDIO_URLS.length];

    // Add a delay to simulate real API latency
    const mockDelay = Math.floor(Math.random() * 300) + 200; // Random delay between 200-500ms
    await new Promise((resolve) => setTimeout(resolve, mockDelay));

    // For real development environments, you might want to actually create an audio file
    // Here's an example of how to do that using predefined audio files instead of URLs

    // Optional: If you want to use actual mock audio files (not implemented here)
    // const audioPath = path.join(process.cwd(), 'public', 'mock-audio', 'sample.mp3');
    // const audioBuffer = fs.readFileSync(audioPath);

    console.log('Mock audio generated successfully');
    return { url: selectedMockAudio };
  } catch (error) {
    console.error('Error generating mock audio:', error);
    throw new Error('Failed to generate mock audio');
  }
}

/**
 * Creates an empty MP3 buffer for mock testing when needed
 * This can be useful when you need to upload a real file to Cloudinary
 * but don't want to use an external API for generating it
 * @returns Buffer containing a minimal valid MP3 file
 */
export function createEmptyMP3Buffer(): Buffer {
  // This is a minimal valid MP3 header (not a complete file)
  // For real testing, you would use a complete MP3 file
  const buffer = Buffer.from([
    0xff, 0xfb, 0x90, 0x44, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
  ]);
  return buffer;
}

/**
 * Generates a mock audio and uploads it to Cloudinary
 * This is useful when you need to test the full pipeline including upload
 * @param _text The text content to generate audio for (not used internally)
 * @returns Object with URL to the uploaded mock audio file
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function generateAndUploadMockAudio(
  _text: string
): Promise<{ url: string }> {
  try {
    // Create a mock MP3 buffer
    const audioBuffer = createEmptyMP3Buffer();

    // generate UID for the audio file
    const fileName = nanoid(6); // Upload to Cloudinary using our server function
    const result = await uploadStream(audioBuffer, {
      resource_type: 'video',
      folder: 'ai_video_images_udemy',
      public_id: `mock_${fileName}`,
    });

    if (result) {
      console.log('Mock audio uploaded to Cloudinary:', result.secure_url);
      return { url: result.secure_url };
    } else {
      console.log('No result returned from Cloudinary upload');
      throw new Error('No result returned from Cloudinary upload');
    }
  } catch (error) {
    console.error('Error uploading mock audio to Cloudinary:', error);
    throw new Error('Mock audio upload to Cloudinary failed');
  }
}
