const { default: mongoose } = require("mongoose");

const prouctSchema = new mongoose.Schema({
    productId: String,
    title: String,
    description: String,
    shortDescription: String,
    price: Number,
    offerPrice: Number,
    discountPercentage: Number,
    discountAmount: Number,
    units: Number,
    images: [String],
    thumbnail: String,
    ratings: Number,
    ratingsCount: Number,
    category: String,
    subCategory: String,
});

const ProductModel = mongoose.model("productsModel", prouctSchema);
module.exports = ProductModel;
