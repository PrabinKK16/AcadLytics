import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getActiveFeedbackForm,
  submitFeedback,
} from "../controllers/feedback.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/active/:courseId", getActiveFeedbackForm);
router.post("/submit", submitFeedback);

export default router;
