import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  updateProfile,
  updateAvatar,
  removeAvatar,
  changePassword,
  getAllFaculty,
} from "../controllers/profile.controller.js";
import authorizeRoles from "./../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJWT);

router.patch("/", updateProfile);
router.patch("/avatar", upload.single("avatar"), updateAvatar);
router.delete("/avatar", removeAvatar);
router.patch("/change-password", changePassword);
router.get("/all-faculty", authorizeRoles("admin"), getAllFaculty);

export default router;
