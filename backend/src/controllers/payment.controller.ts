import { validationResult } from "express-validator";
import { generateCommonResponse } from "../lib/utils/common";
import { UserModel } from "../models/user.model";
import {
    createPaymentOrder,
    getTransactionStatus,
    handleCardTransaction,
} from "../config/juspay";
import { ProductModel } from "../models/product.model";
import {
    checkProductsAvailability,
    generateOrderDetails,
    updateProductInventory,
} from "../lib/utils/payment";
import { OrdersModel } from "../models/orders.model";

export const PaymentControllers = () => {
    const createNewOrder = async (req: any, res: any) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const { amount, userId } = req.body;

            try {
                const foundUser = await UserModel.findOne({ userId });

                if (foundUser) {
                    const timeStamp = new Date();
                    const orderId = `${timeStamp.getTime()}${timeStamp.getMonth()}${timeStamp.getDate()}${timeStamp.getFullYear()}`;
                    const response = await createPaymentOrder({
                        amount,
                        orderid: orderId,
                        customerId: userId,
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

    const initiateCardTransaction = async (req: any, res: any) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const {
                userId,
                orderId,
                cardDetails,
                shouldSaveCard,
                isSavedCard,
            } = req.body;

            const response = await handleCardTransaction({
                orderId,
                shouldSaveCard,
                isSavedCard,
                cardDetails,
                customerId: userId,
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

    const getPaymentStatus = async (req: any, res: any) => {
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

    const completePayment = async (req: any, res: any) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const { orderId, userId, addressId } = req.body;

            try {
                const foundUser: any = await UserModel.findOne({ userId });

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
