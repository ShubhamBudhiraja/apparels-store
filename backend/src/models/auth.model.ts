import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
            // select: false, // to hide the password from the response
        },
        otp: String,
        otpExpiry: { type: Date, default: Date.now, expires: "10m" },
        isVerified: { type: Boolean, default: false },
        refreshTokenHash: String,
        refreshTokenExpiresAt: Date,

        tokenVersion: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

export const AuthModel = mongoose.model("authModel", authSchema);
