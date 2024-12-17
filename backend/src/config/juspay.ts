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
                return_url: process.env.CLIENT_PAYMENT_STATUS_URL,
            },
            { headers: { ...headers, "x-routing-id": customerId } }
        );
        console.log("juspay create order success", response);
        return { status: true, data: response.data };
    } catch (e: any) {
        console.log("error occured while creating order");
        return { status: false, data: e?.response?.data };
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
                format: "json",
                ...(isSavedCard
                    ? {}
                    : {
                          save_to_locker: shouldSaveCard,
                          card_token: cardDetails?.cardToken,
                          tokenize: `${shouldSaveCard}`,
                      }),
                payment_method_type: cardDetails.paymentMethodType,
                payment_method: cardDetails.paymentMethod,
                card_number: cardDetails?.cardNumber,
                card_exp_month: cardDetails?.cardExpMonth,
                card_exp_year: cardDetails?.cardExpYear,
                name_on_card: cardDetails?.nameOnCard,
                card_security_code: cardDetails?.cardSecurityCode,
            },
            { headers: { ...headers, "x-routing-id": customerId } }
        );

        return { status: true, data: response.data };
    } catch (e: any) {
        console.log("error occured while handling card transaction");
        return { status: false, data: e?.response?.data };
    }
};

export const getSavedCardsList = async (customer_id: string) => {
    try {
        const response = await axios.get(ENDPOINTS.JUSPAY_SAVED_CARDS_LIST, {
            headers: { ...headers, "x-routing-id": customer_id },
            params: { customer_id },
        });

        return { status: true, data: response.data };
    } catch (e: any) {
        console.log("error occured while getting card list");
        return { status: false, data: e?.response?.data };
    }
};

export const getCardDetails = async (cardBin: string) => {
    try {
        const response = await axios.get(
            `${ENDPOINTS.JUSPAY_GET_CARD_DETAILS}/${cardBin}`,
            { headers }
        );

        return { status: true, data: response.data };
    } catch (e: any) {
        console.log("error occured while getting card details");
        return { status: false, data: e?.response?.data };
    }
};

export const getTransactionStatus = async (
    orderId: string,
    customerId: string
) => {
    try {
        const response = await axios.get(
            `${ENDPOINTS.JUSPAY_ORDER_STATUS}/${orderId}`,
            { headers: { ...headers, "x-routing-id": customerId } }
        );

        return { status: true, data: response.data };
    } catch (e: any) {
        console.log("error occured while handling card transaction");
        return { status: false, data: e?.response?.data };
    }
};
