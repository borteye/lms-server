import express from "express";
import * as controller from "../controllers/classes.controller";
import { authenticateAccessToken } from "../../../middlewares/jwt-authenticator";
import { authorizeRole } from "../../../middlewares/authorizeRole";

const router = express.Router();

router.post(
  "/create",
  authenticateAccessToken,
  authorizeRole("admin"),
  controller.createClassroom
);
router.put(
  "/update/:id",
  authenticateAccessToken,
  authorizeRole("admin"),
  controller.updateClassroom
);

export default router;
