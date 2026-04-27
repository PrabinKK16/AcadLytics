import {
  login,
  signup,
  logout,
  getCurrentUser,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import { Router } from "express";
import { verifyJWT } from "./../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);

router.get("/me", verifyJWT, getCurrentUser);
router.post("/logout", verifyJWT, logout);

export default router;
