"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const payment_controller_1 = require("../controllers/payment.controller");
const payment_1 = require("../lib/validators/payment");
const express_1 = __importDefault(require("express"));
const PaymentRoutes = express_1.default.Router();
const { completePayment, createNewOrder, initiateCardTransaction, getPaymentStatus, } = (0, payment_controller_1.PaymentControllers)();
PaymentRoutes.post("/create-order", payment_1.PaymentValidators.createOrder, createNewOrder);
PaymentRoutes.post("/place-order/card", payment_1.PaymentValidators.card, initiateCardTransaction);
PaymentRoutes.get("/get-payment-status", payment_1.PaymentValidators.paymentStatus, getPaymentStatus);
PaymentRoutes.post("/complete-payment", payment_1.PaymentValidators.completePayment, completePayment);
exports.default = PaymentRoutes;
//# sourceMappingURL=payment.routes.js.map