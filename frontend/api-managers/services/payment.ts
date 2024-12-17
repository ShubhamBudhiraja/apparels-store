import { ICardDetails } from '@interface/payment';
import useApiCall from 'api-managers/base';
import API_ENDPOINTS from 'api-managers/endpoints';

const usePaymentApi = () => {
    const { getApi, postApi } = useApiCall();

    const initiatePayment = async ({
        userId,
        amount,
        addressId,
    }: {
        userId: string;
        amount: number;
        addressId: string;
    }) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PAYMENT.CREATE_ORDER}`,
            requestPayload: { userId, amount, addressId },
        });

        return res;
    };

    const handleCardPayment = async (payload: {
        userId: string;
        orderId: string;
        isSavedCard?: boolean;
        shouldSaveCard?: boolean;
        cardDetails: ICardDetails;
    }) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PAYMENT.PLACE_ORDER.CARD}`,
            requestPayload: payload,
        });

        return res;
    };

    const getSavedCardsList = async (userId: string) => {
        const res = await getApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PAYMENT.GET_SAVED_CARDS_LIST}`,
            headers: { params: { userId } },
        });

        return res;
    };

    const getCardInfo = async (cardBin: string) => {
        const res = await getApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PAYMENT.GET_CARD_DETAILS}`,
            headers: { params: { cardBin } },
        });

        return res;
    };

    const getPaymentStatus = async ({ orderId, userId }: { orderId: string; userId: string }) => {
        const res = await getApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PAYMENT.GET_PAYMENT_STATUS}`,
            headers: { params: { orderId, userId } },
        });

        return res;
    };

    return { initiatePayment, handleCardPayment, getSavedCardsList, getCardInfo, getPaymentStatus };
};

export default usePaymentApi;
