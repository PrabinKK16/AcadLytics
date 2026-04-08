import { Router } from "express";
import {
  getCourseAnalyticsData,
  exportCourseAnalyticsCSV,
} from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get(
  "/course/:courseId",
  authorizeRoles("faculty", "admin"),
  getCourseAnalyticsData
);

router.get(
  "/course/:courseId/export/csv",
  authorizeRoles("faculty", "admin"),
  exportCourseAnalyticsCSV
);

export default router;
