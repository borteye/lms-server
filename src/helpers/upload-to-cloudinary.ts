import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

export async function uploadImageToCloudinary(
  fileBuffer: Buffer,
  folder: string = "lms/logos"
) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(
            new Error(
              `Failed to upload image to Cloudinary: ${
                error instanceof Error ? error.message : "Unknown error"
              }`
            )
          );
        }
        if (!result) {
          return reject(new Error("No result returned from Cloudinary"));
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          url: result.url,
        });
      }
    );

    // Convert buffer into a readable stream and pipe into Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}
