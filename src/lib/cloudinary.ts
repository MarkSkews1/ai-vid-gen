'use server';
import { v2 as cloudinaryV2 } from 'cloudinary';
import { Buffer as NodeBuffer } from 'node:buffer';

// Define types for Cloudinary responses
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}

// Configure Cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export async functions instead of the object directly
export async function uploadStream(
  buffer: NodeBuffer,
  options: Record<string, unknown>
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryV2.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result as CloudinaryUploadResult);
      }
    );
    uploadStream.end(buffer);
  });
}

export async function uploadFile(
  path: string,
  options: Record<string, unknown>
): Promise<CloudinaryUploadResult> {
  return cloudinaryV2.uploader.upload(
    path,
    options
  ) as Promise<CloudinaryUploadResult>;
}

// Add other Cloudinary functions as needed
