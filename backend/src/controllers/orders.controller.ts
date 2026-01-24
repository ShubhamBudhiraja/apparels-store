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
        const { userId, limit, pageNumber, startDate, endDate } = req.query;

        const ordersLimit = limit || 10;
        const ordersPage = Number(pageNumber) || 1;
        const skip = (ordersPage - 1) * ordersLimit;

        const query: any = {
            userId,
        };

        if (startDate || endDate) {
            query.orderTimeStamp = {};

            if (startDate) {
                query.orderTimeStamp.$gte = new Date(startDate);
            }

            if (endDate) {
                query.orderTimeStamp.$lte = new Date(endDate);
            }
        }

        const orders = await OrdersModel.find(query)
            .skip(skip)
            .limit(ordersLimit)
            .sort({ orderTimeStamp: -1 });

        if (orders) {
            console.log("orders found");

            return res.status(200).json(
                generateCommonResponse(2026, true, {
                    list: orders,
                    pagination: {
                        hasMore: orders.length > ordersLimit,
                        currentPage: ordersPage,
                    },
                })
            );
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
