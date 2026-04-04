import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import FeedbackForm from "../models/feedbackForm.model.js";
import Notification from "../models/notification.model.js";
import Question from "../models/question.model.js";
import FeedbackSubmission from "../models/feedbackSubmission.model.js";
import Response from "../models/response.model.js";
import logActivity from "../utils/logActivity.js";

export const getActiveFeedbackForm = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const form = await FeedbackForm.findOne({
    course: courseId,
    isActive: true,
  });

  if (!form) {
    throw new ApiError(404, "No active feedback form found");
  }

  const questions = await Question.find({
    form: form._id,
  }).populate("co", "code description");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { form, questions },
        "Active feedback form fetched successfully"
      )
    );
});

export const submitFeedback = AsyncHandler(async (req, res) => {
  const { formId, courseId, responses } = req.body;

  if (!formId || !courseId || !responses?.length) {
    throw new ApiError(400, "Form, course and responses are required");
  }

  const form = await FeedbackForm.findById(formId);

  if (!form || !form.isActive) {
    throw new ApiError(404, "Feedback form is inactive or missing");
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

  const submission = await FeedbackSubmission.create({
    student: req.user._id,
    form: formId,
    course: courseId,
  });

  const responseDocs = responses.map((response) => ({
    submission: submission._id,
    question: response.questionId,
    value: response.value,
  }));

  await Response.insertMany(responseDocs);

  await Notification.create({
    recipient: req.user._id,
    type: "feedback",
    message: "Feedback submitted successfully",
  });

  await logActivity({
    user: req.user._id,
    action: "FEEDBACK_SUBMITTED",
    metadata: {
      formId,
      courseId,
      totalResponses: responses.length,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, submission, "Feedback submitted successfully"));
});
