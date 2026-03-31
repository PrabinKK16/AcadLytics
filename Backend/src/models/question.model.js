import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeedbackForm",
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["rating", "mcq", "text"],
      required: true,
    },
    options: [String],
    co: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseOutcome",
      required: true,
    },
    weightage: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;
