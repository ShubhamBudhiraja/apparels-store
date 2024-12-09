"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const prouctSchema = new mongoose_1.default.Schema({
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
exports.ProductModel = mongoose_1.default.model("productsModel", prouctSchema);
//# sourceMappingURL=product.model.js.map