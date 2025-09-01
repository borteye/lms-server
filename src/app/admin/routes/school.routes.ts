import express from "express";
import * as schoolController from "../controllers/school.controller";
import upload from "../../../middlewares/multer";
import { handleFileUpload } from "../../../helpers/handle-file-upload";
import { authenticateEmailVerificationToken } from "../../../middlewares/jwt-authenticator";

const router = express.Router();

router.post(
  "/create/step-1",
  authenticateEmailVerificationToken,
  upload.single("logo"),
  handleFileUpload,
  schoolController.createSchool
);
router.post(
  "/create/step-2",
  authenticateEmailVerificationToken,
  schoolController.createAcademicStructure
);
router.post(
  "/create/step-3",
  authenticateEmailVerificationToken,
  schoolController.createGradingSystem
);
router.post(
  "/create/step-4",
  authenticateEmailVerificationToken,
  upload.single("excelFile"),
  handleFileUpload,
  schoolController.successOnboarding
);

export default router;
