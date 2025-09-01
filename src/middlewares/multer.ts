// middleware/upload.ts
import multer from "multer";
import path from "path";
import { excelMimeTypes, imageMimeTypes } from "../utils/utils";

const allowedMimeTypes = [...imageMimeTypes, ...excelMimeTypes];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      // Enhanced error message to include Excel formats
      const allowedExtensions = [
        ".png",
        ".jpg",
        ".jpeg",
        ".webp",
        ".svg",
        ".bmp",
        ".tiff",
        ".xlsx",
        ".xls",
        ".csv",
        ".xlsm",
        ".xltm",
        ".xltx",
      ];
      cb(null, false);
      return cb(
        new Error(`Only ${allowedExtensions.join(", ")} formats allowed!`)
      );
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit (Excel files can be larger than images)
});

export default upload;
