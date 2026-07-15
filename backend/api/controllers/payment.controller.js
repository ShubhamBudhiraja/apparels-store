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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentControllers = void 0;
const express_validator_1 = require("express-validator");
const common_1 = require("../lib/utils/common");
const juspay_1 = require("../config/juspay");
const payment_1 = require("../lib/utils/payment");
const dotenv_1 = require("dotenv");
const prisma_1 = __importDefault(require("../config/prisma"));
const user_1 = require("../lib/utils/user");
(0, dotenv_1.config)();
const PaymentControllers = () => {
    const createNewOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            const emailId = (0, user_1.resolveEmailId)(req.body);
            const { amount, addressId } = req.body;
            try {
                const foundUser = emailId
                    ? yield (0, user_1.findUserByEmail)(emailId)
                    : null;
                if (foundUser) {
                    const timeStamp = new Date();
                    const orderId = `${timeStamp.getTime()}${timeStamp.getMonth()}${timeStamp.getDate()}${timeStamp.getFullYear()}_${addressId}`;
                    const response = yield (0, juspay_1.createPaymentOrder)({
                        amount,
                        orderid: orderId,
                        customerId: emailId,
                    });
                    if (response === null || response === void 0 ? void 0 : response.status) {
                        console.log("order created successfully");
                        return res
                            .status(200)
                            .json((0, common_1.generateCommonResponse)(2020, true, response === null || response === void 0 ? void 0 : response.data));
                    }
                    console.log("order could not be created");
                    return res
                        .status(400)
                        .json((0, common_1.generateCommonResponse)(4021, false, response));
                }
                console.log("user not found while initiating payment");
                return res.status(400).json((0, common_1.generateCommonResponse)(4004));
            }
            catch (e) {
                console.log("error occured while creating order", e);
                return res.status(500).json((0, common_1.generateCommonResponse)(5000));
            }
        }
        console.log("invalid payload received while creating order");
        return res.status(400).json((0, common_1.generateCommonResponse)(4000, false, {
            errors: errors.array(),
        }));
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
            console.log("card details could not be submitted");
            return res
                .status(400)
                .json((0, common_1.generateCommonResponse)(4020, false, response));
        }
        console.log("invalid payload - initiating card transaction");
        return res.status(400).json((0, common_1.generateCommonResponse)(4000, false, {
            errors: errors.array(),
        }));
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
            console.log("cards list not found");
            return res
                .status(400)
                .json((0, common_1.generateCommonResponse)(4023, false, response));
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
            console.log("cards info not found");
            return res
                .status(400)
                .json((0, common_1.generateCommonResponse)(4024, false, response));
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
            console.log("payment status not found");
            return res.status(400).json((0, common_1.generateCommonResponse)(4022));
        }
        console.log("invalid payload - payment status");
        return res.status(400).json((0, common_1.generateCommonResponse)(4000, false, {
            errors: errors.array(),
        }));
    });
    const completePayment = (_a) => __awaiter(void 0, [_a], void 0, function* ({ orderId, userId, addressId, userDetails, }) {
        var _b, _c, _d, _e, _f, _g, _h, _j;
        const allProducts = yield (0, payment_1.getFormattedProducts)();
        const allProductsAvailable = (0, payment_1.checkProductsAvailability)(allProducts, userDetails.cart.products);
        if (!allProductsAvailable) {
            console.log("some products went out of stock");
            return false;
        }
        console.log("all products available");
        yield (0, payment_1.updateProductInventory)(allProducts, userDetails.cart.products);
        const orderDetails = (0, payment_1.generateOrderDetails)({
            orderId,
            userDetails: userDetails,
            addressId,
        });
        yield prisma_1.default.order.create({
            data: {
                userId,
                orderId: orderDetails.orderId,
                orderTimeStamp: orderDetails.orderTimeStamp,
                status: "delivered",
                couponDiscount: orderDetails.couponDiscount || 0,
                cartTotal: orderDetails.cartTotal,
                total: orderDetails.total,
                isDeliveryFeeIncluded: orderDetails.isDeliveryFeeIncluded || false,
                addressFirstName: (_b = orderDetails.address) === null || _b === void 0 ? void 0 : _b.firstName,
                addressLastName: (_c = orderDetails.address) === null || _c === void 0 ? void 0 : _c.lastName,
                addressMobileNo: (_d = orderDetails.address) === null || _d === void 0 ? void 0 : _d.mobileNo,
                addressHouseNo: (_e = orderDetails.address) === null || _e === void 0 ? void 0 : _e.houseNo,
                addressStreetAddress: (_f = orderDetails.address) === null || _f === void 0 ? void 0 : _f.streetAddress,
                addressCity: (_g = orderDetails.address) === null || _g === void 0 ? void 0 : _g.city,
                addressPincode: (_h = orderDetails.address) === null || _h === void 0 ? void 0 : _h.pincode,
                addressState: (_j = orderDetails.address) === null || _j === void 0 ? void 0 : _j.state,
                items: {
                    create: orderDetails.products.map((product) => ({
                        productId: product.productId || "",
                        title: product.title || "",
                        price: product.price,
                        offerPrice: product.offerPrice,
                        quantity: product.quantity,
                        thumbnail: product.thumbnail,
                        selectedVariant: product.selectedVariant,
                    })),
                },
            },
        });
        console.log("orders collection updated");
        const dbUser = yield prisma_1.default.user.findUnique({
            where: { emailId: userId },
            include: { cart: true },
        });
        if (dbUser === null || dbUser === void 0 ? void 0 : dbUser.cart) {
            yield prisma_1.default.cartItem.deleteMany({
                where: { cartId: dbUser.cart.id },
            });
        }
        console.log("user cart updated");
        return true;
    });
    const getPaymentUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("request starts ***************\n", req === null || req === void 0 ? void 0 : req.body, "request body ends***********\n", req === null || req === void 0 ? void 0 : req.url, "request ends");
        const { content: { order }, } = req.body;
        try {
            const foundUser = yield (0, user_1.findUserByEmail)(order.customer_id);
            console.log(order, "order");
            if (foundUser) {
                if (order.status_id === 21) {
                    console.log(order.status_id, "order.status_id");
                    const [orderId, addressId] = order.order_id.split("_");
                    const profile = yield (0, user_1.buildProfileResponse)(foundUser);
                    const status = yield completePayment({
                        orderId,
                        userId: order.customer_id,
                        addressId,
                        userDetails: profile,
                    });
                    if (status)
                        res.status(200).json((0, common_1.generateCommonResponse)(2019, true));
                    else
                        res.status(400).json((0, common_1.generateCommonResponse)(4018));
                }
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