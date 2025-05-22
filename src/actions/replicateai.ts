'use server';

import Replicate from 'replicate';
import { v2 as cloudinaryV2 } from 'cloudinary';
import { nanoid } from 'nanoid';
import fetch from 'node-fetch';

// Configure Replicate API client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Configure Cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define types for better type safety
interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: unknown;
}

export async function generateImageAi(imagePrompt: string): Promise<string> {
  try {
    // 1. generate image using Replicate AI
    const input = {
      prompt: imagePrompt,
      output_format: 'url',
      output_quality: 80,
      aspect_ratio: '1:1', // Fixed typo: aspect_ration -> aspect_ratio
    };

    const output = (await replicate.run(
      'bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe',
      { input }
    )) as string[];

    const imageUrl = output[0];
    if (!imageUrl) {
      throw new Error('Failed to generate image: No URL returned');
    }

    // 2. fetch the image data from generated image url
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. upload the image to Cloudinary using buffer
    const uploadResponse = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        cloudinaryV2.uploader
          .upload_stream(
            {
              folder: 'ai_video_images_udemy',
              public_id: nanoid(),
            },
            (
              error: Error | undefined,
              result: CloudinaryUploadResult | undefined
            ) => {
              if (error || !result) {
                reject(error || new Error('No result from Cloudinary'));
              } else {
                resolve(result);
              }
            }
          )
          .end(buffer);
      }
    );

    // 4. return the image url from Cloudinary
    if (!uploadResponse || !uploadResponse.secure_url) {
      throw new Error('Failed to upload to Cloudinary');
    }

    const cloudinaryUrl = uploadResponse.secure_url;
    console.log('cloudinary image =>', cloudinaryUrl);
    return cloudinaryUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
