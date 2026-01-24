import { validationResult } from "express-validator";
import { generateCommonResponse } from "../lib/utils/common";
import { UserModel } from "../models/user.model";
import {
    createPaymentOrder,
    getCardDetails,
    getSavedCardsList,
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
import { config } from "dotenv";

config();

export const PaymentControllers = () => {
    const createNewOrder = async (req: any, res: any) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const { amount, userId, addressId } = req.body;

            try {
                const foundUser = await UserModel.findOne({ userId });

                if (foundUser) {
                    const timeStamp = new Date();
                    const orderId = `${timeStamp.getTime()}${timeStamp.getMonth()}${timeStamp.getDate()}${timeStamp.getFullYear()}_${addressId}`;
                    const response = await createPaymentOrder({
                        amount,
                        orderid: orderId,
                        customerId: userId,
                    });

                    if (response?.status) {
                        console.log("order created successfully");
                        return res
                            .status(200)
                            .json(
                                generateCommonResponse(
                                    2020,
                                    true,
                                    response?.data,
                                ),
                            );
                    } else {
                        console.log("order created successfully");
                        return res
                            .status(200)
                            .json(
                                generateCommonResponse(4021, false, response),
                            );
                    }
                } else {
                    console.log("user not found while initiating payment");
                    return res.status(200).json(generateCommonResponse(4004));
                }
            } catch (e) {
                console.log("error occured while creating order", e);
                return res.status(500).json(generateCommonResponse(5000));
            }
        } else {
            console.log("invalid payload received while creating order");
            return res.status(200).json(
                generateCommonResponse(4000, false, {
                    errors: errors.array(),
                }),
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
                console.log("card details submitted successfully", response);
                return res.status(200).json(
                    generateCommonResponse(2021, true, {
                        paymentUrl:
                            response?.data?.payment?.authentication?.url,
                    }),
                );
            } else {
                console.log("card details could not be submitted");
                return res
                    .status(200)
                    .json(generateCommonResponse(4020, false, response));
            }
        } else {
            console.log("invalid payload - initiating card transaction");
            return res.status(200).json(
                generateCommonResponse(4000, false, {
                    errors: errors.array(),
                }),
            );
        }
    };

    const getSavedCards = async (req: any, res: any) => {
        const { userId } = req.query;
        if (userId) {
            const response = await getSavedCardsList(userId);

            if (response?.status) {
                console.log("cards list sent successfully");
                return res
                    .status(200)
                    .json(generateCommonResponse(2023, true, response?.data));
            } else {
                console.log("cards list not found");
                return res
                    .status(200)
                    .json(generateCommonResponse(4023, false, response));
            }
        }
    };

    const getCardInfo = async (req: any, res: any) => {
        const { cardBin } = req.query;
        if (cardBin) {
            const response = await getCardDetails(cardBin);

            if (response?.status) {
                console.log("cards info sent successfully");
                return res
                    .status(200)
                    .json(generateCommonResponse(2024, true, response?.data));
            } else {
                console.log("cards info not found");
                return res
                    .status(200)
                    .json(generateCommonResponse(4024, false, response));
            }
        }
    };

    const getPaymentStatus = async (req: any, res: any) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const { userId, orderId } = req.query;

            const response = await getTransactionStatus(
                orderId as string,
                userId as string,
            );

            if (response?.status && response?.data?.status_id !== 40) {
                console.log("payment status sent successfully");
                return res.status(200).json(
                    generateCommonResponse(2022, true, {
                        status: response?.data?.status,
                        statusId: response?.data?.status_id,
                        amount: response?.data?.amount,
                    }),
                );
            } else {
                console.log("payment status not found");
                return res.status(200).json(generateCommonResponse(4022));
            }
        } else {
            console.log("invalid payload - payment status");
            return res.status(200).json(
                generateCommonResponse(4000, false, {
                    errors: errors.array(),
                }),
            );
        }
    };

    const completePayment = async ({
        orderId,
        userId,
        addressId,
        userDetails,
    }: {
        orderId: string;
        userId: string;
        addressId: string;
        userDetails: any;
    }) => {
        const allProducts = await ProductModel.find();

        let allProductsAvailable = checkProductsAvailability(
            allProducts,
            userDetails.cart.products,
        );

        if (!allProductsAvailable) {
            console.log("some products went out of stock");

            return false;
        }
        console.log("all products available");

        updateProductInventory(allProducts, userDetails.cart.products);

        const orderDetails = generateOrderDetails({
            orderId,
            userDetails: userDetails,
            addressId,
        });

        await OrdersModel.create({
            userId,
            ...orderDetails,
            status: "delivered",
        });
        console.log("orders collection updated");

        const cart = {
            cartTotal: 0,
            total: 0,
            products: [],
            isDeliveryFeeIncluded: false,
            couponDiscount: 0,
        };

        await UserModel.findOneAndUpdate({ userId }, { $set: { cart } });
        console.log("user cart updated");

        return true;
    };

    const getPaymentUpdate = async (req: any, res: any) => {
        console.log(
            "request starts ***************\n",
            req?.body,
            "request body ends***********\n",
            req?.url,
            "request ends",
        );

        const {
            content: { order },
        } = req.body;
        try {
            const foundUser: any = await UserModel.findOne({
                userId: order.customer_id,
            });

            console.log(order, "order");

            if (foundUser) {
                if (order.status_id === 21) {
                    console.log(order.status_id, "order.status_id");
                    const [orderId, addressId] = order.order_id.split("_");
                    const status = await completePayment({
                        orderId,
                        userId: order.customer_id,
                        addressId,
                        userDetails: foundUser,
                    });

                    if (status)
                        res.status(200).json(
                            generateCommonResponse(2019, true),
                        );
                    else res.status(200).json(generateCommonResponse(4018));
                }
            } else {
                console.log("user not found while completing payment");
                return res.status(200).json(generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while completing payment", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    return {
        createNewOrder,
        getCardInfo,
        initiateCardTransaction,
        getSavedCards,
        getPaymentStatus,
        completePayment,
        getPaymentUpdate,
    };
};
