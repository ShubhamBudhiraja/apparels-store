import useApiCall from 'api-managers/base';
import API_ENDPOINTS from 'api-managers/endpoints';

const usePaymentApi = () => {
    const { postApi } = useApiCall();

    const initiatePayment = async ({ userId, amount }: { userId: string; amount: number }) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PAYMENT.CREATE_ORDER}`,
            requestPayload: { userId, amount },
        });

        return res;
    };

    const handleCardPayment = async () => {};

    const getPaymentStatus = async ({ orderId, userId }: { orderId: string; userId: string }) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PAYMENT.GET_PAYMENT_STATUS}`,
            requestPayload: { orderId, userId },
        });

        return res;
    };

    return { initiatePayment, getPaymentStatus };
};

export default usePaymentApi;
