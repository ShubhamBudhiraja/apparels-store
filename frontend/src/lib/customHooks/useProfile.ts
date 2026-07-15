import useProfileApi from 'api-managers/services/profile';
import { STORAGE_KEY, STORAGE_TYPE } from '@enums/storage';
import { removeStorageItem, setStorageItem } from '@utils/storage';
import { useAppDispatch } from '@store';
import { ILoginModalSuccess, IUserAddress } from '@interface/user';
import { LoginModalActions } from '@store/reducers/loginModalSlice';
import { UserDataActions } from '@store/reducers/userProfileSlice';

const useProfile = () => {
    const dispatch = useAppDispatch();
    const { getProfileData, addAddress, updateAddress, deleteAddress, updateProfileData } = useProfileApi();

    const initiateLogin = (loginProps?: { successCallback?: (data?: ILoginModalSuccess) => void }) => {
        dispatch(LoginModalActions.updateModalState({ show: true, onSuccess: loginProps?.successCallback }));
    };

    const persistAccessToken = (token?: string) => {
        if (!token) return;

        setStorageItem({
            key: STORAGE_KEY.ACCESS_TOKEN,
            value: token,
            storageType: STORAGE_TYPE.COOKIE,
        });
    };

    const storeUser = async ({ userId, token }: { userId: string; token?: string }) => {
        if (token) persistAccessToken(token);

        const profileRes = await getProfileData({ userId });

        if (profileRes?.status) {
            setStorageItem({
                key: STORAGE_KEY.USERID,
                value: userId,
                storageType: STORAGE_TYPE.COOKIE,
            });

            const addresses = profileRes?.responseBody?.addresses || [];
            const selectedAddress =
                addresses.find((address: IUserAddress) => address.isDefault)?._id || addresses[0]?._id;

            dispatch(
                UserDataActions.updateCustomerDetails({
                    ...profileRes?.responseBody,
                    userId: profileRes?.responseBody?.userId || userId,
                    emailId: profileRes?.responseBody?.emailId || userId,
                    selectedAddress,
                })
            );
            return true;
        }

        removeStorageItem({ key: STORAGE_KEY.USERID, storageType: STORAGE_TYPE.COOKIE });
        removeStorageItem({ key: STORAGE_KEY.ACCESS_TOKEN, storageType: STORAGE_TYPE.COOKIE });
        return false;
    };

    const refreshProfile = async (userId?: string) => {
        if (!userId) return false;
        return storeUser({ userId });
    };

    const handleUpdateProfile = async (
        userId: string,
        valuesToUpdate: {
            firstName?: string;
            lastName?: string;
            mobileNo?: string;
            dob?: Date;
        }
    ) => {
        const res = await updateProfileData({ userId, ...valuesToUpdate });

        if (res?.status) {
            dispatch(UserDataActions.updateCustomerDetails({ ...valuesToUpdate }));
        }

        return res;
    };

    const handleLogout = () => {
        removeStorageItem({ key: STORAGE_KEY.USERID, storageType: STORAGE_TYPE.COOKIE });
        removeStorageItem({ key: STORAGE_KEY.ACCESS_TOKEN, storageType: STORAGE_TYPE.COOKIE });
        dispatch(UserDataActions.resetProfile());
        window.location.reload();
    };

    const handleAddAddress = async ({ userId, address }: { userId: string; address: IUserAddress }) => {
        const res = await addAddress({ userId, address });

        if (res?.status && res?.responseBody?.addressId) {
            dispatch(UserDataActions.addAddress({ _id: res.responseBody.addressId, ...address }));

            return res;
        }
    };

    const handleUpdateAddress = async ({
        userId,
        addressId,
        valuesToUpdate,
    }: {
        userId: string;
        addressId: string;
        valuesToUpdate: IUserAddress;
    }) => {
        const res = await updateAddress({ userId, addressId, ...valuesToUpdate });

        if (res?.status) {
            dispatch(UserDataActions.updateAddress({ _id: addressId, ...valuesToUpdate }));

            return res;
        }
    };

    const handleDeleteAddress = async ({ userId, addressId }: { userId: string; addressId: string }) => {
        const res = await deleteAddress({ userId, addressId });

        if (res?.status) {
            dispatch(UserDataActions.deleteAddress({ addressId }));

            return res;
        }
    };

    return {
        initiateLogin,
        storeUser,
        refreshProfile,
        handleUpdateProfile,
        handleLogout,
        handleAddAddress,
        handleUpdateAddress,
        handleDeleteAddress,
    };
};

export default useProfile;
