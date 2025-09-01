import { isExcelFile, isImageFile, ResponseStructure } from "../utils/utils";
import fs from "fs-extra";
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
    const filePath = req?.file?.path;

    // If no file is uploaded, continue to next middleware
    if (!filePath || !req.file) {
      return next();
    }

    const { mimetype } = req.file;

    // Handle image upload (logo)
    if (isImageFile(mimetype)) {
      const imageResult = await uploadImageToCloudinary(filePath);

      // Store the result for use in the main route handler
      req.uploadResult = {
        type: "image",
        data: imageResult,
      };

      return next();
    }

    // Handle Excel upload (students data)
    if (isExcelFile(mimetype)) {
      const excelData = await processExcel(filePath);

      // Store the processed Excel data
      req.uploadResult = {
        type: "excel",
        data: excelData,
      };

      return next();
    }

    // If we reach here, the file type wasn't handled
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
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
