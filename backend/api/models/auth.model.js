"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const authSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
exports.AuthModel = mongoose_1.default.model("authModel", authSchema);
//# sourceMappingURL=auth.model.js.map