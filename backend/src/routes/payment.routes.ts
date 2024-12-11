import { PaymentControllers } from "../controllers/payment.controller";
import { PaymentValidators } from "../lib/validators/payment";
import express from "express";

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

export default PaymentRoutes;
