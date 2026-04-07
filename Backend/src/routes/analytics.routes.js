import { Router } from "express";
import {
  getCourseAnalytics,
  exportCourseAnalyticsCSV,
} from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get(
  "/course/:courseId",
  authorizeRoles("faculty", "admin"),
  getCourseAnalytics
);

router.get(
  "/course/:courseId/export/csv",
  authorizeRoles("faculty", "admin"),
  exportCourseAnalyticsCSV
);

export default router;
