const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: String,
    name: String,
    dob: Date,
    addresses: [
        {
            receiverName: String,
            receiverPhone: String,
            houseNo: String,
            city: String,
            pincode: String,
            state: String,
            isDefault: { default: false, type: Boolean },
        },
    ],
    mobileNo: String,
    cart: {
        products: [
            {
                productId: String,
                title: String,
                price: Number,
                offerPrice: Number,
                quantity: Number,
                thumbnail: String,
                selectedVariant: String,
                discountAmount: { type: Number, default: 0 },
                segment: { type: String, required: true },
                isAvailable: { type: Boolean, default: true },
                inWishlist: { type: Boolean, default: false },
            },
        ],
        couponDiscount: { type: Number, default: 0 },
        cartTotal: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        isDeliveryFeeIncluded: { type: Boolean, default: false },
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

const UserModel = mongoose.model("userModel", userSchema);
module.exports = UserModel;
