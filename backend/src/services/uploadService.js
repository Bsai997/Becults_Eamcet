import { cloudinary } from "../config/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

export const uploadImageToCloudinary = async (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "test-platform",
        public_id: fileName.replace(/\.[^/.]+$/, ""),
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(new ApiError(500, "Failed to upload image to Cloudinary"));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};
