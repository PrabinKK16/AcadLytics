import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/notification.controller";

const router = Router();

router.use(verifyJWT);

router.get("/", getMyNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/:id/read", markNotificationAsRead);
router.delete("/:id", deleteNotification);
