import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import FeedbackForm from "../models/feedbackForm.model.js";
import Question from "../models/question.model.js";
import CourseOutcome from "../models/courseOutcome.model.js";
import Notification from "../models/notification.model.js";
import logActivity from "../utils/logActivity.js";

export const createCourse = AsyncHandler(async (req, res) => {
  const { name, code, semester, faculty } = req.body;

  if (!name || !code || !semester || !faculty) {
    throw new ApiError(400, "All fields are required");
  }

  const existingCourse = await Course.findOne({
    code: code.toUpperCase().trim(),
  });

  if (existingCourse) {
    throw new ApiError(409, "Course already exists");
  }

  const facultyUser = await User.findById(faculty);

  if (!facultyUser || facultyUser.role !== "faculty") {
    throw new ApiError(400, "Invalid faculty user");
  }

  const course = await Course.create({
    name: name.trim(),
    code: code.toUpperCase().trim(),
    semester,
    faculty,
  });

  await Notification.create({
    recipient: faculty,
    type: "system",
    message: `Assigned to ${course.code}`,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course created successfully"));
});

export const createFeedbackForm = AsyncHandler(async (req, res) => {
  const { title, course, deadline } = req.body;

  if (!title || !course) {
    throw new ApiError(400, "Title and course are required");
  }

  const existingCourse = await Course.findById(course);

  if (!existingCourse) {
    throw new ApiError(404, "Course not found");
  }

  const existingForm = await FeedbackForm.findOne({
    course,
    isActive: true,
  });

  if (existingForm) {
    throw new ApiError(
      409,
      "An active feedback form already exists for this course"
    );
  }

  const form = await FeedbackForm.create({
    title: title.trim(),
    course,
    deadline,
    isActive: true,
  });

  await logActivity({
    user: req.user._id,
    action: "FEEDBACK_FORM_CREATED",
    metadata: {
      formId: form._id,
      course,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, form, "Feedback form created successfully"));
});

export const addQuestionToForm = AsyncHandler(async (req, res) => {
  const { form, text, type, options, co, weightage = 1 } = req.body;

  if (!form || !text || !type || !co) {
    throw new ApiError(400, "Form, text, type and course outcome are required");
  }

  const allowedTypes = ["rating", "mcq", "text"];
  if (!allowedTypes.includes(type)) {
    throw new ApiError(400, "Invalid question type");
  }

  if (weightage <= 0) {
    throw new ApiError(400, "Weightage must be greater than 0");
  }

  const feedbackForm = await FeedbackForm.findById(form);

  if (!feedbackForm) {
    throw new ApiError(404, "Feedback form not found");
  }

  if (!feedbackForm.isActive) {
    throw new ApiError(400, "Cannot add question to inactive form");
  }

  const courseOutcome = await CourseOutcome.findById(co);

  if (!courseOutcome) {
    throw new ApiError(404, "Course outcome not found");
  }

  if (courseOutcome.course.toString() !== feedbackForm.course.toString()) {
    throw new ApiError(
      400,
      "Course outcome does not belong to this form's course"
    );
  }

  if (type === "mcq" && (!options || options.length < 2)) {
    throw new ApiError(400, "MCQ questions require at least 2 options");
  }

  const question = await Question.create({
    form,
    text: text.trim(),
    type,
    options: type === "mcq" ? options : [],
    co,
    weightage,
  });

  await logActivity({
    user: req.user._id,
    action: "QUESTION_CREATED",
    metadata: {
      questionId: question._id,
      form,
      co,
      type,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, question, "Question added successfully"));
});
