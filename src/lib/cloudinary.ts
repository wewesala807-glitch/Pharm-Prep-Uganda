import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(base64File: string, folder: string) {
  const result = await cloudinary.uploader.upload(base64File, {
    folder: `pharmaprep/${folder}`,
    resource_type: "image",
    // Automatic format + quality compression, per spec
    fetch_format: "auto",
    quality: "auto",
  });
  return result.secure_url;
}

export { cloudinary };
