import useProfileApi from 'api-managers/services/profile';
import { STORAGE_KEY, STORAGE_TYPE } from '@enums/storage';
import { removeStorageItem, setStorageItem } from '@utils/storage';
import { useAppDispatch } from '@store';
import { ILoginModalSuccess, IUserAddress, IUserData } from '@interface/user';
import { LoginModalActions } from '@store/reducers/loginModalSlice';
import { UserDataActions } from '@store/reducers/userProfileSlice';

const useProfile = () => {
    const dispatch = useAppDispatch();
    const { getProfileData, addAddress, updateAddress, deleteAddress, updateProfileData } = useProfileApi();

    const initiateLogin = (loginProps?: { successCallback?: (data?: ILoginModalSuccess) => void }) => {
        dispatch(LoginModalActions.updateModalState({ show: true, onSuccess: loginProps?.successCallback }));
    };

    const storeUser = async ({ userId }: { userId: string }) => {
        const profileRes = await getProfileData({ userId });

        if (profileRes?.status) {
            setStorageItem({
                key: STORAGE_KEY.USERID,
                value: userId,
                storageType: STORAGE_TYPE.COOKIE,
            });

            const selectedAddress = profileRes?.responseBody?.addresses?.length
                ? profileRes?.responseBody?.addresses?.[0]?._id
                : undefined;

            dispatch(UserDataActions.updateCustomerDetails({ ...profileRes?.responseBody, selectedAddress }));
            return true;
        } else {
            removeStorageItem({ key: STORAGE_KEY.USERID, storageType: STORAGE_TYPE.COOKIE });
            return false;
        }
    };

    const handleUpdateProfile = async (userId: string, valuesToUpdate: IUserData) => {
        const res = await updateProfileData({ userId, ...valuesToUpdate });

        if (res?.status) {
            dispatch(UserDataActions.updateCustomerDetails({ ...valuesToUpdate }));
        }
    };

    const handleLogout = () => {
        removeStorageItem({ key: STORAGE_KEY.USERID, storageType: STORAGE_TYPE.COOKIE });
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
        handleUpdateProfile,
        handleLogout,
        handleAddAddress,
        handleUpdateAddress,
        handleDeleteAddress,
    };
};

export default useProfile;
