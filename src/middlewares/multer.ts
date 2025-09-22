// middleware/upload.ts
import multer from "multer";
import { excelMimeTypes, imageMimeTypes } from "../utils/utils";

const allowedMimeTypes = [...imageMimeTypes, ...excelMimeTypes];

// Use memoryStorage instead of diskStorage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
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
      return cb(
        new Error(`Only ${allowedExtensions.join(", ")} formats allowed!`)
      );
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export default upload;
