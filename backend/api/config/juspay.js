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
exports.getTransactionStatus = exports.handleCardTransaction = exports.createPaymentOrder = void 0;
const dotenv_1 = require("dotenv");
const endpoints_1 = require("../constants/endpoints");
const axios_1 = __importDefault(require("axios"));
(0, dotenv_1.configDotenv)();
const headers = {
    "Content-Type": "application/json",
    "x-merchantid": process.env.JUSPAY_MERCHANT_ID,
    Authorization: `Basic ${process.env.JUSPAY_API_KEY}`,
    // the stored key in env file is encoded in base64. If the original key needs to be accessed or updated, go to juspay payments -> settings.
};
const createPaymentOrder = (_a) => __awaiter(void 0, [_a], void 0, function* ({ orderid, amount, customerId, }) {
    var _b;
    try {
        const response = yield axios_1.default.post(endpoints_1.ENDPOINTS.JUSPAY_CREATE_ORDER, {
            order_id: orderid,
            amount,
            customer_id: customerId,
            return_url: `${process.env.CLIENT_PAYMENT_STATUS_URL}?orderId=${orderid}`,
        }, { headers: Object.assign(Object.assign({}, headers), { "x-routing-id": customerId }) });
        console.log("juspay create order success", response);
        return response.data;
    }
    catch (e) {
        console.log("error occured while creating order");
        return (_b = e === null || e === void 0 ? void 0 : e.response) === null || _b === void 0 ? void 0 : _b.data;
    }
});
exports.createPaymentOrder = createPaymentOrder;
const handleCardTransaction = (_a) => __awaiter(void 0, [_a], void 0, function* ({ orderId, customerId, isSavedCard = false, shouldSaveCard = false, cardDetails, }) {
    var _b;
    try {
        const response = yield axios_1.default.post(endpoints_1.ENDPOINTS.JUSPAY_TRANSACTION, Object.assign(Object.assign({ order_id: orderId, merchant_id: process.env.JUSPAY_MERCHANT_ID, redirect_after_payment: true, tokenize: true, format: "json" }, (isSavedCard ? {} : { save_to_locker: shouldSaveCard })), { payment_method_type: cardDetails.paymentMethodType, payment_method: cardDetails.paymentMethod, card_token: cardDetails === null || cardDetails === void 0 ? void 0 : cardDetails.cardToken, card_number: cardDetails === null || cardDetails === void 0 ? void 0 : cardDetails.cardNumber, card_exp_month: cardDetails === null || cardDetails === void 0 ? void 0 : cardDetails.cardExpMonth, card_exp_year: cardDetails === null || cardDetails === void 0 ? void 0 : cardDetails.cardExpYear, name_on_card: cardDetails === null || cardDetails === void 0 ? void 0 : cardDetails.nameOnCard, card_security_code: cardDetails === null || cardDetails === void 0 ? void 0 : cardDetails.cardSecurityCode }), { headers: { "x-routing-id": customerId } });
        return response.data;
    }
    catch (e) {
        console.log("error occured while handling card transaction");
        return (_b = e === null || e === void 0 ? void 0 : e.response) === null || _b === void 0 ? void 0 : _b.data;
    }
});
exports.handleCardTransaction = handleCardTransaction;
const getTransactionStatus = (orderId, customerId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield axios_1.default.get(`${endpoints_1.ENDPOINTS.JUSPAY_ORDER_STATUS}/${orderId}`, { headers: { "x-routing-id": customerId } });
        return response.data;
    }
    catch (e) {
        console.log("error occured while handling card transaction");
        return (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data;
    }
});
exports.getTransactionStatus = getTransactionStatus;
