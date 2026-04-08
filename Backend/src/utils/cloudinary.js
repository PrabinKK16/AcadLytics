import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new ApiError(400, "File path is required");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "acadlytics/avatars",
      resource_type: "image",
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    throw new ApiError(500, "Cloudinary upload failed", [error.message]);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
};
