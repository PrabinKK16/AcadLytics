import Notification from "./../models/notification.model.js";
import AsyncHandler from "./../utils/AsyncHandler.js";
import ApiError from "./../utils/ApiError.js";
import ApiResponse from "./../utils/ApiResponse.js";

export const getMyNotifications = AsyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);

  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Notification.countDocuments({
      recipient: req.user._id,
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        notifications,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      },
      "Notifications fetched successfully"
    )
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
