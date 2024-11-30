const { default: mongoose } = require("mongoose");

const ordersSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    orders: [
        {
            orderId: { type: String, required: true },
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
        },
    ],
});

const OrdersModel = mongoose.model("ordersModel", ordersSchema);
module.exports = OrdersModel;
