import express from "express";
import authRoutes from "./auth.routes";
import schoolRoutes from "./school.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/school", schoolRoutes);

export default router;
