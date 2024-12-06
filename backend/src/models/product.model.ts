import mongoose from "mongoose";

const prouctSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: Number,
    segment: { type: String, required: true },
    category: { type: String, required: true },
    variants: {
        type: [
            {
                id: { type: String, required: true },
                units: { type: Number, required: true },
            },
        ],
        required: true,
    },
    description: String,
    shortDescription: String,
    discountPercentage: Number,
    discountAmount: Number,
    images: [String],
    thumbnail: String,
});

export const ProductModel = mongoose.model("productsModel", prouctSchema);
