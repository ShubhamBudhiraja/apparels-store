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
exports.OrdersControllers = void 0;
const common_1 = require("../lib/utils/common");
const orders_model_1 = require("../models/orders.model");
const OrdersControllers = () => {
    const getOrderDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { orderId, userId } = req.query;
        if (orderId) {
            const formattedOrderId = orderId.split("_")[0];
            const foundOrder = yield orders_model_1.OrdersModel.findOne({
                userId,
                orderId: formattedOrderId,
            });
            if (foundOrder) {
                console.log("order details found");
                return res
                    .status(200)
                    .json((0, common_1.generateCommonResponse)(2025, true, foundOrder));
            }
        }
        return res.status(200).json((0, common_1.generateCommonResponse)(4025));
    });
    const getOrdersByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.query;
        const foundUser = yield orders_model_1.OrdersModel.find({ userId });
        if (foundUser) {
            console.log("orders found");
            return res
                .status(200)
                .json((0, common_1.generateCommonResponse)(2026, true, foundUser));
        }
        else
            return res.status(200).json((0, common_1.generateCommonResponse)(4026));
    });
    const rateOrderJourney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, orderId, description, rating } = req.body;
        if (orderId) {
            const formattedOrderId = orderId.split("_")[0];
            const foundOrder = yield orders_model_1.OrdersModel.findOneAndUpdate({
                userId,
                orderId: formattedOrderId,
            }, { feedback: { description, rating } });
            if (foundOrder) {
                console.log("order feedback submitted successfully");
                return res.status(200).json((0, common_1.generateCommonResponse)(2027, true));
            }
            else {
                console.log("order not found");
                return res.status(200).json((0, common_1.generateCommonResponse)(4025));
            }
        }
    });
    return { getOrderDetails, getOrdersByUser, rateOrderJourney };
};
exports.OrdersControllers = OrdersControllers;
//# sourceMappingURL=orders.controller.js.map