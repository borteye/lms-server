import { isExcelFile, isImageFile, ResponseStructure } from "../utils/utils";
import fs from "fs-extra";
import path from "path";
import os from "os";
import { NextFunction, Response } from "express";
import { uploadImageToCloudinary } from "./upload-to-cloudinary";
import { processExcel } from "./process-excel";
import { EnhancedRequest } from "../types/shared";

export const handleFileUpload = async (
  req: EnhancedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // If no file is uploaded, continue
    if (!req.file) {
      return next();
    }

    const { mimetype, buffer, originalname } = req.file;

    // Handle image upload (direct to Cloudinary)
    if (isImageFile(mimetype)) {
      const imageResult = await uploadImageToCloudinary(buffer, "lms/logos");

      req.uploadResult = {
        type: "image",
        data: imageResult,
      };

      return next();
    }

    // Handle Excel upload (write buffer to temp file, then process)
    if (isExcelFile(mimetype)) {
      const tempDir = os.tmpdir(); // system temp directory (safe on Render)
      const tempFilePath = path.join(tempDir, Date.now() + "-" + originalname);

      // Write buffer to temp file
      await fs.writeFile(tempFilePath, buffer);

      const excelData = await processExcel(tempFilePath);

      // Clean up temp file after processing
      await fs.remove(tempFilePath);

      req.uploadResult = {
        type: "excel",
        data: excelData,
      };

      return next();
    }

    throw new Error("Unsupported file type");
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json(
      ResponseStructure({
        code: 500,
        message: error instanceof Error ? error.message : "File upload failed",
        subCode: "FILE_UPLOAD_ERROR",
        data: null,
        errors: [
          {
            errorMessage:
              error instanceof Error ? error.message : "File upload failed",
            field: "file",
          },
        ],
      })
    );
  }
};
