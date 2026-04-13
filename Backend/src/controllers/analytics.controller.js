import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import AnalyticsSnapshot from "../models/analyticsSnapshot.model.js";
import { buildCourseAnalytics } from "../utils/analytics.service.js";
import generateAnalyticsInsights from "../utils/generateAnalyticsInsights.js";

export const getCourseAnalyticsData = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const analyticsData = await buildCourseAnalytics(courseId);

  const insights = generateAnalyticsInsights(analyticsData);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...analyticsData,
        insights,
      },
      "Course analytics fetched successfully"
    )
  );
});

export const exportCourseAnalyticsCSV = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const analyticsData = await buildCourseAnalytics(courseId);

  const rows = [
    ["CO Code", "Description", "Percentage", "Level"],
    ...analyticsData.coAttainment.map((co) => [
      co.coCode,
      co.description,
      co.percentage,
      co.level,
    ]),
  ];

  const csvContent = rows
    .map((row) => row.map((item) => `"${item}"`).join(","))
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=course-${courseId}-analytics.csv`
  );

  return res.send(csvContent);
});

export const getFacultyTrendAnalytics = AsyncHandler(async (req, res) => {
  const { facultyId } = req.params;

  const snapshots = await AnalyticsSnapshot.find({ faculty: facultyId })
    .populate("course", "name code semester")
    .sort({ semester: 1, createdAt: 1 });

  const trend = snapshots.map((snapshot) => ({
    semester: snapshot.semester,
    course: snapshot.course?._id,
    courseCode: snapshot.course?.code,
    averageScore: snapshot.averageScore,
    totalSubmissions: snapshot.totalSubmissions,
    highCOs: snapshot.coAttainment.filter((co) => co.level === "High").length,
    mediumCOs: snapshot.coAttainment.filter((co) => co.level === "Medium")
      .length,
    lowCOs: snapshot.coAttainment.filter((co) => co.level === "Low").length,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        trend,
        "Faculty trend analytics fetched successfully"
      )
    );
});
