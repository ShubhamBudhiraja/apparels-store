const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: String,
    name: String,
    dob: Date,
    addresses: [
        {
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
        discount: { type: Number, default: 0 },
        cartTotal: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
    },
    wishlist: [
        {
            productId: String,
            title: String,
            price: Number,
            offerPrice: Number,
            thumbnail: String,
        },
    ],
});

const UserModel = mongoose.model("userModel", userSchema);
module.exports = UserModel;
