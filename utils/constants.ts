export const GDS_CATEGORIES = [
 
] as const;

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const IMAGE_UPLOAD_CONFIG = {
  maxFiles: 10,
  acceptedTypes: SUPPORTED_IMAGE_TYPES,
  maxSize: MAX_IMAGE_SIZE,
}; 