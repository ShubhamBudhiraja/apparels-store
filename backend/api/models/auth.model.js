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
    },
    password: {
        type: String,
        required: true,
    },
    otp: String,
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });
exports.AuthModel = mongoose_1.default.model("authModel", authSchema);
//# sourceMappingURL=auth.model.js.map