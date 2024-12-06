"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ratingsSchema = new mongoose_1.default.Schema({
    productId: { type: String, required: true },
    reviews: [
        {
            userId: { type: String, required: true },
            rating: { type: Number, required: true },
            feedback: String,
        },
    ],
}, { timestamps: true });
exports.RatingsModel = mongoose_1.default.model("ratingsModel", ratingsSchema);
