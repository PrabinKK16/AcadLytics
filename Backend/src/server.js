import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/index.js";
import startSchedulers from "./utils/scheduler.js";
import mongoose from "mongoose";

const port = process.env.PORT || 10000;

const gracefulShutdown = (signal, server) => {
  console.log(`\n${signal} received — shutting down gracefully`);

  server.close(() => {
    mongoose.connection
      .close(false)
      .then(() => {
        console.log("MongoDB connection closed cleanly");
        process.exit(0);
      })
      .catch((err) => {
        console.error("Error closing MongoDB connection:", err.message);
        process.exit(1);
      });
  });

  setTimeout(() => {
    console.error("Forced shutdown after 10s timeout");
    process.exit(1);
  }, 10_000).unref();
};

connectDB()
  .then(() => {
    startSchedulers();

    const server = app.listen(port, () => {
      console.log(`App is running on PORT: ${port}`);
    });

    server.on("error", (error) => {
      console.error("Server error:", error.message);
      throw error;
    });

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM", server));
    process.on("SIGINT", () => gracefulShutdown("SIGINT", server));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
