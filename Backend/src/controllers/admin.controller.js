import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import FeedbackForm from "../models/feedbackForm.model.js";
import FeedbackSubmission from "../models/feedbackSubmission.model.js";
import Response from "../models/response.model.js";
import Question from "../models/question.model.js";
import CourseOutcome from "../models/courseOutcome.model.js";
import Notification from "../models/notification.model.js";
import Enrollment from "../models/enrollment.model.js";
import logActivity from "../utils/logActivity.js";
import mongoose from "mongoose";

export const createCourse = AsyncHandler(async (req, res) => {
  const { name, code, faculty } = req.body;
  const semester = parseInt(req.body.semester, 10);

  if (!name?.trim() || !code?.trim() || !faculty) {
    throw new ApiError(400, "Name, code and faculty are required");
  }

  if (!Number.isInteger(semester) || semester < 1 || semester > 12) {
    throw new ApiError(400, "Semester must be a whole number between 1 and 12");
  }

  const existingCourse = await Course.findOne({
    code: code.toUpperCase().trim(),
  });

  if (existingCourse) {
    throw new ApiError(409, "Course code already exists");
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
    message: `You have been assigned to teach ${course.code} — ${course.name}`,
  });

  await logActivity({
    user: req.user._id,
    action: "COURSE_CREATED",
    metadata: { courseId: course._id, code: course.code },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course created successfully"));
});

export const createFeedbackForm = AsyncHandler(async (req, res) => {
  const { title, course, deadline } = req.body;

  if (!title?.trim() || !course) {
    throw new ApiError(400, "Title and course are required");
  }

  const existingCourse = await Course.findById(course);
  if (!existingCourse) {
    throw new ApiError(404, "Course not found");
  }

  const existingForm = await FeedbackForm.findOne({ course, isActive: true });
  if (existingForm) {
    throw new ApiError(
      409,
      "An active feedback form already exists for this course"
    );
  }

  if (deadline && new Date(deadline) <= new Date()) {
    throw new ApiError(400, "Deadline must be in the future");
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
    metadata: { formId: form._id, course },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, form, "Feedback form created successfully"));
});

export const deactivateFeedbackForm = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const form = await FeedbackForm.findById(id);
  if (!form) {
    throw new ApiError(404, "Feedback form not found");
  }

  form.isActive = false;
  await form.save({ validateBeforeSave: false });

  await logActivity({
    user: req.user._id,
    action: "FEEDBACK_FORM_DEACTIVATED",
    metadata: { formId: id },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Feedback form deactivated"));
});

export const addQuestionToForm = AsyncHandler(async (req, res) => {
  const { form, text, type, options, co, weightage = 1 } = req.body;

  if (!form || !text?.trim() || !type || !co) {
    throw new ApiError(400, "Form, text, type and course outcome are required");
  }

  const allowedTypes = ["rating", "mcq", "text"];
  if (!allowedTypes.includes(type)) {
    throw new ApiError(400, "Invalid question type");
  }

  const parsedWeightage = Number(weightage);
  if (isNaN(parsedWeightage) || parsedWeightage <= 0 || parsedWeightage > 10) {
    throw new ApiError(400, "Weightage must be between 1 and 10");
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

  if (type === "mcq") {
    if (!Array.isArray(options) || options.length < 2) {
      throw new ApiError(400, "MCQ questions require at least 2 options");
    }
    if (options.length > 10) {
      throw new ApiError(400, "MCQ questions can have at most 10 options");
    }
  }

  const question = await Question.create({
    form,
    text: text.trim(),
    type,
    options: type === "mcq" ? options.map((o) => String(o).trim()) : [],
    co,
    weightage: parsedWeightage,
  });

  await logActivity({
    user: req.user._id,
    action: "QUESTION_CREATED",
    metadata: { questionId: question._id, form, co, type },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, question, "Question added successfully"));
});

export const deleteQuestion = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const question = await Question.findById(id).populate("form");
  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  if (!question.form?.isActive) {
    throw new ApiError(400, "Cannot delete question from inactive form");
  }

  await Question.findByIdAndDelete(id);

  await logActivity({
    user: req.user._id,
    action: "QUESTION_DELETED",
    metadata: { questionId: id },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Question deleted successfully"));
});

export const getAllSubjects = AsyncHandler(async (req, res) => {
  const subjects = await Course.find({})
    .populate("faculty", "name email avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, subjects, "Subjects fetched successfully"));
});

export const deleteSubject = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) {
    throw new ApiError(404, "Subject not found");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const forms = await FeedbackForm.find({ course: id }).session(session);
    const formIds = forms.map((f) => f._id);

    if (formIds.length > 0) {
      const submissionIds = await FeedbackSubmission.find({
        form: { $in: formIds },
      })
        .distinct("_id")
        .session(session);

      await Response.deleteMany(
        { submission: { $in: submissionIds } },
        { session }
      );
      await FeedbackSubmission.deleteMany(
        { form: { $in: formIds } },
        { session }
      );
      await Question.deleteMany({ form: { $in: formIds } }, { session });
      await FeedbackForm.deleteMany({ course: id }, { session });
    }

    await CourseOutcome.deleteMany({ course: id }, { session });
    await Enrollment.deleteMany({ course: id }, { session });
    await Course.findByIdAndDelete(id, { session });

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  if (course.faculty) {
    await Notification.create({
      recipient: course.faculty,
      type: "system",
      message: `Subject ${course.code} — ${course.name} has been removed by admin`,
    });
  }

  await logActivity({
    user: req.user._id,
    action: "SUBJECT_DELETED",
    metadata: { courseId: id, code: course.code, name: course.name },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subject deleted successfully"));
});

export const createCourseOutcome = AsyncHandler(async (req, res) => {
  const { course, code, description } = req.body;

  if (!course || !code?.trim() || !description?.trim()) {
    throw new ApiError(400, "Course, CO code, and description are required");
  }

  const existingCourse = await Course.findById(course);
  if (!existingCourse) {
    throw new ApiError(404, "Course not found");
  }

  const existing = await CourseOutcome.findOne({
    course,
    code: code.trim().toUpperCase(),
  });
  if (existing) {
    throw new ApiError(409, `CO ${code} already exists for this course`);
  }

  const co = await CourseOutcome.create({
    course,
    code: code.trim().toUpperCase(),
    description: description.trim(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, co, "Course outcome created successfully"));
});

export const getCourseOutcomes = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const cos = await CourseOutcome.find({ course: courseId }).sort({ code: 1 });
  return res
    .status(200)
    .json(new ApiResponse(200, cos, "Course outcomes fetched successfully"));
});

export const deleteCourseOutcome = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const co = await CourseOutcome.findByIdAndDelete(id);
  if (!co) {
    throw new ApiError(404, "Course outcome not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Course outcome deleted successfully"));
});

export const enrollStudents = AsyncHandler(async (req, res) => {
  const { courseId, studentIds } = req.body;

  if (!courseId || !Array.isArray(studentIds) || studentIds.length === 0) {
    throw new ApiError(400, "courseId and studentIds array are required");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const students = await User.find({
    _id: { $in: studentIds },
    role: "student",
  });

  if (students.length !== studentIds.length) {
    throw new ApiError(400, "One or more student IDs are invalid");
  }

  const results = await Promise.allSettled(
    studentIds.map((s) =>
      Enrollment.updateOne(
        { student: s, course: courseId },
        { student: s, course: courseId },
        { upsert: true }
      )
    )
  );

  const enrolled = results.filter((r) => r.status === "fulfilled").length;

  await logActivity({
    user: req.user._id,
    action: "STUDENTS_ENROLLED",
    metadata: { courseId, enrolled },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { enrolled },
        `${enrolled} student(s) enrolled successfully`
      )
    );
});

export const getAllStudents = AsyncHandler(async (req, res) => {
  const students = await User.find({ role: "student" })
    .select("_id name email avatar createdAt")
    .sort({ name: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students fetched successfully"));
});
