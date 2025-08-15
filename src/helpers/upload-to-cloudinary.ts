import cloudinary from "../config/cloudinary";
import fs from "fs";
import { NextFunction, Request, Response } from "express";
import { ResponseStructure } from "../utils/utils";

export const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filePath = req?.file?.path;

    if (!filePath) {
      return next();
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "lms",
    });

    if (filePath) {
      fs.unlinkSync(filePath);
    }

    res.locals.secure_url = result.secure_url;
    next();
  } catch (err) {
    res.status(500).json(
      ResponseStructure({
        code: 500,
        message: "Something went wrong",
        subCode: "SERVER_ERROR",
        data: null,
        errors: [{ errorMessage: "Something went wrong", field: "unknown" }],
      })
    );
  }
};
