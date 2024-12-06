const express = require("express");
const PaymentControllers = require("../controllers/payment.controller");
const PaymentValidators = require("../lib/validators/payment");

const PaymentRoutes = express.Router();
const {
    completePayment,
    createNewOrder,
    initiateCardTransaction,
    getPaymentStatus,
} = PaymentControllers();

PaymentRoutes.post(
    "/create-order",
    PaymentValidators.createOrder,
    createNewOrder
);
PaymentRoutes.post(
    "/place-order/card",
    PaymentValidators.card,
    initiateCardTransaction
);
PaymentRoutes.get(
    "/get-payment-status",
    PaymentValidators.paymentStatus,
    getPaymentStatus
);
PaymentRoutes.post(
    "/complete-payment",
    PaymentValidators.completePayment,
    completePayment
);

module.exports = PaymentRoutes;
