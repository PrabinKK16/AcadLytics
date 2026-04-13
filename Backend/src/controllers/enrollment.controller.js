import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import Enrollment from "../models/enrollment.model.js";

export const getMyEnrolledCourses = AsyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({
    student: req.user._id,
  }).populate("course", "name code semester");

  const courses = enrollments.map((item) => item.course);

  return res
    .status(200)
    .json(
      new ApiResponse(200, courses, "Enrolled courses fetched successfully")
    );
});
