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

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name.trim(),
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated"));
});

export const updateAvatar = AsyncHandler(async (req, res) => {
  const localFilePath = req.file?.localFilePath;

  if (!localFilePath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.findById(req.user._id);

  const uploadResult = await uploadOnCloudinary(localFilePath);

  if (user.avatar && user.avatar.includes("res.cloudinary.com")) {
    const publicId = user.avatar.split("/").slice(-2).join("/").split(".")[0];

    await deleteFromCloudinary(publicId);
  }

  user.avatar = uploadResult.secure_url;
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

  if (user.avatar && user.avatar.includes("res.cloudinary.com")) {
    const publicId = user.avatar.split("/").slice(-2).join("/").split(".")[0];

    await deleteFromCloudinary(publicId);
  }

  user.avatar = null;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Avatar removed"));
});

export const changePassword = AsyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "All password fields required");
  }

  const user = await User.findById(req.user._id);

  const isValid = await user.isPasswordCorrect(oldPassword);

  if (!isValid) {
    throw new ApiError(401, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Password changed"));
});
