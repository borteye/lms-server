import express from "express";
import * as controller from "../controllers/department.controller";
import { authenticateAccessToken } from "../../../middlewares/jwt-authenticator";
import { authorizeRole } from "../../../middlewares/authorizeRole";

const router = express.Router();

router.get("/departments", authenticateAccessToken, controller.getDepartments);
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

export default router;
