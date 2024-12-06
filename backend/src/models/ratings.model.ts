import mongoose from "mongoose";

const ratingsSchema = new mongoose.Schema(
    {
        productId: { type: String, required: true },
        reviews: [
            {
                userId: { type: String, required: true },
                rating: { type: Number, required: true },
                feedback: String,
            },
        ],
    },
    { timestamps: true }
);

export const RatingsModel = mongoose.model("ratingsModel", ratingsSchema);
