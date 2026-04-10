import mongoose from "mongoose";

const analyticsSnapshotSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    averageScore: {
      type: Number,
      required: true,
    },
    totalSubmissions: {
      type: Number,
      required: true,
    },
    coAttainment: [
      {
        coCode: String,
        description: String,
        percentage: Number,
        level: String,
      },
    ],
  },
  { timestamps: true }
);

analyticsSnapshotSchema.index({
  course: 1,
  faculty: 1,
  semester: 1,
});

const AnalyticsSnapshot = mongoose.model(
  "AnalyticsSnapshot",
  analyticsSnapshotSchema
);
export default AnalyticsSnapshot;
