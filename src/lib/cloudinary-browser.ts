'use client';

// This is a mock implementation of Cloudinary for client-side code
// It will be used in place of the real Cloudinary library when imported in client components
// All methods are no-ops that return empty results

const mockCloudinary = {
  uploader: {
    upload: () => Promise.resolve({}),
    upload_stream: () => ({
      end: () => {},
    }),
  },
  url: () => '',
  image: () => ({
    toURL: () => '',
  }),
  video: () => ({
    toURL: () => '',
  }),
  config: () => {},
};

export default mockCloudinary;
export const v2 = mockCloudinary;
