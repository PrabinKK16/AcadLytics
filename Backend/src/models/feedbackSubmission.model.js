import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeedbackForm",
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

submissionSchema.index({ student: 1, form: 1 }, { unique: true });

const FeedbackSubmission = mongoose.model(
  "FeedbackSubmission",
  submissionSchema
);
export default FeedbackSubmission;
