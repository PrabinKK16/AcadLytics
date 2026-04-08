import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeedbackSubmission",
      index: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    value: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

responseSchema.index({ submission: 1, question: 1 });

const Response = mongoose.model("Response", responseSchema);
export default Response;
