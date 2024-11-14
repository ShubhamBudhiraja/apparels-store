import useProfileApi from 'api-managers/services/profile';
import { STORAGE_KEY, STORAGE_TYPE } from '@enums/storage';
import { removeStorageItem, setStorageItem } from '@utils/storage';
import { useAppDispatch } from '@store';
import { ILoginModalSuccess } from '@interface/user';
import { LoginModalActions } from '@store/reducers/loginModalSlice';
import { UserDataActions } from '@store/reducers/userProfileSlice';

const useLogin = () => {
    const dispatch = useAppDispatch();
    const { getProfileData } = useProfileApi();

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
            dispatch(UserDataActions.updateCustomerDetails(profileRes?.responseBody));
            return true;
        } else {
            removeStorageItem({ key: STORAGE_KEY.USERID, storageType: STORAGE_TYPE.COOKIE });
            return false;
        }
    };

    const handleLogout = () => {
        removeStorageItem({ key: STORAGE_KEY.USERID, storageType: STORAGE_TYPE.COOKIE });
        window.location.reload();
    };

    return { initiateLogin, storeUser, handleLogout };
};

export default useLogin;
