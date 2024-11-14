import { IUserData } from '@interface/user';
import useApiCall from 'api-managers/base';
import API_ENDPOINTS from 'api-managers/endpoints';

const useProfileApi = () => {
    const { getApi, patchApi } = useApiCall();

    const getProfileData = async ({ userId }: { userId: string }) => {
        const res = await getApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.USER.GET_PROFILE}`,
            config: { params: { userId } },
        });

        return res;
    };

    const updateProfileData = async (payload: IUserData) => {
        const res = await patchApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.USER.GET_PROFILE}`,
            requestPayload: payload,
        });

        return res;
    };

    return { getProfileData, updateProfileData };
};

export default useProfileApi;
