import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "./../middlewares/role.middleware.js";
import {
  createCourse,
  createFeedbackForm,
  deactivateFeedbackForm,
  addQuestionToForm,
  deleteQuestion,
  getAllSubjects,
  deleteSubject,
  createCourseOutcome,
  getCourseOutcomes,
  deleteCourseOutcome,
  enrollStudents,
  getAllStudents,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(authorizeRoles("admin"));

router.post("/course", createCourse);
router.get("/subjects", getAllSubjects);
router.delete("/subjects/:id", deleteSubject);

router.post("/feedback-form", createFeedbackForm);
router.patch("/feedback-form/:id/deactivate", deactivateFeedbackForm);

router.post("/question", addQuestionToForm);
router.delete("/question/:id", deleteQuestion);

router.post("/course-outcome", createCourseOutcome);
router.get("/course-outcome/:courseId", getCourseOutcomes);
router.delete("/course-outcome/:id", deleteCourseOutcome);

router.post("/enroll", enrollStudents);
router.get("/students", getAllStudents);

export default router;
