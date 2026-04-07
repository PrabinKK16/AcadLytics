import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { createCourse } from "../controllers/admin.controller.js";
import { createFeedbackForm } from "../controllers/admin.controller.js";
import { addQuestionToForm } from "../controllers/admin.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(authorizeRoles("admin"));

router.post("/course", createCourse);
router.post("/feedback-form", createFeedbackForm);
router.post("/question", addQuestionToForm);

export default router;
