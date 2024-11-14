import useGlobalHooks from '@customHooks/useGlobalHooks';
import Axios from 'axios';

const useApiCall = () => {
    const { handleAPIResponse } = useGlobalHooks();
    const getApi = async ({
        requestUrl,
        config,
        showErrorPopup = true,
    }: {
        requestUrl: string;
        config?: any;
        showErrorPopup?: boolean;
    }) => {
        try {
            const res = await Axios.get(requestUrl, config);

            return res?.data;
        } catch (e: any) {
            return handleAPIResponse(showErrorPopup, e?.response);
        }
    };

    const postApi = async ({
        requestUrl,
        requestPayload,
        config,
        showErrorPopup = true,
    }: {
        requestUrl: string;
        requestPayload: any;
        config?: any;
        showErrorPopup?: boolean;
    }) => {
        try {
            const res = await Axios.post(requestUrl, requestPayload, config);

            return res?.data;
        } catch (e: any) {
            return handleAPIResponse(showErrorPopup, e?.response);
        }
    };

    const patchApi = async ({
        requestUrl,
        requestPayload,
        config,
        showErrorPopup = true,
    }: {
        requestUrl: string;
        requestPayload: any;
        config?: any;
        showErrorPopup?: boolean;
    }) => {
        try {
            const res = await Axios.patch(requestUrl, requestPayload, config);

            return res?.data;
        } catch (e: any) {
            return handleAPIResponse(showErrorPopup, e?.response);
        }
    };

    const deleteApi = async ({
        requestUrl,
        config,
        showErrorPopup = true,
    }: {
        requestUrl: string;
        config?: any;
        showErrorPopup?: boolean;
    }) => {
        try {
            const res = await Axios.delete(requestUrl, config);

            return res?.data;
        } catch (e: any) {
            return handleAPIResponse(showErrorPopup, e?.response);
        }
    };

    return { getApi, postApi, patchApi, deleteApi };
};

export default useApiCall;
