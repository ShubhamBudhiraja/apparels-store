import useApiCall from 'api-managers/base';
import API_ENDPOINTS from 'api-managers/endpoints';

const ordersApiHandler = () => {
    const { getApi, postApi } = useApiCall();

    const getOrdersList = async (userId: string, pageNumber: number, limit = 1) => {
        const res = await getApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.ORDERS.GET_ORDERS}`,
            headers: { params: { userId, pageNumber, limit } },
        });

        return res;
    };

    const getOrderDetails = async (orderId: string, userId: string) => {
        const res = await getApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.ORDERS.GET_ORDER_DETAILS}`,
            headers: { params: { userId, orderId } },
        });

        return res;
    };

    const submitOrderFeedback = async (payload: {
        userId: string;
        orderId: string;
        rating: number;
        description?: string;
    }) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.ORDERS.SUBMIT_ORDER_FEEDBACK}`,
            requestPayload: payload,
        });

        return res;
    };

    return { getOrdersList, getOrderDetails, submitOrderFeedback };
};

export default ordersApiHandler;
