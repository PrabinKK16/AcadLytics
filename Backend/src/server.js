import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("Error: ", error);
      throw error;
    });

    app.listen(port, () => {
      console.log(`App is running on PORT: ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed");
  });
