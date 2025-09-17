import express from "express";
import * as controller from "./controller";
import { authenticateAccessToken } from "../../middlewares/jwt-authenticator";

const router = express.Router();

router.post("/auth/sign-in", controller.signIn);
router.get("/class-levels", authenticateAccessToken, controller.getClassLevels);
router.get("/departments", authenticateAccessToken, controller.getDepartments);

export default router;
