import { generateCommonResponse } from "../lib/utils/common";
import { OrdersModel } from "../models/orders.model";

export const OrdersControllers = () => {
    const getOrderDetails = async (req: any, res: any) => {
        const { orderId, userId } = req.query;

        if (orderId) {
            const formattedOrderId = orderId.split("_")[0];

            const foundOrder = await OrdersModel.findOne({
                userId,
                orderId: formattedOrderId,
            });

            if (foundOrder) {
                console.log("order details found");

                return res
                    .status(200)
                    .json(generateCommonResponse(2025, true, foundOrder));
            }
        }

        return res.status(200).json(generateCommonResponse(4025));
    };

    const getOrdersByUser = async (req: any, res: any) => {
        const { userId } = req.query;

        const foundUser = await OrdersModel.find({ userId });

        if (foundUser) {
            console.log("orders found");

            return res
                .status(200)
                .json(generateCommonResponse(2026, true, foundUser));
        } else return res.status(200).json(generateCommonResponse(4026));
    };

    const rateOrderJourney = async (req: any, res: any) => {
        const { userId, orderId, description, rating } = req.body;

        if (orderId) {
            const formattedOrderId = orderId.split("_")[0];

            const foundOrder = await OrdersModel.findOneAndUpdate(
                {
                    userId,
                    orderId: formattedOrderId,
                },
                { feedback: { description, rating } }
            );

            if (foundOrder) {
                console.log("order feedback submitted successfully");
                return res.status(200).json(generateCommonResponse(2027, true));
            } else {
                console.log("order not found");
                return res.status(200).json(generateCommonResponse(4025));
            }
        }
    };

    return { getOrderDetails, getOrdersByUser, rateOrderJourney };
};
