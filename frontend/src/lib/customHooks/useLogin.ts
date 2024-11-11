import useProfileApi from 'api-managers/services/profile';
import { useAppDispatch } from '../store';
import { LoginModalActions } from '../store/reducers/loginModalSlice';
import { STORAGE_KEY, STORAGE_TYPE } from '@enums/storage';
import { UserDataActions } from '../store/reducers/userProfileSlice';
import { setStorageItem } from '@utils/storage';
import { ILoginModalSuccess } from '../interface/user';

const useLogin = () => {
    const dispatch = useAppDispatch();
    const { getProfileData } = useProfileApi();

    const initiateLogin = ({ successCallback }: { successCallback?: (data?: ILoginModalSuccess) => void }) => {
        dispatch(LoginModalActions.updateModalState({ show: true, onSuccess: successCallback }));
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
        }
    };

    return { initiateLogin, storeUser };
};

export default useLogin;
