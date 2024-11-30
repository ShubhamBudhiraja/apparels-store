import useApiCall from 'api-managers/base';
import API_ENDPOINTS from 'api-managers/endpoints';

const usePaymentApi = () => {
    const { postApi } = useApiCall();

    const createCheckoutSession = async (payload: any) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PAYMENT.CREATE_CHECKOUT_SESSION}`,
            requestPayload: payload,
        });

        return res;
    };

    const completePayment = async ({ userId, addressId }: { userId: string; addressId: string }) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PAYMENT.COMPLETE_PAYMENT}`,
            requestPayload: { userId, addressId },
        });

        return res;
    };

    return { createCheckoutSession, completePayment };
};

export default usePaymentApi;
