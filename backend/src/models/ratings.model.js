const { default: mongoose } = require("mongoose");

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

const RatingsModel = mongoose.model("ratingsModel", ratingsSchema);
module.exports = RatingsModel;
