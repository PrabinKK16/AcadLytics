import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  updateProfile,
  updateAvatar,
  removeAvatar,
  changePassword,
  getAllFaculty,
} from "../controllers/profile.controller.js";
import upload from "../middlewares/multer.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { changePasswordSchema } from "../schemas/auth.schema.js";

const router = Router();

router.use(verifyJWT);

router.patch("/", updateProfile);
router.post("/avatar", upload.single("avatar"), updateAvatar);
router.delete("/avatar", removeAvatar);
router.patch(
  "/change-password",
  validate(changePasswordSchema),
  changePassword
);
router.get("/faculty", getAllFaculty);

export default router;
