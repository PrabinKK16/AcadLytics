import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import {
  getActiveFeedbackForm,
  submitFeedback,
  getSubmissionHistory,
} from "../controllers/feedback.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/active/:courseId", getActiveFeedbackForm);
router.post("/submit", authorizeRoles("student"), submitFeedback);
router.get("/history", authorizeRoles("student"), getSubmissionHistory);

export default router;
