const JuspayOps = require("../config/juspay");
const paymentUtils = require("../lib/utils/payment");
const OrdersModel = require("../models/orders.model");
const ProductModel = require("../models/product.model");
const UserModel = require("../models/user.model");
const commonUtils = require("../utils/common");
const { validationResult } = require("express-validator");

const PaymentControllers = () => {
    const { generateCommonResponse } = commonUtils();
    const { createOrder, handleCardTransaction, getTransactionStatus } =
        JuspayOps();
    const {
        updateProductInventory,
        checkProductsAvailability,
        generateOrderDetails,
    } = paymentUtils();

    const createNewOrder = async (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const { amount, userId } = req.body;

            try {
                const foundUser = await UserModel.findOne({ userId });

                if (foundUser) {
                    const timeStamp = new Date();
                    const orderId = `${timeStamp.getTime()}${timeStamp.getMonth()}${timeStamp.getDate()}${timeStamp.getFullYear()}`;
                    const response = await createOrder({
                        amount,
                        order_id: orderId,
                        customer_id: userId,
                    });

                    if (response?.status) {
                        console.log("order created successfully");
                        return res
                            .status(200)
                            .json(generateCommonResponse(2020, true, response));
                    } else {
                        console.log("order created successfully");
                        return res
                            .status(400)
                            .json(
                                generateCommonResponse(4021, false, response)
                            );
                    }
                } else {
                    console.log("user not found while initiating payment");
                    return res.status(400).json(generateCommonResponse(4004));
                }
            } catch (e) {
                console.log("error occured while creating order", e);
                return res.status(500).json(generateCommonResponse(5000));
            }
        } else {
            console.log("invalid payload received while creating order");
            return res.status(400).json(
                generateCommonResponse(4000, false, {
                    errors: errors.array(),
                })
            );
        }
    };

    const initiateCardTransaction = async (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const { orderId, cardDetails, shouldSaveCard } = req.body;

            const response = await handleCardTransaction({
                order_id: orderId,
                shouldSaveCard,
                isSavedCard,
                cardDetails: {
                    payment_method_type: cardDetails.paymentMethodType,
                    payment_method: cardDetails.paymentMethod,
                    card_number: cardDetails.cardNumber,
                    card_exp_month: cardDetails.cardExpMonth,
                    card_exp_year: cardDetails.cardExpYear,
                    name_on_card: cardDetails.nameOnCard,
                    card_security_code: cardDetails.cardSecurityCode,
                },
            });

            if (response?.status) {
                console.log("card details submitted successfully");
                return res
                    .status(200)
                    .json(generateCommonResponse(2021, true, response));
            } else {
                console.log("card details could not be submitted");
                return res
                    .status(400)
                    .json(generateCommonResponse(4020, false, response));
            }
        } else {
            console.log("invalid payload - initiating card transaction");
            return res.status(400).json(
                generateCommonResponse(4000, false, {
                    errors: errors.array(),
                })
            );
        }
    };

    const getPaymentStatus = async (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const { userId, orderId } = req.body;

            const response = await getTransactionStatus(orderId, userId);

            if (response?.status) {
                console.log("payment status sent successfully");
                return res
                    .status(200)
                    .json(generateCommonResponse(2022, true, response));
            } else {
                console.log("payment status not found");
                return res
                    .status(400)
                    .json(generateCommonResponse(4022, false, response));
            }
        } else {
            console.log("invalid payload - payment status");
            return res.status(400).json(
                generateCommonResponse(4000, false, {
                    errors: errors.array(),
                })
            );
        }
    };

    const completePayment = async (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const { orderId, userId, addressId } = req.body;

            try {
                const foundUser = await UserModel.findOne({ userId });

                if (foundUser) {
                    const allProducts = await ProductModel.find();

                    let allProductsAvailable = checkProductsAvailability(
                        allProducts,
                        foundUser.cart.products
                    );

                    if (!allProductsAvailable) {
                        console.log("some products went out of stock");

                        return res
                            .status(400)
                            .json(generateCommonResponse(4018));
                    }
                    console.log("all products available");

                    updateProductInventory(
                        allProducts,
                        foundUser.cart.products
                    );

                    const orderDetails = generateOrderDetails({
                        orderId,
                        userDetails: foundUser,
                        addressId,
                    });

                    await OrdersModel.findOneAndUpdate(
                        { userId },
                        { $set: { ...orderDetails } }
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

                    res.status(200).json(generateCommonResponse(2019, true));
                } else {
                    console.log("user not found while completing payment");
                    return res.status(400).json(generateCommonResponse(4004));
                }
            } catch (e) {
                console.log("error occured while completing payment", e);
                return res.status(500).json(generateCommonResponse(5000));
            }
        } else {
            console.log("invalid payload - payment status");
            return res.status(400).json(
                generateCommonResponse(4000, false, {
                    errors: errors.array(),
                })
            );
        }
    };

    return {
        createNewOrder,
        initiateCardTransaction,
        getPaymentStatus,
        completePayment,
    };
};

module.exports = PaymentControllers;
