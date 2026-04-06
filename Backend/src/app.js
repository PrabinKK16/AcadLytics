import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import passport from "./utils/passport.js";
import authRoutes from "./routes/auth.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notificaions", notificationRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

app.use(errorHandler);

export default app;
