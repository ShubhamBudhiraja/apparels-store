import useGlobalHooks from '@customHooks/useGlobalHooks';
import { STORAGE_KEY, STORAGE_TYPE } from '@enums/storage';
import { getStorageItem } from '@utils/storage';
import Axios, { AxiosRequestConfig } from 'axios';

const getAuthHeaders = (headers?: AxiosRequestConfig) => {
    const token = getStorageItem({
        key: STORAGE_KEY.ACCESS_TOKEN,
        storageType: STORAGE_TYPE.COOKIE,
    });

    if (!token) return headers;

    return {
        ...headers,
        headers: {
            ...(headers?.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    };
};

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
            const res = await Axios.get(requestUrl, getAuthHeaders(headers));

            return res?.data;
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
            const res = await Axios.post(requestUrl, requestPayload, getAuthHeaders(headers));

            return res?.data;
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
            const res = await Axios.patch(requestUrl, requestPayload, getAuthHeaders(headers));

            return res?.data;
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
            const res = await Axios.delete(requestUrl, getAuthHeaders(headers));

            return res?.data;
        } catch (e: any) {
            return handleAPIResponse(showErrorPopup, e?.response, autoHidePopup);
        }
    };

    return { getApi, postApi, patchApi, deleteApi };
};

export default useApiCall;
