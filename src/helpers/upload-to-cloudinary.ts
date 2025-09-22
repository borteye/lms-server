import cloudinary from "../config/cloudinary";
import fs from "fs";

export async function uploadImageToCloudinary(
  filePath: string,
  folder: string = "lms/logos"
) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
    });

    // Clean up the local file
    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath);
    // }

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      url: result.url,
    };
  } catch (error) {
    // Clean up file on error
    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath);
    // }
    throw new Error(
      `Failed to upload image to Cloudinary: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
