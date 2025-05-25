'use server';

import Replicate from 'replicate';
// import { v2 as cloudinaryV2 } from 'cloudinary';
import { nanoid } from 'nanoid';
import fetch from 'node-fetch';
import cloudinaryV2 from '@/lib/cloudinary';

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
interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: unknown;
}

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
    console.log('imageUrl =>', imageUrl);

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
