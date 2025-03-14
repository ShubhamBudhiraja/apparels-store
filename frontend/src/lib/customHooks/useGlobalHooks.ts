import { useAppDispatch } from '@store';
import { ToastActions } from '@store/reducers/toastSlice';
import { useContext } from 'react';
import { LayoutContextData } from '../context/layout';

const useGlobalHooks = () => {
    const dispatch = useAppDispatch();
    const { dictionary } = useContext(LayoutContextData);

    const handleAPIResponse = (showErrorPopup: boolean, res?: any, autohide = false) => {
        if (res?.data?.status) return res?.data;
        else if (showErrorPopup) {
            const toastDescription = res?.data?.message || dictionary?.unknownErroMsg;
            dispatch(ToastActions.updateToastState({ show: true, description: toastDescription, autohide }));
            return false;
        }
    };

    return { handleAPIResponse };
};

export default useGlobalHooks;
