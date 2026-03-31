import mongoose from "mongoose";

const feedbackFormSchema = new mongoose.Schema(
  {
    title: String,
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deadline: Date,
  },
  { timestamps: true }
);

const FeedbackForm = mongoose.model("FeedbackForm", feedbackFormSchema);
export default FeedbackForm;
