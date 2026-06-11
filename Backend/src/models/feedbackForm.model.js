import mongoose from "mongoose";

const feedbackFormSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deadline: {
      type: Date,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

feedbackFormSchema.index({ course: 1, isActive: 1 });

const FeedbackForm = mongoose.model("FeedbackForm", feedbackFormSchema);
export default FeedbackForm;
