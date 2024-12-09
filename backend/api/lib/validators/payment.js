"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidators = void 0;
const express_validator_1 = require("express-validator");
exports.PaymentValidators = {
    createOrder: [
        (0, express_validator_1.body)("userId", "userId cannot be empty").isString().notEmpty(),
        (0, express_validator_1.check)("amount", "amount is required").if((_value, { req }) => typeof req.body.amount === "number"),
    ],
    card: [
        (0, express_validator_1.body)("orderId", "orderId cannot be empty").isString().notEmpty(),
        (0, express_validator_1.body)("isSavedCard").isBoolean(),
        (0, express_validator_1.body)("cvvRequired").isBoolean(),
        (0, express_validator_1.body)("cardDetails.paymentMethodType", "paymentMethodType cannot be empty").notEmpty(),
        (0, express_validator_1.check)("cardDetails.cardSecurityCode", "cardSecurityCode cannot be empty")
            .if((_value, { req }) => req.body.cvvRequired)
            .notEmpty(),
        (0, express_validator_1.check)("cardDetails.paymentMethod", "paymentMethod cannot be empty")
            .if((_value, { req }) => !req.body.isSavedCard)
            .notEmpty(),
        (0, express_validator_1.check)("cardDetails.cardNumber", "cardNumber cannot be empty")
            .if((_value, { req }) => !req.body.isSavedCard)
            .notEmpty(),
        (0, express_validator_1.check)("cardDetails.cardExpMonth", "cardExpMonth cannot be empty")
            .if((_value, { req }) => !req.body.isSavedCard)
            .notEmpty(),
        (0, express_validator_1.check)("cardDetails.cardExpYear", "cardExpYear cannot be empty")
            .if((_value, { req }) => !req.body.isSavedCard)
            .notEmpty(),
        (0, express_validator_1.check)("cardDetails.nameOnCard", "nameOnCard cannot be empty")
            .if((_value, { req }) => !req.body.isSavedCard)
            .notEmpty(),
        (0, express_validator_1.check)("cardDetails.shouldSaveCard", "shouldSaveCard should be boolean")
            .if((_value, { req }) => !req.body.isSavedCard)
            .isBoolean(),
        (0, express_validator_1.check)("cardDetails.cardToken", "cardToken cannot be empty")
            .if((_value, { req }) => req.body.isSavedCard)
            .notEmpty(),
    ],
    paymentStatus: [
        (0, express_validator_1.body)("orderId", "orderId cannot be empty").isString().notEmpty(),
    ],
    completePayment: [
        (0, express_validator_1.body)("orderId", "orderId cannot be empty").isString().notEmpty(),
        (0, express_validator_1.body)("userId", "userId cannot be empty").isString().notEmpty(),
        (0, express_validator_1.body)("addressId", "addressId cannot be empty").isString().notEmpty(),
    ],
};
//# sourceMappingURL=payment.js.map