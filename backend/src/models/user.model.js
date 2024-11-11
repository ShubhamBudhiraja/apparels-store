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
                isAvailable: { type: Boolean, default: true },
                inWishlist: { type: Boolean, default: false },
            },
        ],
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
            isAvailable: { type: Boolean, default: true },
            inCart: { type: Boolean, default: false },
        },
    ],
});

const UserModel = mongoose.model("userModel", userSchema);
module.exports = UserModel;
