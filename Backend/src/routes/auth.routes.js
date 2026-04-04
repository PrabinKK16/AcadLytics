import {
  login,
  signup,
  logout,
  getCurrentUser,
  refreshAccessToken,
  googleCallback,
} from "../controllers/auth.controller.js";
import { Router } from "express";
import { verifyJWT } from "./../middlewares/auth.middleware.js";
import passport from "../utils/passport.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  googleCallback
);

router.get("/me", verifyJWT, getCurrentUser);
router.post("/logout", verifyJWT, logout);

export default router;
