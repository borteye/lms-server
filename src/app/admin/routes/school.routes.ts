import express from "express";
import * as schoolController from "../controllers/school.controller";
import * as teacherController from "../controllers/teacher.controller";
import * as studentController from "../controllers/student.controller";
import * as coursesController from "../controllers/courses.controller";
import upload from "../../../middlewares/multer";
import { handleFileUpload } from "../../../helpers/handle-file-upload";
import {
  authenticateAccessToken,
  authenticateEmailVerificationToken,
} from "../../../middlewares/jwt-authenticator";
import { authorizeRole } from "../../../middlewares/authorizeRole";

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

router.post(
  "/teacher/create",
  authenticateAccessToken,
  authorizeRole("admin"),
  teacherController.createTeacher
);

router.post(
  "/student/create",
  authenticateAccessToken,
  authorizeRole("admin"),
  studentController.createStudent
);

router.post(
  "/subject/create",
  authenticateAccessToken,
  authorizeRole("admin"),
  coursesController.createSubject
);

router.post(
  "/course/create",
  authenticateAccessToken,
  authorizeRole("admin"),
  coursesController.createCourse
);

router.get(
  "/teachers",
  authenticateAccessToken,
  authorizeRole("admin"),
  schoolController.getAllTeachersInSchool
);

router.get(
  "/stats/department",
  authenticateAccessToken,
  authorizeRole("admin"),
  schoolController.getSchoolStatisticsForDepartment
);

router.get(
  "/stats/dashboard",
  authenticateAccessToken,
  authorizeRole("admin"),
  schoolController.getSchoolStatisticsForDashboard
);

router.get(
  "/departments",
  authenticateAccessToken,
  authorizeRole("admin"),
  schoolController.getSchoolDepartments
);

router.get(
  "/stats/classes",
  authenticateAccessToken,
  authorizeRole("admin"),
  schoolController.getSchoolStatisticsForClasses
);

export default router;
