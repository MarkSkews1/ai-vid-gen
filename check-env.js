console.log(
  'REPLICATE_API_TOKEN:',
  process.env.REPLICATE_API_TOKEN
    ? 'exists (length: ' + process.env.REPLICATE_API_TOKEN.length + ')'
    : 'missing'
);
console.log(
  'CLOUDINARY_CLOUD_NAME:',
  process.env.CLOUDINARY_CLOUD_NAME ? 'exists' : 'missing'
);
console.log(
  'CLOUDINARY_API_KEY:',
  process.env.CLOUDINARY_API_KEY ? 'exists' : 'missing'
);
console.log(
  'CLOUDINARY_API_SECRET:',
  process.env.CLOUDINARY_API_SECRET ? 'exists' : 'missing'
);
console.log('USE_MOCK_GEMINI:', process.env.USE_MOCK_GEMINI || 'not set');
console.log('USE_MOCK_REPLICATE:', process.env.USE_MOCK_REPLICATE || 'not set');
