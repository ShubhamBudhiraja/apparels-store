import { PaymentControllers } from "../controllers/payment.controller";
import { PaymentValidators } from "../lib/validators/payment";
import express from "express";

const PaymentRoutes = express.Router();
const {
    createNewOrder,
    initiateCardTransaction,
    getSavedCards,
    getPaymentStatus,
    getCardInfo,
    getPaymentUpdate,
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

PaymentRoutes.get("/get-saved-cards-list", getSavedCards);

PaymentRoutes.get("/get-card-info", getCardInfo);

PaymentRoutes.get("/payment/get-payment-update", getPaymentUpdate);

export default PaymentRoutes;
