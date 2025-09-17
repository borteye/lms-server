import express from "express";
import authRoutes from "./auth.routes";
import schoolRoutes from "./school.routes";
import departmentRoutes from "./department.routes";
import classesRoutes from "./classes.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/school", schoolRoutes);
router.use("/department", departmentRoutes);
router.use("/classes", classesRoutes);

export default router;
