import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        otp: String,
        isVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const AuthModel = mongoose.model("authModel", authSchema);
