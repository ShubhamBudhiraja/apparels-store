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
exports.OrdersControllers = void 0;
const common_1 = require("../lib/utils/common");
const prisma_1 = __importDefault(require("../config/prisma"));
const product_1 = require("../lib/utils/product");
const user_1 = require("../lib/utils/user");
const orderInclude = {
    items: true,
};
const OrdersControllers = () => {
    const getOrderDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.query);
        const { orderId } = req.query;
        try {
            if (!orderId || !emailId) {
                return res.status(200).json((0, common_1.generateCommonResponse)(4025));
            }
            const formattedOrderId = String(orderId).split("_")[0];
            const foundOrder = yield prisma_1.default.order.findFirst({
                where: {
                    userId: emailId,
                    orderId: formattedOrderId,
                },
                include: orderInclude,
            });
            if (foundOrder) {
                console.log("order details found");
                return res
                    .status(200)
                    .json((0, common_1.generateCommonResponse)(2025, true, (0, product_1.formatOrder)(foundOrder)));
            }
            return res.status(200).json((0, common_1.generateCommonResponse)(4025));
        }
        catch (e) {
            console.log("error occured while getting order details", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const getOrdersByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.query);
        const { limit, pageNumber, startDate, endDate } = req.query;
        try {
            if (!emailId) {
                return res.status(200).json((0, common_1.generateCommonResponse)(4026));
            }
            const ordersLimit = Number(limit) || 10;
            const ordersPage = Number(pageNumber) || 1;
            const skip = (ordersPage - 1) * ordersLimit;
            const orderTimeStampFilter = {};
            if (startDate) {
                orderTimeStampFilter.gte = new Date(startDate);
            }
            if (endDate) {
                const inclusiveEndDate = new Date(endDate);
                inclusiveEndDate.setHours(23, 59, 59, 999);
                orderTimeStampFilter.lte = inclusiveEndDate;
            }
            const orders = yield prisma_1.default.order.findMany({
                where: Object.assign({ userId: emailId }, (Object.keys(orderTimeStampFilter).length
                    ? { orderTimeStamp: orderTimeStampFilter }
                    : {})),
                include: orderInclude,
                skip,
                take: ordersLimit + 1,
                orderBy: { orderTimeStamp: "desc" },
            });
            const hasMore = orders.length > ordersLimit;
            const list = (hasMore ? orders.slice(0, ordersLimit) : orders).map(product_1.formatOrder);
            console.log("orders found");
            return res.status(200).json((0, common_1.generateCommonResponse)(2026, true, {
                list,
                pagination: {
                    hasMore,
                    currentPage: ordersPage,
                },
            }));
        }
        catch (e) {
            console.log("error occured while getting orders", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const rateOrderJourney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.body);
        const { orderId, description, rating } = req.body;
        try {
            if (!orderId || !emailId) {
                return res.status(200).json((0, common_1.generateCommonResponse)(4025));
            }
            const formattedOrderId = String(orderId).split("_")[0];
            const foundOrder = yield prisma_1.default.order.findFirst({
                where: {
                    userId: emailId,
                    orderId: formattedOrderId,
                },
            });
            if (!foundOrder) {
                console.log("order not found");
                return res.status(200).json((0, common_1.generateCommonResponse)(4025));
            }
            yield prisma_1.default.order.update({
                where: { id: foundOrder.id },
                data: {
                    feedbackDescription: description,
                    feedbackRating: rating,
                },
            });
            console.log("order feedback submitted successfully");
            return res.status(200).json((0, common_1.generateCommonResponse)(2027, true));
        }
        catch (e) {
            console.log("error occured while rating order", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    return { getOrderDetails, getOrdersByUser, rateOrderJourney };
};
exports.OrdersControllers = OrdersControllers;
//# sourceMappingURL=orders.controller.js.map