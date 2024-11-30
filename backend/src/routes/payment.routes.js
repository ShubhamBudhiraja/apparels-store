const express = require("express");
const PaymentControllers = require("../controllers/payment.controller");

const PaymentRoutes = express.Router();
const { createCheckoutSession, completePayment } = PaymentControllers();

PaymentRoutes.post("/create-checkout-session", createCheckoutSession);
PaymentRoutes.post("/complete-payment", completePayment);

module.exports = PaymentRoutes;
