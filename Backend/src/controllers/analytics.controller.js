import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import AnalyticsSnapshot from "../models/analyticsSnapshot.model.js";
import Course from "../models/course.model.js";
import { buildCourseAnalytics } from "../utils/analytics.service.js";
import generateAnalyticsInsights from "../utils/generateAnalyticsInsights.js";

const assertCourseAccess = async (courseId, user) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  if (
    user.role === "faculty" &&
    course.faculty?.toString() !== user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You do not have access to this course's analytics"
    );
  }
  return course;
};

export const getCourseAnalyticsData = AsyncHandler(async (req, res) => {
  const { courseId } = req.params;

  await assertCourseAccess(courseId, req.user);

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

  await assertCourseAccess(courseId, req.user);

  const analyticsData = await buildCourseAnalytics(courseId);

  const escapeCell = (val) => {
    const str = String(val ?? "");
    const sanitized =
      str.startsWith("=") ||
      str.startsWith("+") ||
      str.startsWith("-") ||
      str.startsWith("@")
        ? `\t${str}`
        : str;
    return `"${sanitized.replace(/"/g, '""')}"`;
  };

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
    .map((row) => row.map(escapeCell).join(","))
    .join("\n");

  const courseName = analyticsData.course?.code || courseId;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${courseName}-analytics.csv"`
  );

  return res.send(csvContent);
});

export const getFacultyTrendAnalytics = AsyncHandler(async (req, res) => {
  const { facultyId } = req.params;

  if (req.user.role === "faculty" && req.user._id.toString() !== facultyId) {
    throw new ApiError(403, "Access denied");
  }

  const snapshots = await AnalyticsSnapshot.find({ faculty: facultyId })
    .populate("course", "name code semester")
    .sort({ semester: 1, createdAt: 1 });

  const trend = snapshots.map((snapshot) => ({
    semester: snapshot.semester,
    course: snapshot.course?._id,
    courseCode: snapshot.course?.code,
    courseName: snapshot.course?.name,
    averageScore: snapshot.averageScore,
    totalSubmissions: snapshot.totalSubmissions,
    highCOs: snapshot.coAttainment.filter((co) => co.level === "High").length,
    mediumCOs: snapshot.coAttainment.filter((co) => co.level === "Medium")
      .length,
    lowCOs: snapshot.coAttainment.filter((co) => co.level === "Low").length,
    coAttainment: snapshot.coAttainment,
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

export const getAdminOverview = AsyncHandler(async (req, res) => {
  const snapshots = await AnalyticsSnapshot.find({})
    .populate("course", "name code semester")
    .populate("faculty", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, snapshots, "Admin analytics overview fetched"));
});
