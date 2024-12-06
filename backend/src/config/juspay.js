const axios = require("axios");
const dotenv = require("dotenv");
const ENDPOINTS = require("../constants/endpoints");

dotenv.config();

const JuspayOps = () => {
    const headers = {
        "Content-Type": "application/json",
        "x-merchantid": process.env.JUSPAY_MERCHANT_ID,
        Authorization: `Basic ${process.env.JUSPAY_API_KEY}`,
        // the stored key in env file is encoded in base64. If the original key needs to be accessed or updated, go to juspay payments -> settings.
    };

    const createOrder = async ({ order_id, amount, customer_id }) => {
        try {
            const response = await axios.post(
                ENDPOINTS.JUSPAY_CREATE_ORDER,
                {
                    order_id,
                    amount,
                    customer_id,
                    return_url: `${process.env.CLIENT_PAYMENT_STATUS_URL}?orderId=${order_id}`,
                },
                { ...headers, "x-routing-id": customer_id }
            );
            console.log("juspay create order success", response);
            return response.data;
        } catch (e) {
            console.log("error occured while creating order");
            return e?.response?.data;
        }
    };

    const handleCardTransaction = async ({
        order_id,
        isSavedCard = false,
        shouldSaveCard = false,
        cardDetails,
    }) => {
        try {
            if (order_id) {
                const response = await axios.post(
                    ENDPOINTS.JUSPAY_TRANSACTION,
                    {
                        order_id,
                        merchant_id: process.env.JUSPAY_MERCHANT_ID,
                        redirect_after_payment: true,
                        tokenize: true,
                        format: "json",
                        ...(isSavedCard
                            ? {}
                            : { save_to_locker: shouldSaveCard }),
                        ...cardDetails,
                    },
                    { "x-routing-id": customer_id }
                );

                return response.data;
            }
        } catch (e) {
            console.log("error occured while handling card transaction");
            return e?.response?.data;
        }
    };

    const getTransactionStatus = async (orderId, customerId) => {
        try {
            const response = await axios.get(
                `${ENDPOINTS.JUSPAY_ORDER_STATUS}/${orderId}`,
                { "x-routing-id": customerId }
            );

            return response.data;
        } catch (e) {
            console.log("error occured while handling card transaction");
            return e?.response?.data;
        }
    };

    return { createOrder, handleCardTransaction, getTransactionStatus };
};

module.exports = JuspayOps;
