import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  updateProfile,
  updateAvatar,
  removeAvatar,
  changePassword,
} from "../controllers/profile.controller.js";

const router = Router();

router.use(verifyJWT);

router.patch("/", updateProfile);
router.patch("/avatar", upload.single("avatar"), updateAvatar);
router.delete("/avatar", removeAvatar);
router.patch("/change-password", changePassword);

export default router;
