import { Router } from "express";
import { OrdersControllers } from "../controllers/orders.controller";

export const OrdersRoutes = Router();

const { getOrdersByUser, getOrderDetails, rateOrderJourney } =
    OrdersControllers();

OrdersRoutes.get("/get-order-details", getOrderDetails);
OrdersRoutes.get("/get-orders-list", getOrdersByUser);
OrdersRoutes.post("/submit-feedback", rateOrderJourney);
