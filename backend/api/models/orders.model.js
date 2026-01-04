"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ordersSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    orderId: { type: String, required: true, unique: true },
    orderTimeStamp: { type: Date, required: true },
    products: [
        {
            productId: String,
            title: String,
            price: Number,
            offerPrice: Number,
            quantity: Number,
            thumbnail: String,
            selectedVariant: String,
        },
    ],
    couponDiscount: { type: Number, default: 0 },
    cartTotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    isDeliveryFeeIncluded: Boolean,
    address: {
        firstName: String,
        lastName: String,
        mobileNo: String,
        houseNo: String,
        streetAddress: String,
        city: String,
        pincode: String,
        state: String,
    },
    feedback: {
        rating: { type: Number, default: 0 },
        description: { type: String },
    },
});
exports.OrdersModel = mongoose_1.default.model("ordersModel", ordersSchema);
//# sourceMappingURL=orders.model.js.map