import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMyEnrolledCourses } from "../controllers/enrollment.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/my-courses", getMyEnrolledCourses);

export default router;
