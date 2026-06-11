import AsyncHandler from "./../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "./../utils/ApiResponse.js";
import User from "../models/user.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

export const updateProfile = AsyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Name is required");
  }

  if (name.trim().length < 2 || name.trim().length > 60) {
    throw new ApiError(400, "Name must be between 2 and 60 characters");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name.trim(),
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

export const updateAvatar = AsyncHandler(async (req, res) => {
  const localFilePath = req.file?.path;

  if (!localFilePath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.findById(req.user._id);

  if (user.avatarPublicId) {
    deleteFromCloudinary(user.avatarPublicId).catch((e) =>
      console.error("Failed to delete old avatar: ", e.message)
    );
  }

  const uploadResult = await uploadOnCloudinary(localFilePath);

  user.avatar = uploadResult.secure_url;
  user.avatarPublicId = uploadResult.public_id;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { avatar: user.avatar },
        "Avatar updated successfully"
      )
    );
});

export const removeAvatar = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.avatarPublicId) {
    deleteFromCloudinary(user.avatarPublicId).catch((e) =>
      console.error("Failed to delete avatar from Cloudinary:", e.message)
    );
  }

  user.avatar = null;
  user.avatarPublicId = null;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Avatar removed"));
});

export const changePassword = AsyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "All password fields required");
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, "New password must be at least 8 characters");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password must differ from current password");
  }

  const user = await User.findById(req.user._id).select("+password");

  const isValid = await user.isPasswordCorrect(oldPassword);

  if (!isValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  user.refreshToken = undefined;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password changed successfully. Please log in again."
      )
    );
});

export const getAllFaculty = AsyncHandler(async (req, res) => {
  const faculty = await User.find({ role: "faculty" })
    .select("_id name email avatar")
    .sort({ name: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, faculty, "Faculty list fetched successfully"));
});
