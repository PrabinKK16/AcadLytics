import AsyncHandler from "../utils/AsyncHandler.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import { generateRefreshToken } from "../utils/generateRefreshToken.js";
import jwt from "jsonwebtoken";
import { validateEmail } from "../utils/ValidateEmail.js";
import sendEmail from "../utils/sendEmail.js";
import logActivity from "./../utils/logActivity.js";
3;
import Notification from "../models/notification.model.js";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const signup = AsyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const normalizedEmail = email?.toLowerCase().trim();

  if (!name || !normalizedEmail || !password || !role) {
    throw new ApiError(400, "All fields are required");
  }

  if (!validateEmail(normalizedEmail)) {
    throw new ApiError(400, "Email is invalid");
  }

  const allowedRoles = ["student", "faculty", "admin"];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  await sendEmail({
    to: createdUser.email,
    subject: "Welcome to AcadLytics",
    html: `
    <h2>Welcome ${createdUser.name}</h2>
    <p>Your account has been created successfully</p>
    <p>Start submitting feedback and tracking CO attainment</p>
    `,
  });

  await Notification.create({
    recipient: createdUser._id,
    type: "system",
    message: "Welcome to AcadLytics🎉🎉",
  });

  await logActivity({
    user: createdUser._id,
    action: "USER_SIGNUP",
    metadata: {
      email: createdUser.email,
      role: createdUser.role,
    },
  });

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions())
    .cookie("refreshToken", refreshToken, cookieOptions())
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email?.toLowerCase().trim();

  if (!normalizedEmail || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  if (!validateEmail(normalizedEmail)) {
    throw new ApiError(400, "Email is invalid");
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.password) {
    throw new ApiError(
      400,
      "This account uses Google login. Please continue with Google"
    );
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  await Notification.create({
    recipient: loggedInUser._id,
    type: "system",
    message: "Login successful",
  });

  await logActivity({
    user: loggedInUser._id,
    action: "USER_LOGIN",
  });

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions())
    .cookie("refreshToken", refreshToken, cookieOptions())
    .json(new ApiResponse(200, loggedInUser, "Login successful"));
});

export const logout = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: {
      refreshToken: 1,
    },
  });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions())
    .clearCookie("refreshToken", cookieOptions())
    .json(new ApiResponse(200, {}, "Logout successful"));
});

export const refreshAccessToken = AsyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, cookieOptions())
    .cookie("refreshToken", newRefreshToken, cookieOptions())
    .json(
      new ApiResponse(
        200,
        {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        "Token refreshed successfully"
      )
    );
});

export const getCurrentUser = AsyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user));
});

export const googleCallback = AsyncHandler(async (req, res) => {
  const user = req.user;

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  await Notification.create({
    recipient: user._id,
    type: "system",
    message: "Google login successful",
  });

  await logActivity({
    user: user._id,
    action: "GOOGLE_LOGIN",
  });

  return res
    .cookie("accessToken", accessToken, cookieOptions())
    .cookie("refreshToken", refreshToken, cookieOptions())
    .redirect(`${process.env.FRONTEND_URL}/dashboard?auth=success`);
});
