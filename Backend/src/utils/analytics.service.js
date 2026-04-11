import ApiError from "./ApiError.js";
import Course from '../models/course.model.js'
import FeedbackSubmission from "../models/feedbackSubmission.model.js";
import Response from "../models/response.model.js";
import AnalyticsSnapshot from "../models/analyticsSnapshot.model.js";

export const buildCourseAnalytics = async (courseId) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const submissions = await FeedbackSubmission.find({ course: courseId });
  const submissionIds = submissions.map((s) => s._id);

  const responses = await Response.find({
    submission: { $in: submissionIds },
  }).populate({
    path: "question",
    populate: { path: "co", select: "code description" },
  });

  if (!responses.length) {
    const emptyData = {
      course: {
        id: course._id,
        name: course.name,
        code: course.code,
        semester: course.semester,
      },
      totalSubmissions: submissions.length,
      averageScore: 0,
      coAttainment: [],
    };

    await AnalyticsSnapshot.findOneAndUpdate(
      {
        course: course._id,
        faculty: course.faculty,
        semester: course.semester,
      },
      {
        averageScore: 0,
        totalSubmissions: submissions.length,
        coAttainment: [],
      },
      {
        upsert: true,
        new: true,
      }
    );

    return emptyData;
  }

  let totalScore = 0;
  let totalRatingResponses = 0;
  const coMap = {};

  for (const response of responses) {
    const question = response.question;

    if (question?.type === "rating" && typeof response.value === "number") {
      totalRatingResponses++;
      totalScore += response.value;

      const coCode = question.co.code;

      if (!coMap[coCode]) {
        coMap[coCode] = {
          score: 0,
          count: 0,
          description: question.co.description,
        };
      }

      const weight = question.weightage || 1;
      coMap[coCode].score += response.value * weight;
      coMap[coCode].count += weight;
    }
  }

  const averageScore = totalRatingResponses
    ? Number((totalScore / totalRatingResponses).toFixed(2))
    : 0;

  const coAttainment = Object.entries(coMap).map(([coCode, value]) => {
    const percentage = Number(
      ((value.score / (value.count * 5)) * 100).toFixed(2)
    );

    let level = "Low";
    if (percentage >= 70) level = "High";
    else if (percentage >= 40) level = "Medium";

    return {
      coCode,
      description: value.description,
      percentage,
      level,
    };
  });

  await AnalyticsSnapshot.findOneAndUpdate(
    { course: course._id, faculty: course.faculty, semester: course.semester },
    { averageScore, totalSubmissions: submissions.length, coAttainment },
    { upsert: true, new: true }
  );

  return {
    course: {
      id: course._id,
      name: course.name,
      code: course.code,
      semester: course.semester,
    },
    totalSubmissions: submissions.length,
    averageScore,
    coAttainment,
  };
};
