import useGlobalHooks from '@customHooks/useGlobalHooks';
import Axios from 'axios';

const useApiCall = () => {
    const { handleAPIResponse } = useGlobalHooks();
    const getApi = async ({
        requestUrl,
        headers,
        showErrorPopup = true,
        autoHidePopup = false,
    }: {
        requestUrl: string;
        headers?: any;
        showErrorPopup?: boolean;
        autoHidePopup?: boolean;
    }) => {
        try {
            const res = await Axios.get(requestUrl, headers);

            return handleAPIResponse(showErrorPopup, res, autoHidePopup);
        } catch (e: any) {
            return handleAPIResponse(showErrorPopup, e?.response, autoHidePopup);
        }
    };

    const postApi = async ({
        requestUrl,
        requestPayload,
        headers,
        showErrorPopup = true,
        autoHidePopup = false,
    }: {
        requestUrl: string;
        requestPayload: any;
        headers?: any;
        showErrorPopup?: boolean;
        autoHidePopup?: boolean;
    }) => {
        try {
            const res = await Axios.post(requestUrl, requestPayload, headers);

            return handleAPIResponse(showErrorPopup, res, autoHidePopup);
        } catch (e: any) {
            return handleAPIResponse(showErrorPopup, e?.response, autoHidePopup);
        }
    };

    const patchApi = async ({
        requestUrl,
        requestPayload,
        headers,
        showErrorPopup = true,
        autoHidePopup = false,
    }: {
        requestUrl: string;
        requestPayload: any;
        headers?: any;
        showErrorPopup?: boolean;
        autoHidePopup?: boolean;
    }) => {
        try {
            const res = await Axios.patch(requestUrl, requestPayload, headers);

            return handleAPIResponse(showErrorPopup, res, autoHidePopup);
        } catch (e: any) {
            return handleAPIResponse(showErrorPopup, e?.response, autoHidePopup);
        }
    };

    const deleteApi = async ({
        requestUrl,
        headers,
        showErrorPopup = true,
        autoHidePopup = false,
    }: {
        requestUrl: string;
        headers?: any;
        showErrorPopup?: boolean;
        autoHidePopup?: boolean;
    }) => {
        try {
            const res = await Axios.delete(requestUrl, headers);

            return handleAPIResponse(showErrorPopup, res, autoHidePopup);
        } catch (e: any) {
            return handleAPIResponse(showErrorPopup, e?.response, autoHidePopup);
        }
    };

    return { getApi, postApi, patchApi, deleteApi };
};

export default useApiCall;
