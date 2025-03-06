// /src/backend/db/cloudinary.js

import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log the Cloudinary API key for debugging (ensure it's printed in your terminal during setup)
console.log(process.env.CLOUDINARY_API_KEY);

// Configure Cloudinary using environment variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary.v2;
