import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Remove cloudinary config from utils.ts since it's already configured in cloudinary.ts
// and we don't want it imported on the client side
