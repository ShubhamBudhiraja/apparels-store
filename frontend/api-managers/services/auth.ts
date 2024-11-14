import useApiCall from 'api-managers/base';
import API_ENDPOINTS from 'api-managers/endpoints';

const useAuthApi = () => {
    const { postApi } = useApiCall();

    const login = async (payload: { userId: string; password: string }) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
            requestPayload: payload,
        });

        return res;
    };

    const signUp = async (payload: { userId: string; password: string }) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
            requestPayload: payload,
        });

        return res;
    };

    const validateOtp = async (payload: { userId: string; otp: string; screenType?: string }) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.AUTH.VALIDATE_OTP}`,
            requestPayload: payload,
            showErrorPopup: false,
        });

        return res;
    };

    return { login, signUp, validateOtp };
};

export default useAuthApi;
