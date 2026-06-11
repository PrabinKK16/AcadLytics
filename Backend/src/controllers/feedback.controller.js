import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import FeedbackForm from "../models/feedbackForm.model.js";
import Notification from "../models/notification.model.js";
import Question from "../models/question.model.js";
import FeedbackSubmission from "../models/feedbackSubmission.model.js";
import Response from "../models/response.model.js";
import Enrollment from "../models/enrollment.model.js";
import logActivity from "../utils/logActivity.js";

export const getActiveFeedbackForm = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const form = await FeedbackForm.findOne({ course: courseId, isActive: true });

  if (!form) {
    throw new ApiError(404, "No active feedback form found");
  }

  const [questions, existingSubmission] = await Promise.all([
    Question.find({ form: form._id }).populate("co", "code description"),
    FeedbackSubmission.findOne({ student: req.user._id, form: form._id }),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { form, questions, alreadySubmitted: !!existingSubmission },
        "Active feedback form fetched successfully"
      )
    );
});

export const submitFeedback = AsyncHandler(async (req, res) => {
  const { formId, courseId, responses } = req.body;

  if (
    !formId ||
    !courseId ||
    !Array.isArray(responses) ||
    responses.length === 0
  ) {
    throw new ApiError(400, "Form, course and responses are required");
  }

  const [enrolled, form] = await Promise.all([
    Enrollment.findOne({ student: req.user._id, course: courseId }),
    FeedbackForm.findById(formId),
  ]);

  if (!enrolled) {
    throw new ApiError(403, "You are not enrolled in this course");
  }

  if (!form || !form.isActive) {
    throw new ApiError(404, "Feedback form is inactive or missing");
  }

  if (form.course.toString() !== courseId.toString()) {
    throw new ApiError(400, "Form does not belong to this course");
  }

  if (form.deadline && new Date() > new Date(form.deadline)) {
    throw new ApiError(400, "Feedback deadline has passed");
  }

  const existingSubmission = await FeedbackSubmission.findOne({
    student: req.user._id,
    form: formId,
  });

  if (existingSubmission) {
    throw new ApiError(409, "Feedback already submitted");
  }

  const questions = await Question.find({ form: formId });
  const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

  const validatedResponses = [];

  for (const response of responses) {
    const { questionId, value } = response;

    if (!questionId || value === undefined || value === null) {
      throw new ApiError(400, "Each response must have a questionId and value");
    }

    const question = questionMap.get(questionId.toString());

    if (!question) {
      throw new ApiError(
        400,
        `Question ${questionId} does not belong to this form`
      );
    }

    if (question.type === "rating") {
      const num = Number(value);
      if (!Number.isInteger(num) || num < 1 || num > 5) {
        throw new ApiError(
          400,
          `Rating for question ${questionId} must be between 1 and 5`
        );
      }
      validatedResponses.push({ questionId, value: num });
    } else if (question.type === "mcq") {
      if (!question.options.includes(value)) {
        throw new ApiError(400, `Invalid option for question ${questionId}`);
      }
      validatedResponses.push({ questionId, value });
    } else if (question.type === "text") {
      if (typeof value !== "string" || value.trim().length === 0) {
        throw new ApiError(
          400,
          `Text response for question ${questionId} cannot be empty`
        );
      }
      if (value.length > 2000) {
        throw new ApiError(
          400,
          `Text response for question ${questionId} exceeds 2000 characters`
        );
      }
      validatedResponses.push({ questionId, value: value.trim() });
    }
  }

  const submission = await FeedbackSubmission.create({
    student: req.user._id,
    form: formId,
    course: courseId,
  });

  await Response.insertMany(
    validatedResponses.map((r) => ({
      submission: submission._id,
      question: r.questionId,
      value: r.value,
    }))
  );

  await Notification.create({
    recipient: req.user._id,
    type: "feedback",
    message: `Feedback for "${form.title}" submitted successfully`,
  });

  await logActivity({
    user: req.user._id,
    action: "FEEDBACK_SUBMITTED",
    metadata: { formId, courseId, totalResponses: validatedResponses.length },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Feedback submitted successfully"));
});

export const getSubmissionHistory = AsyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10), 50);
  const skip = (page - 1) * limit;

  const [submissions, total] = await Promise.all([
    FeedbackSubmission.find({ student: req.user._id })
      .populate("form", "title deadline")
      .populate("course", "name code semester")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    FeedbackSubmission.countDocuments({ student: req.user._id }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        submissions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      },
      "Submission history fetched successfully"
    )
  );
});
