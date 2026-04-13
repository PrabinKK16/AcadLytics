import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/index.js";
import startSchedulers from "./utils/scheduler.js";

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    startSchedulers();

    app.on("error", (error) => {
      console.error("Error:", error);
      throw error;
    });

    app.listen(port, () => {
      console.log(`App is running on PORT: ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed", error);
  });
