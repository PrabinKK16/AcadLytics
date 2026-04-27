import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "./models/user.model.js";
import { DB_NAME } from "./constants.js";

await mongoose.connect(`${process.env.MONGODB_URI}/${ DB_NAME }`);
const r = await User.deleteMany({});
console.log("Deleted", r.deletedCount, "users");
await mongoose.disconnect();
