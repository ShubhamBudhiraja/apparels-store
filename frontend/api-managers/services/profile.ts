import useApiCall from 'api-managers/base';
import API_ENDPOINTS from 'api-managers/endpoints';
import { IUserData } from 'src/lib/interface/user';

const useProfileApi = () => {
    const { getApi, patchApi } = useApiCall();

    const getProfileData = async ({ email }: { email: string }) => {
        try {
            const res = await getApi({
                requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.USER.GET_PROFILE}`,
                config: { params: { email } },
            });

            return res;
        } catch (e) {
            return null;
        }
    };

    const updateProfileData = async (payload: IUserData) => {
        try {
            const res = await patchApi({
                requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.USER.GET_PROFILE}`,
                requestPayload: payload,
            });

            return res;
        } catch (e) {
            return null;
        }
    };

    return { getProfileData, updateProfileData };
};

export default useProfileApi;
