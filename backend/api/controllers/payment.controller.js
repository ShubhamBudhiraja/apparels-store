"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentControllers = void 0;
const express_validator_1 = require("express-validator");
const common_1 = require("../lib/utils/common");
const user_model_1 = require("../models/user.model");
const juspay_1 = require("../config/juspay");
const product_model_1 = require("../models/product.model");
const payment_1 = require("../lib/utils/payment");
const orders_model_1 = require("../models/orders.model");
const PaymentControllers = () => {
    const createNewOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            const { amount, userId } = req.body;
            try {
                const foundUser = yield user_model_1.UserModel.findOne({ userId });
                if (foundUser) {
                    const timeStamp = new Date();
                    const orderId = `${timeStamp.getTime()}${timeStamp.getMonth()}${timeStamp.getDate()}${timeStamp.getFullYear()}`;
                    const response = yield (0, juspay_1.createPaymentOrder)({
                        amount,
                        orderid: orderId,
                        customerId: userId,
                    });
                    if (response === null || response === void 0 ? void 0 : response.status) {
                        console.log("order created successfully");
                        return res
                            .status(200)
                            .json((0, common_1.generateCommonResponse)(2020, true, response === null || response === void 0 ? void 0 : response.data));
                    }
                    else {
                        console.log("order created successfully");
                        return res
                            .status(400)
                            .json((0, common_1.generateCommonResponse)(4021, false, response));
                    }
                }
                else {
                    console.log("user not found while initiating payment");
                    return res.status(400).json((0, common_1.generateCommonResponse)(4004));
                }
            }
            catch (e) {
                console.log("error occured while creating order", e);
                return res.status(500).json((0, common_1.generateCommonResponse)(5000));
            }
        }
        else {
            console.log("invalid payload received while creating order");
            return res.status(400).json((0, common_1.generateCommonResponse)(4000, false, {
                errors: errors.array(),
            }));
        }
    });
    const initiateCardTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            const { userId, orderId, cardDetails, shouldSaveCard, isSavedCard, } = req.body;
            const response = yield (0, juspay_1.handleCardTransaction)({
                orderId,
                shouldSaveCard,
                isSavedCard,
                cardDetails,
                customerId: userId,
            });
            if (response === null || response === void 0 ? void 0 : response.status) {
                console.log("card details submitted successfully", response);
                return res.status(200).json((0, common_1.generateCommonResponse)(2021, true, {
                    paymentUrl: (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.payment) === null || _b === void 0 ? void 0 : _b.authentication) === null || _c === void 0 ? void 0 : _c.url,
                }));
            }
            else {
                console.log("card details could not be submitted");
                return res
                    .status(400)
                    .json((0, common_1.generateCommonResponse)(4020, false, response));
            }
        }
        else {
            console.log("invalid payload - initiating card transaction");
            return res.status(400).json((0, common_1.generateCommonResponse)(4000, false, {
                errors: errors.array(),
            }));
        }
    });
    const getSavedCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.query;
        if (userId) {
            const response = yield (0, juspay_1.getSavedCardsList)(userId);
            if (response === null || response === void 0 ? void 0 : response.status) {
                console.log("cards list sent successfully");
                return res
                    .status(200)
                    .json((0, common_1.generateCommonResponse)(2023, true, response === null || response === void 0 ? void 0 : response.data));
            }
            else {
                console.log("cards list not found");
                return res
                    .status(400)
                    .json((0, common_1.generateCommonResponse)(4023, false, response));
            }
        }
    });
    const getCardInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { cardBin } = req.query;
        if (cardBin) {
            const response = yield (0, juspay_1.getCardDetails)(cardBin);
            if (response === null || response === void 0 ? void 0 : response.status) {
                console.log("cards info sent successfully");
                return res
                    .status(200)
                    .json((0, common_1.generateCommonResponse)(2024, true, response === null || response === void 0 ? void 0 : response.data));
            }
            else {
                console.log("cards info not found");
                return res
                    .status(400)
                    .json((0, common_1.generateCommonResponse)(4024, false, response));
            }
        }
    });
    const getPaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            const { userId, orderId } = req.query;
            const response = yield (0, juspay_1.getTransactionStatus)(orderId, userId);
            if ((response === null || response === void 0 ? void 0 : response.status) && ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.status_id) !== 40) {
                console.log("payment status sent successfully");
                return res.status(200).json((0, common_1.generateCommonResponse)(2022, true, {
                    status: (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.status,
                    statusId: (_c = response === null || response === void 0 ? void 0 : response.data) === null || _c === void 0 ? void 0 : _c.status_id,
                    amount: (_d = response === null || response === void 0 ? void 0 : response.data) === null || _d === void 0 ? void 0 : _d.amount,
                }));
            }
            else {
                console.log("payment status not found");
                return res.status(400).json((0, common_1.generateCommonResponse)(4022));
            }
        }
        else {
            console.log("invalid payload - payment status");
            return res.status(400).json((0, common_1.generateCommonResponse)(4000, false, {
                errors: errors.array(),
            }));
        }
    });
    const getPaymentUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("request starts ***************\n", req.body, "request body ends***********\n", req.url);
        yield orders_model_1.OrdersModel.create({
            userId: "test",
            orderId: "test",
            orderTimeStamp: new Date(),
        });
        res.send("OK");
    });
    const completePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            const { orderId, userId, addressId } = req.body;
            try {
                const foundUser = yield user_model_1.UserModel.findOne({ userId });
                if (foundUser) {
                    const allProducts = yield product_model_1.ProductModel.find();
                    let allProductsAvailable = (0, payment_1.checkProductsAvailability)(allProducts, foundUser.cart.products);
                    if (!allProductsAvailable) {
                        console.log("some products went out of stock");
                        return res
                            .status(400)
                            .json((0, common_1.generateCommonResponse)(4018));
                    }
                    console.log("all products available");
                    (0, payment_1.updateProductInventory)(allProducts, foundUser.cart.products);
                    const orderDetails = (0, payment_1.generateOrderDetails)({
                        orderId,
                        userDetails: foundUser,
                        addressId,
                    });
                    yield orders_model_1.OrdersModel.findOneAndUpdate({ userId }, { $set: Object.assign({}, orderDetails) });
                    console.log("orders collection updated");
                    const cart = {
                        cartTotal: 0,
                        total: 0,
                        products: [],
                        isDeliveryFeeIncluded: false,
                        couponDiscount: 0,
                    };
                    yield user_model_1.UserModel.findOneAndUpdate({ userId }, { $set: { cart } });
                    console.log("user cart updated");
                    res.status(200).json((0, common_1.generateCommonResponse)(2019, true));
                }
                else {
                    console.log("user not found while completing payment");
                    return res.status(400).json((0, common_1.generateCommonResponse)(4004));
                }
            }
            catch (e) {
                console.log("error occured while completing payment", e);
                return res.status(500).json((0, common_1.generateCommonResponse)(5000));
            }
        }
        else {
            console.log("invalid payload - payment status");
            return res.status(400).json((0, common_1.generateCommonResponse)(4000, false, {
                errors: errors.array(),
            }));
        }
    });
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
exports.PaymentControllers = PaymentControllers;
//# sourceMappingURL=payment.controller.js.map