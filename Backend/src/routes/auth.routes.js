import {
  login,
  signup,
  logout,
  getCurrentUser,
  refreshAccessToken,
  verifyEmail,
  resetPassword,
  forgotPassword,
  verifyOTP,
} from "../controllers/auth.controller.js";
import { Router } from "express";
import { verifyJWT } from "./../middlewares/auth.middleware.js";
import {
  loginLimiter,
  signupLimiter,
  emailLimiter,
} from "../middlewares/ratelimiter.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  signupSchema,
  loginSchema,
  otpSchema,
} from "../schemas/auth.schema.js";

const router = Router();

router.post("/signup", signupLimiter, validate(signupSchema), signup);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/refresh-token", refreshAccessToken);

router.get("/verify-email", verifyEmail);

router.post("/forgot-password", emailLimiter, forgotPassword);
router.post("/reset-password", emailLimiter, resetPassword);

router.get("/me", verifyJWT, getCurrentUser);
router.post("/logout", verifyJWT, logout);

router.post("/verify-otp", loginLimiter, validate(otpSchema), verifyOTP);

export default router;
