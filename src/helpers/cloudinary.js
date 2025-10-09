import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Handle connect to cloudinary
 */
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// handle upload media
export const uploadMedia = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Error when uploading to cloudinary');
  }
}

// handle delete media
export const deleteMedia = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    throw new Error("Failed when deleting media from cloudinary");
  }
}

