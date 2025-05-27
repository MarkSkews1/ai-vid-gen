'use server';

import Replicate from 'replicate';
import { nanoid } from 'nanoid';
import fetch from 'node-fetch';
import { uploadStream } from '@/lib/cloudinary';

// Configure Replicate API client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// // Configure Cloudinary
// cloudinaryV2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Define types for better type safety
// CloudinaryUploadResult interface is no longer needed as it's imported via the uploadStream function

// Mock image URLs for development mode - Cloudinary URLs that won't expire
const mockImageUrls = [
  // Adventure/Fantasy themed images
  'https://res.cloudinary.com/dxgbphyhf/image/upload/v1716636431/ai_video_images_udemy/mock/fantasy_adventure_qv1hty.jpg',
  'https://res.cloudinary.com/dxgbphyhf/image/upload/v1716636431/ai_video_images_udemy/mock/forest_adventure_guhznk.jpg',
  'https://res.cloudinary.com/dxgbphyhf/image/upload/v1716636431/ai_video_images_udemy/mock/cave_treasure_hqfufj.jpg',

  // Sci-Fi themed images
  'https://res.cloudinary.com/dxgbphyhf/image/upload/v1716636431/ai_video_images_udemy/mock/scifi_city_a0lvrj.jpg',
  'https://res.cloudinary.com/dxgbphyhf/image/upload/v1716636431/ai_video_images_udemy/mock/space_station_z8tpzx.jpg',

  // Nature themed images
  'https://res.cloudinary.com/dxgbphyhf/image/upload/v1716636431/ai_video_images_udemy/mock/mountain_landscape_wg1b5j.jpg',
  'https://res.cloudinary.com/dxgbphyhf/image/upload/v1716636431/ai_video_images_udemy/mock/ocean_scene_tvwxma.jpg',

  // Urban/City themed images
  'https://res.cloudinary.com/dxgbphyhf/image/upload/v1716636431/ai_video_images_udemy/mock/city_street_mrj1su.jpg',
  'https://res.cloudinary.com/dxgbphyhf/image/upload/v1716636431/ai_video_images_udemy/mock/night_city_gu7fkj.jpg',

  // Character focused images
  'https://res.cloudinary.com/dxgbphyhf/image/upload/v1716636431/ai_video_images_udemy/mock/hero_character_ahg3qv.jpg',
  'https://res.cloudinary.com/dxgbphyhf/image/upload/v1716636431/ai_video_images_udemy/mock/group_characters_hbsgk7.jpg',
];

export async function generateImageAi(imagePrompt: string): Promise<string> {
  try {
    // Debug: Log environment variables availability
    console.log(
      'Replicate API Token available:',
      !!process.env.REPLICATE_API_TOKEN
    );
    console.log(
      'Cloudinary config available:',
      !!process.env.CLOUDINARY_CLOUD_NAME &&
        !!process.env.CLOUDINARY_API_KEY &&
        !!process.env.CLOUDINARY_API_SECRET
    );

    // Check if we should use mock images in development mode
    const mockEnvValue = process.env.USE_MOCK_REPLICATE;
    console.log('USE_MOCK_REPLICATE env value:', mockEnvValue);
    const useMockResponse = mockEnvValue === 'true';
    if (useMockResponse) {
      console.log('Using mock Replicate image for development');
      // Return a random mock image URL
      const randomIndex = Math.floor(Math.random() * mockImageUrls.length);
      const mockImageUrl = mockImageUrls[randomIndex];
      console.log('Selected mock image URL:', mockImageUrl);

      // Verify the mock URL is valid
      try {
        const response = await fetch(mockImageUrl, { method: 'HEAD' });
        if (!response.ok) {
          console.error(`Mock image URL returned status: ${response.status}`);
          // Fallback to a local image if the mock URL fails
          return '/images/fantasy.jpg';
        }
      } catch (error) {
        console.error('Error checking mock image URL:', error);
        // Fallback to a local image if fetch fails
        return '/images/fantasy.jpg';
      }

      return mockImageUrl;
    }

    // For testing - you can uncomment this to force mock images in development
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('Forcing mock image in development mode');
    //   const randomIndex = Math.floor(Math.random() * mockImageUrls.length);
    //   return mockImageUrls[randomIndex];
    // }

    // 1. generate image using Replicate AI
    const input = {
      prompt: imagePrompt,
      // Only use parameters that are supported by the model
      width: 512,
      height: 512,
      scheduler: 'K_EULER',
      num_inference_steps: 4,
      guidance_scale: 0,
      seed: Math.floor(Math.random() * 1000000),
    };

    console.log(
      'About to call Replicate AI with prompt:',
      imagePrompt.substring(0, 50) + '...'
    );

    console.log('Replicate input parameters:', JSON.stringify(input, null, 2));

    // Generate the image with Replicate AI
    const output = (await replicate.run(
      'bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe',
      { input }
    )) as string[];

    console.log('Replicate API response:', JSON.stringify(output, null, 2));

    const imageUrl = output[0];
    if (!imageUrl) {
      throw new Error('Failed to generate image: No URL returned');
    }

    console.log('Successfully got image URL from Replicate');

    // 2. fetch the image data from generated image url
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('buffer =>', buffer);
    console.log('imageUrl =>', imageUrl); // 3. upload the image to Cloudinary using buffer
    try {
      const uploadResponse = await uploadStream(buffer, {
        folder: 'ai_video_images_udemy',
        public_id: nanoid(),
      });

      // 4. return the image url from Cloudinary
      if (!uploadResponse || !uploadResponse.secure_url) {
        throw new Error('Failed to upload to Cloudinary');
      }

      const cloudinaryUrl = uploadResponse.secure_url;
      console.log('cloudinary image =>', cloudinaryUrl);
      return cloudinaryUrl;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Failed to upload to Cloudinary');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    if (error instanceof Error) {
      // Check if this might be a parameter error with the Replicate model
      if (
        error.message.includes('output_format') ||
        error.message.includes('Prediction failed')
      ) {
        throw new Error(
          `Model parameter error: ${error.message}. This might be related to invalid input parameters.`
        );
      }
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
