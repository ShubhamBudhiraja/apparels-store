import { configDotenv } from "dotenv";
import { ENDPOINTS } from "../constants/endpoints";
import axios from "axios";
import { ICardDetails } from "../lib/interface/payment";

configDotenv();

const headers = {
    "Content-Type": "application/json",
    "x-merchantid": process.env.JUSPAY_MERCHANT_ID,
    Authorization: `Basic ${process.env.JUSPAY_API_KEY}`,
    // the stored key in env file is encoded in base64. If the original key needs to be accessed or updated, go to juspay payments -> settings.
};

export const createPaymentOrder = async ({
    orderid,
    amount,
    customerId,
}: {
    orderid: string;
    amount: number;
    customerId: string;
}) => {
    try {
        const response = await axios.post(
            ENDPOINTS.JUSPAY_CREATE_ORDER,
            {
                order_id: orderid,
                amount,
                customer_id: customerId,
                return_url: `${process.env.CLIENT_PAYMENT_STATUS_URL}?orderId=${orderid}`,
            },
            { headers: { ...headers, "x-routing-id": customerId } }
        );
        console.log("juspay create order success", response);
        return response.data;
    } catch (e: any) {
        console.log("error occured while creating order");
        return e?.response?.data;
    }
};

export const handleCardTransaction = async ({
    orderId,
    customerId,
    isSavedCard = false,
    shouldSaveCard = false,
    cardDetails,
}: {
    orderId: string;
    customerId: string;
    cardDetails: ICardDetails;
    isSavedCard?: boolean;
    shouldSaveCard?: boolean;
}) => {
    try {
        const response = await axios.post(
            ENDPOINTS.JUSPAY_TRANSACTION,
            {
                order_id: orderId,
                merchant_id: process.env.JUSPAY_MERCHANT_ID,
                redirect_after_payment: true,
                tokenize: true,
                format: "json",
                ...(isSavedCard ? {} : { save_to_locker: shouldSaveCard }),
                payment_method_type: cardDetails.paymentMethodType,
                payment_method: cardDetails.paymentMethod,
                card_token: cardDetails?.cardToken,
                card_number: cardDetails?.cardNumber,
                card_exp_month: cardDetails?.cardExpMonth,
                card_exp_year: cardDetails?.cardExpYear,
                name_on_card: cardDetails?.nameOnCard,
                card_security_code: cardDetails?.cardSecurityCode,
            },
            { headers: { "x-routing-id": customerId } }
        );

        return response.data;
    } catch (e: any) {
        console.log("error occured while handling card transaction");
        return e?.response?.data;
    }
};

export const getTransactionStatus = async (
    orderId: string,
    customerId: string
) => {
    try {
        const response = await axios.get(
            `${ENDPOINTS.JUSPAY_ORDER_STATUS}/${orderId}`,
            { headers: { "x-routing-id": customerId } }
        );

        return response.data;
    } catch (e: any) {
        console.log("error occured while handling card transaction");
        return e?.response?.data;
    }
};
