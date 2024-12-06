import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv();

export const connectDB = async () => {
    try {
        if (process.env.MONGODB_URI) {
            mongoose.connect(process.env.MONGODB_URI);
            console.log("DB Connected");
        }
    } catch (e) {
        console.log(e);
    }
};
