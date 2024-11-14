import { useAppDispatch } from '@store';
import { ToastActions } from '@store/reducers/toastSlice';
import { useContext } from 'react';
import { LayoutContextData } from '../context/layout';

const useGlobalHooks = () => {
    const dispatch = useAppDispatch();
    const { dictionary } = useContext(LayoutContextData);

    const handleError = () => {};

    const handleAPIResponse = (showErrorPopup: boolean, res?: any) => {
        if (!res?.data?.status && showErrorPopup) {
            const toastDescription = res?.data?.message || dictionary?.unknownErroMsg;
            dispatch(ToastActions.updateToastState({ show: true, description: toastDescription }));
            return false;
        } else return res?.data;
    };

    return { handleAPIResponse };
};

export default useGlobalHooks;
