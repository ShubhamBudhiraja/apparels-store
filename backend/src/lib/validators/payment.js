const { body, check } = require("express-validator");

const PaymentValidators = {
    createOrder: [
        body("userId", "userId cannot be empty").isString().notEmpty(),
        check("amount", "amount is required").if(
            (_value, { req }) => typeof req.body.amount === "number"
        ),
    ],
    card: [
        body("orderId", "orderId cannot be empty").isString().notEmpty(),
        body("isSavedCard").isBoolean(),
        body(
            "cardDetails.cardSecurityCode",
            "cardSecurityCode cannot be empty"
        ).notEmpty(),
        body(
            "cardDetails.paymentMethodType",
            "paymentMethodType cannot be empty"
        ).notEmpty(),
        check("cardDetails.paymentMethod", "paymentMethod cannot be empty")
            .if((_value, { req }) => !req.body.isSavedCard)
            .notEmpty(),
        check("cardDetails.cardNumber", "cardNumber cannot be empty")
            .if((_value, { req }) => !req.body.isSavedCard)
            .notEmpty(),
        check("cardDetails.cardExpMonth", "cardExpMonth cannot be empty")
            .if((_value, { req }) => !req.body.isSavedCard)
            .notEmpty(),
        check("cardDetails.cardExpYear", "cardExpYear cannot be empty")
            .if((_value, { req }) => !req.body.isSavedCard)
            .notEmpty(),
        check("cardDetails.nameOnCard", "nameOnCard cannot be empty")
            .if((_value, { req }) => !req.body.isSavedCard)
            .notEmpty(),
        check("cardDetails.shouldSaveCard", "shouldSaveCard should be boolean")
            .if((_value, { req }) => !req.body.isSavedCard)
            .isBoolean(),
        check("cardDetails.cardToken", "cardToken cannot be empty")
            .if((_value, { req }) => req.body.isSavedCard)
            .notEmpty(),
    ],
    paymentStatus: [
        body("orderId", "orderId cannot be empty").isString().notEmpty(),
    ],
    completePayment: [
        body("orderId", "orderId cannot be empty").isString().notEmpty(),
        body("userId", "userId cannot be empty").isString().notEmpty(),
        body("addressId", "addressId cannot be empty").isString().notEmpty(),
    ],
};

module.exports = PaymentValidators;
