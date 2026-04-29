import AsyncHandler from "../utils/AsyncHandler.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import { generateRefreshToken } from "../utils/generateRefreshToken.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import logActivity from "./../utils/logActivity.js";
import Notification from "../models/notification.model.js";
import crypto from "crypto";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const signup = AsyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  let user;

  try {
    user = await User.create({
      name,
      email,
      password,
      role,
      verifyToken: hashedToken,
      verifyTokenExpiry,
      isVerified: false,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Email already exists");
    }
    throw error;
  }

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -verifyToken -verifyTokenExpiry"
  );

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;

  sendEmail({
    to: createdUser.email,
    subject: "Verify your AcadLytics account",
    html: `
      <h2>Welcome to AcadLytics, ${createdUser.name}!</h2>
      <p>Please verify your email address to activate your account.</p>
      <a href="${verifyUrl}" style="
        display:inline-block;padding:12px 24px;
        background:#4f46e5;color:white;
        text-decoration:none;border-radius:6px;margin:16px 0;
      ">Verify Email</a>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create this account, you can ignore this email.</p>
    `,
  }).catch(console.error);

  await Notification.create({
    recipient: createdUser._id,
    type: "system",
    message:
      "Welcome to AcadLytics! Please verify your email to get started 🎉",
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
    .json(
      new ApiResponse(
        201,
        createdUser,
        "Account created! Please check your email to verify your account."
      )
    );
});

export const verifyEmail = AsyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new ApiError(400, "Verification token is required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    verifyToken: hashedToken,
    verifyTokenExpiry: { $gt: new Date() },
  }).select("+verifyToken +verifyTokenExpiry");

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification link");
  }

  user.isVerified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  await logActivity({
    user: user._id,
    action: "EMAIL_VERIFIED",
    metadata: { email: user.email },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Email verified successfully. You can now log in."
      )
    );
});

export const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    await logActivity({
      action: "FAILED_LOGIN",
      metadata: { email },
    });
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Email not verified. Please check your inbox.");
  }

  if (user.lockUntil && user.lockUntil < Date.now()) {
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lockCount = 0;
    await user.save({ validateBeforeSave: false });
  }

  if (user.lockUntil && user.lockUntil > Date.now()) {
    throw new ApiError(
      423,
      "Account locked due to multiple failed attempts. Try again after 15 minutes or reset your password."
    );
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    user.loginAttempts += 1;

    if (user.loginAttempts >= 5) {
      user.lockCount += 1;

      const lockDurations = [
        15 * 60 * 1000,
        30 * 60 * 1000,
        60 * 60 * 1000,
        24 * 60 * 60 * 1000,
      ];

      const index = Math.min(user.lockCount - 1, lockDurations.length - 1);
      user.lockUntil = new Date(Date.now() + lockDurations[index]);

      user.loginAttempts = 0;
    }

    await user.save({ validateBeforeSave: false });

    await logActivity({
      user: user?._id,
      action: "FAILED_LOGIN",
      metadata: { email },
    });
    throw new ApiError(401, "Invalid credentials");
  }

  const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");

  user.otp = hashedOtp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  user.otpAttempts = 0;

  await user.save({ validateBeforeSave: false });

  sendEmail({
    to: user.email,
    subject: "Your Login OTP",
    html: `<h2>Your OTP is: ${rawOtp}</h2><p>Valid for 5 minutes</p>`,
  }).catch(console.error);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent to your email"));
});

export const verifyOTP = AsyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email }).select(
    "+otp +otpExpiry +refreshToken"
  );

  if (!user || !user.otp || user.otpExpiry < Date.now()) {
    if (user) {
      user.otpAttempts = 0;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save({ validateBeforeSave: false });
    }
    throw new ApiError(400, "Invalid or expired OTP");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Email not verified. Please check your inbox.");
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  if (hashedOtp !== user.otp) {
    user.otpAttempts += 1;

    if (user.otpAttempts >= 5) {
      user.otp = undefined;
      user.otpExpiry = undefined;

      user.lockCount += 1;

      const lockDurations = [
        15 * 60 * 1000,
        30 * 60 * 1000,
        60 * 60 * 1000,
        24 * 60 * 60 * 1000,
      ];

      const index = Math.min(user.lockCount - 1, lockDurations.length - 1);
      user.lockUntil = new Date(Date.now() + lockDurations[index]);
    }

    await user.save({ validateBeforeSave: false });

    throw new ApiError(400, "Invalid OTP");
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  user.otpAttempts = 0;

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  await logActivity({
    user: user._id,
    action: "USER_LOGIN",
  });

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -verifyToken -verifyTokenExpiry -resetPasswordToken -resetPasswordExpiry"
  );

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

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decodedToken?._id).select("+refreshToken");

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid or expired refresh token");
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
        },
        "Token refreshed successfully"
      )
    );
});

export const forgotPassword = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "If that email exists, a reset link has been sent"
        )
      );
  }

  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  sendEmail({
    to: user.email,
    subject: "Reset your AcadLytics password",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your AcadLytics account.</p>
      <a href="${resetUrl}" style="
        display:inline-block;padding:12px 24px;
        background:#4f46e5;color:white;
        text-decoration:none;border-radius:6px;margin:16px 0;
      ">Reset Password</a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, safely ignore this email.</p>
    `,
  }).catch(console.error);

  await logActivity({
    user: user._id,
    action: "PASSWORD_RESET_REQUESTED",
    metadata: { email: user.email },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "If that email exists, a reset link has been sent"
      )
    );
});

export const resetPassword = AsyncHandler(async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  if (!token) {
    throw new ApiError(400, "Reset token is required");
  }

  if (!password || password.length < 8) {
    throw new ApiError(400, "Password must be atleast 8 characters");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: new Date() },
  }).select("+resetPasswordToken +resetPasswordExpiry");

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset link");
  }

  user.isVerified = true;
  user.password = password;
  user.refreshToken = undefined;
  user.resetPasswordExpiry = undefined;
  user.resetPasswordToken = undefined;
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  await logActivity({
    user: user._id,
    action: "PASSWORD_RESET_COMPLETED",
    metadata: { email: user.email },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Password reset successful. Please log in.")
    );
});

export const getCurrentUser = AsyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user));
});
