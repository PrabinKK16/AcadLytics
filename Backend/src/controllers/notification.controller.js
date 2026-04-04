import Notification from "./../models/notification.model.js";
import AsyncHandler from "./../utils/AsyncHandler.js";
import ApiError from "./../utils/ApiError.js";
import ApiResponse from "./../utils/ApiResponse.js";

export const getMyNotifications = AsyncHandler(async (req, res) => {
  const notifications = (
    await Notification.find({ recipient: req.user._id })
  ).toSorted({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, notifications, "Notifications fetched successfully")
    );
});

export const getUnreadCount = AsyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  return res.status(200).json(new ApiResponse(200, { count }));
});

export const markNotificationAsRead = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndUpdate(
    {
      _id: id,
      recipient: req.user._id,
    },
    {
      isRead: true,
    },
    {
      new: true,
    }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});

export const deleteNotification = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndDelete({
    _id: id,
    recipient: req.user._id,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Notification deleted successfully"));
});
