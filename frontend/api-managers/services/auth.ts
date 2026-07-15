import useApiCall from 'api-managers/base';
import API_ENDPOINTS from 'api-managers/endpoints';
import { IAuthTokenResponse } from '@interface/user';

const useAuthApi = () => {
    const { postApi, patchApi } = useApiCall();

    const login = async (payload: { userId: string; password: string }) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
            requestPayload: payload,
        });

        return res as
            | {
                  status: boolean;
                  responseBody?: IAuthTokenResponse;
              }
            | undefined;
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

    const forgotPassword = async (payload: { userId: string }) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`,
            requestPayload: payload,
        });

        return res;
    };

    const updatePassword = async (payload: { userId: string; password: string }) => {
        const res = await patchApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.AUTH.UPDATE_PASSWORD}`,
            requestPayload: payload,
        });

        return res;
    };

    return { login, signUp, validateOtp, forgotPassword, updatePassword };
};

export default useAuthApi;
