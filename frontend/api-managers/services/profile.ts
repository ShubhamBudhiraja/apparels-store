import { IUserAddress } from '@interface/user';
import useApiCall from 'api-managers/base';
import API_ENDPOINTS from 'api-managers/endpoints';

const ProfileAPIServices = () => {
    const { getApi, postApi, patchApi, deleteApi } = useApiCall();

    const getProfileData = async ({ userId }: { userId: string }) => {
        const res = await getApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.USER.GET_PROFILE}`,
            headers: { params: { userId } },
        });

        return res;
    };

    const updateProfileData = async (payload: {
        userId?: string;
        firstName?: string;
        lastName?: string;
        mobileNo?: string;
        dob?: Date;
    }) => {
        const res = await patchApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.USER.UPDATE_PROFILE}`,
            requestPayload: payload,
        });

        return res;
    };

    const addAddress = async (payload: { userId?: string; address: IUserAddress }) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.USER.ADD_ADDRESS}`,
            requestPayload: payload,
        });

        return res;
    };

    const updateAddress = async ({ userId, addressId, ...rest }: { userId: string; addressId: string }) => {
        const res = await patchApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.USER.UPDATE_ADDRESS}`,
            requestPayload: { userId, addressId, ...rest },
        });

        return res;
    };

    const deleteAddress = async ({ userId, addressId }: { userId: string; addressId: string }) => {
        const res = await deleteApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.USER.DELETE_ADDRESS}`,
            headers: { params: { userId, addressId } },
        });

        return res;
    };

    return { getProfileData, updateProfileData, addAddress, updateAddress, deleteAddress };
};

export default ProfileAPIServices;
