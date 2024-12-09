"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    firstName: String,
    lastName: String,
    dob: Date,
    addresses: [
        {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            mobileNo: { type: String, required: true },
            houseNo: { type: String, required: true },
            streetAddress: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: String, required: true },
            state: { type: String, required: true },
        },
    ],
    mobileNo: String,
    cart: {
        type: {
            products: {
                type: [
                    {
                        productId: { type: String, required: true },
                        title: { type: String, required: true },
                        price: { type: Number, required: true },
                        offerPrice: Number,
                        quantity: { type: Number, required: true },
                        thumbnail: String,
                        selectedVariant: String,
                        category: { type: String, required: true },
                        discountAmount: { type: Number, default: 0 },
                        segment: { type: String, required: true },
                        isAvailable: { type: Boolean, default: true },
                        inWishlist: { type: Boolean, default: false },
                    },
                ],
                default: [],
            },
            couponDiscount: { type: Number, default: 0 },
            cartTotal: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
            isDeliveryFeeIncluded: { type: Boolean, default: false },
        },
        default: { products: [] },
    },
    wishlist: [
        {
            productId: String,
            title: String,
            price: Number,
            offerPrice: Number,
            thumbnail: String,
            discountPercentage: Number,
        },
    ],
});
exports.UserModel = mongoose_1.default.model("userModel", userSchema);
//# sourceMappingURL=user.model.js.map