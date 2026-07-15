import { generateCommonResponse } from "../lib/utils/common";
import prisma from "../config/prisma";
import { formatOrder } from "../lib/utils/product";
import { resolveEmailId } from "../lib/utils/user";

const orderInclude = {
    items: true,
} as const;

export const OrdersControllers = () => {
    const getOrderDetails = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.query);
        const { orderId } = req.query;

        try {
            if (!orderId || !emailId) {
                return res.status(200).json(generateCommonResponse(4025));
            }

            const formattedOrderId = String(orderId).split("_")[0];

            const foundOrder = await prisma.order.findFirst({
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
                    .json(
                        generateCommonResponse(
                            2025,
                            true,
                            formatOrder(foundOrder),
                        ),
                    );
            }

            return res.status(200).json(generateCommonResponse(4025));
        } catch (e) {
            console.log("error occured while getting order details", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const getOrdersByUser = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.query);
        const { limit, pageNumber, startDate, endDate } = req.query;

        try {
            if (!emailId) {
                return res.status(200).json(generateCommonResponse(4026));
            }

            const ordersLimit = Number(limit) || 10;
            const ordersPage = Number(pageNumber) || 1;
            const skip = (ordersPage - 1) * ordersLimit;

            const orderTimeStampFilter: {
                gte?: Date;
                lte?: Date;
            } = {};

            if (startDate) {
                orderTimeStampFilter.gte = new Date(startDate);
            }

            if (endDate) {
                const inclusiveEndDate = new Date(endDate);
                inclusiveEndDate.setHours(23, 59, 59, 999);
                orderTimeStampFilter.lte = inclusiveEndDate;
            }

            const orders = await prisma.order.findMany({
                where: {
                    userId: emailId,
                    ...(Object.keys(orderTimeStampFilter).length
                        ? { orderTimeStamp: orderTimeStampFilter }
                        : {}),
                },
                include: orderInclude,
                skip,
                take: ordersLimit + 1,
                orderBy: { orderTimeStamp: "desc" },
            });

            const hasMore = orders.length > ordersLimit;
            const list = (hasMore ? orders.slice(0, ordersLimit) : orders).map(
                formatOrder,
            );

            console.log("orders found");
            return res.status(200).json(
                generateCommonResponse(2026, true, {
                    list,
                    pagination: {
                        hasMore,
                        currentPage: ordersPage,
                    },
                }),
            );
        } catch (e) {
            console.log("error occured while getting orders", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const rateOrderJourney = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.body);
        const { orderId, description, rating } = req.body;

        try {
            if (!orderId || !emailId) {
                return res.status(200).json(generateCommonResponse(4025));
            }

            const formattedOrderId = String(orderId).split("_")[0];

            const foundOrder = await prisma.order.findFirst({
                where: {
                    userId: emailId,
                    orderId: formattedOrderId,
                },
            });

            if (!foundOrder) {
                console.log("order not found");
                return res.status(200).json(generateCommonResponse(4025));
            }

            await prisma.order.update({
                where: { id: foundOrder.id },
                data: {
                    feedbackDescription: description,
                    feedbackRating: rating,
                },
            });

            console.log("order feedback submitted successfully");
            return res.status(200).json(generateCommonResponse(2027, true));
        } catch (e) {
            console.log("error occured while rating order", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    return { getOrderDetails, getOrdersByUser, rateOrderJourney };
};
