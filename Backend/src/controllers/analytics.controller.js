import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import FeedbackSubmission from "../models/feedbackSubmission.model.js";
import Response from "../models/response.model.js";
import Course from "../models/course.model.js";

export const getCourseAnalyticsData = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;

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
    populate: {
      path: "co",
      select: "code description",
    },
  });

  if (!responses.length) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalSubmissions: submissions.length,
          averageScore: 0,
          coAttainment: [],
        },
        "No feedback responses found"
      )
    );
  }

  let totalScore = 0;
  let totalRatingResponse = 0;

  const coMap = {};

  for (const response of responses) {
    const question = response.question;

    if (question?.type === "rating" && typeof response.value === "number") {
      totalRatingResponse++;
      totalScore += response.value;

      const coCode = question.co.code;

      if (!coMap[coCode]) {
        coMap[coCode] = {
          score: 0,
          count: 0,
          description: question.co.description,
        };
      }

      coMap[coCode].score += response.value * (question.weightage || 1);
      coMap[coCode].count += question.weightage || 1;
    }
  }

  const averageScore = totalRatingResponse
    ? Number((totalScore / totalRatingResponse).toFixed(2))
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

  return res.status(200).json(
    new ApiResponse(200, {
      course: {
        id: course._id,
        name: course.name,
        code: course.code,
        semester: course.semester,
      },
      totalSubmissions: submissions.length,
      averageScore,
      coAttainment,
    })
  );
});

export const exportCourseAnalyticsCSV = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const analyticsData = await getCourseAnalyticsData(courseId);

  const rows = [
    ["CO Code", "Description", "Percentage", "Level"],
    ...analyticsData.coAttainment.map((co) => [
      co.coCode,
      co.description,
      co.percentage,
      co.level,
    ]),
  ];

  const csvContent = rows.map((row) => row.join(",")).join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=course-${courseId}-analytics.csv`
  );

  return res.send(csvContent);
});
