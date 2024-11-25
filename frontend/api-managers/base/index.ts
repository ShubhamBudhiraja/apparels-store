import useGlobalHooks from '@customHooks/useGlobalHooks';
import Axios from 'axios';

const useApiCall = () => {
    const { handleAPIResponse } = useGlobalHooks();
    const getApi = async ({
        requestUrl,
        config,
        showErrorPopup = true,
        autoHidePopup = false,
    }: {
        requestUrl: string;
        config?: any;
        showErrorPopup?: boolean;
        autoHidePopup?: boolean;
    }) => {
        try {
            const res = await Axios.get(requestUrl, config);

            return res?.data;
        } catch (e: any) {
            return handleAPIResponse(showErrorPopup, e?.response, autoHidePopup);
        }
    };

    const postApi = async ({
        requestUrl,
        requestPayload,
        config,
        showErrorPopup = true,
        autoHidePopup = false,
    }: {
        requestUrl: string;
        requestPayload: any;
        config?: any;
        showErrorPopup?: boolean;
        autoHidePopup?: boolean;
    }) => {
        try {
            const res = await Axios.post(requestUrl, requestPayload, config);

            return res?.data;
        } catch (e: any) {
            return handleAPIResponse(showErrorPopup, e?.response, autoHidePopup);
        }
    };

    const patchApi = async ({
        requestUrl,
        requestPayload,
        config,
        showErrorPopup = true,
        autoHidePopup = false,
    }: {
        requestUrl: string;
        requestPayload: any;
        config?: any;
        showErrorPopup?: boolean;
        autoHidePopup?: boolean;
    }) => {
        try {
            const res = await Axios.patch(requestUrl, requestPayload, config);

            return res?.data;
        } catch (e: any) {
            return handleAPIResponse(showErrorPopup, e?.response, autoHidePopup);
        }
    };

    const deleteApi = async ({
        requestUrl,
        config,
        showErrorPopup = true,
        autoHidePopup = false,
    }: {
        requestUrl: string;
        config?: any;
        showErrorPopup?: boolean;
        autoHidePopup?: boolean;
    }) => {
        try {
            const res = await Axios.delete(requestUrl, config);

            return res?.data;
        } catch (e: any) {
            return handleAPIResponse(showErrorPopup, e?.response, autoHidePopup);
        }
    };

    return { getApi, postApi, patchApi, deleteApi };
};

export default useApiCall;
