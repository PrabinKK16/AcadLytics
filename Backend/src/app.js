import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";

const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "http://localhost:4173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);

app.use(errorHandler);

export default app;
