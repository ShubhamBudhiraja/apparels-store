const OrdersModel = require("../models/orders.model");
const ProductModel = require("../models/product.model");
const UserModel = require("../models/user.model");
const commonUtils = require("../utils/common");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const PaymentControllers = () => {
    const { generateCommonResponse } = commonUtils();

    const updateProduct = (productId, variants) => {
        return ProductModel.findOneAndUpdate(
            { productId },
            { $set: { variants } }
        );
    };

    const updateProductInventory = async (allProducts, cartProducts) => {
        const temp = {};

        allProducts.forEach((product) => {
            const prod = product;
            cartProducts.forEach((cartProduct) => {
                const variantIndex = prod.variants.findIndex(
                    (variant) => variant.id === cartProduct.selectedVariant
                );
                if (variantIndex !== -1) {
                    prod.variants[variantIndex].units -= cartProduct.quantity;
                    temp[cartProduct.productId] = prod.variants;
                }
            });
        });

        console.log("updating product inventory");

        const promiseTest = Object.entries(temp).map(([key, value]) =>
            updateProduct(key, value)
        );
        await Promise.allSettled(promiseTest);

        console.log("product inventory updated");
    };

    const createCheckoutSession = async (req, res) => {
        const { userId, products } = req.body;

        try {
            const foundUser = await UserModel.findOne({ userId });

            if (foundUser) {
                const session = await stripe.checkout.sessions.create({
                    line_items: products.map((product) => ({
                        price_data: {
                            currency: "inr",
                            product_data: {
                                name: product.title,
                            },
                            unit_amount: product.price * 100,
                        },
                        quantity: product.quantity,
                    })),
                    mode: "payment",
                    ui_mode: "embedded",
                    redirect_on_completion: "never",
                    customer_email: userId,
                });

                res.status(200).json(
                    generateCommonResponse(2018, true, {
                        clientSecret: session.client_secret,
                    })
                );
            } else {
                console.log("user not found while initiating payment");
                return res.status(400).json(generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while initiating checkout", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const completePayment = async (req, res) => {
        const { userId, addressId } = req.body;

        try {
            const foundUser = await UserModel.findOne({ userId });

            if (foundUser) {
                const existingUser = await OrdersModel.findOne({ userId });
                let orders = existingUser ? existingUser.orders : [];

                const allProducts = await ProductModel.find();

                let allProductsAvailable = true;
                for (
                    let productIndex = 0;
                    productIndex < allProducts.length;
                    productIndex++
                ) {
                    for (
                        let cartProductIndex = 0;
                        cartProductIndex < foundUser.cart.products.length;
                        cartProductIndex++
                    ) {
                        const addedVariant = allProducts[
                            productIndex
                        ].variants.find(
                            (variant) =>
                                variant.id ===
                                foundUser.cart.products[cartProductIndex]
                                    .selectedVariant
                        );
                        if (
                            addedVariant &&
                            addedVariant.units <
                                foundUser.cart.products[cartProductIndex]
                                    .quantity
                        ) {
                            allProductsAvailable = false;
                            break;
                        }
                    }
                    if (!allProductsAvailable) break;
                }

                if (!allProductsAvailable) {
                    console.log("some products went out of stock");

                    return res.status(400).json(generateCommonResponse(4018));
                }
                console.log("all products available");

                updateProductInventory(allProducts, foundUser.cart.products);

                const orderDetails = {
                    orderTimeStamp: new Date(),
                    cartTotal: foundUser.cart.cartTotal,
                    total: foundUser.cart.total,
                    isDeliveryFeeIncluded: foundUser.cart.isDeliveryFeeIncluded,
                    couponDiscount: foundUser.cart.couponDiscount,
                    products: foundUser.cart.products.map((product) => ({
                        productId: product.productId,
                        title: product.title,
                        price: product.price,
                        offerPrice: product.offerPrice,
                        quantity: product.quantity,
                        thumbnail: product.thumbnail,
                        selectedVariant: product.selectedVariant,
                    })),
                    address: foundUser.addresses.find(
                        (address) => address.id === addressId
                    ),
                };

                orders = [orderDetails, ...orders];

                const updatedOrders = await OrdersModel.findOneAndUpdate(
                    { userId },
                    { $set: { orders } },
                    { upsert: true }
                );
                console.log("orders collection updated");

                const cart = {
                    cartTotal: 0,
                    total: 0,
                    products: [],
                    isDeliveryFeeIncluded: false,
                    couponDiscount: 0,
                };

                await UserModel.findOneAndUpdate(
                    { userId },
                    { $set: { cart } }
                );
                console.log("user cart updated");

                res.status(200).json(
                    generateCommonResponse(2019, true, {
                        orderId: updatedOrders.orders[0].id,
                    })
                );
            } else {
                console.log("user not found while completing payment");
                return res.status(400).json(generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while completing payment", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    return { createCheckoutSession, completePayment };
};

module.exports = PaymentControllers;
