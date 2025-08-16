import express from "express";
import * as controller from "./controller";
import upload from "../../middlewares/multer";
import { uploadToCloudinary } from "../../helpers/upload-to-cloudinary";
import { authenticateAccessToken } from "../../middlewares/jwt-authenticator";

const router = express.Router();

router.post(
  "/create-school",
  authenticateAccessToken,
  upload.single("schoolLogo"),
  uploadToCloudinary,
  controller.createSchool
);

export default router;
