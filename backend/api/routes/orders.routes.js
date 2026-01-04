"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRoutes = void 0;
const express_1 = require("express");
const orders_controller_1 = require("../controllers/orders.controller");
exports.OrdersRoutes = (0, express_1.Router)();
const { getOrdersByUser, getOrderDetails, rateOrderJourney } = (0, orders_controller_1.OrdersControllers)();
exports.OrdersRoutes.get("/get-order-details", getOrderDetails);
exports.OrdersRoutes.get("/get-orders-list", getOrdersByUser);
exports.OrdersRoutes.post("/submit-feedback", rateOrderJourney);
//# sourceMappingURL=orders.routes.js.map