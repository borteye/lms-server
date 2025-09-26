import express from "express";
import * as controller from "../controllers/department.controller";
import { authenticateAccessToken } from "../../../middlewares/jwt-authenticator";
import { authorizeRole } from "../../../middlewares/authorizeRole";

const router = express.Router();

router.get("/departments", authenticateAccessToken, controller.getDepartments);
router.get(
  "/department/:id",
  authenticateAccessToken,
  controller.getSingleDepartment
);
router.post(
  "/create",
  authenticateAccessToken,
  authorizeRole("admin"),
  controller.createDepartment
);
router.put(
  "/update/:id",
  authenticateAccessToken,
  authorizeRole("admin"),
  controller.updateDepartment
);

router.delete(
  "/delete/:id",
  authenticateAccessToken,
  authorizeRole("admin"),
  controller.deleteDepartment
);

export default router;
