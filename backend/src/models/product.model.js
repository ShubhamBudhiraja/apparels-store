const { default: mongoose } = require("mongoose");

const prouctSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    segment: { type: String, required: true },
    category: { type: String, required: true },
    variants: [
        {
            id: { type: String, required: true },
            units: { type: Number, required: true },
        },
    ],
    description: String,
    shortDescription: String,
    offerPrice: Number,
    discountPercentage: Number,
    discountAmount: Number,
    images: [String],
    thumbnail: String,
});

const ProductModel = mongoose.model("productsModel", prouctSchema);
module.exports = ProductModel;
