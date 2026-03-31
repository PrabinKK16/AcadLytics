import mongoose from "mongoose";

const notificationSchema = new mongoose.model(
  {
    recipent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    type: {
      type: String,
      enum: ["feedback", "system", "alert"],
    },
    message: String,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notificaion", notificationSchema);
export default Notification;
