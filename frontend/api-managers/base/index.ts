import Axios from 'axios';

const useApiCall = () => {
    const getApi = async ({ requestUrl, config }: { requestUrl: string; config?: any }) => {
        try {
            const res = await Axios.get(requestUrl, config);

            return res?.data;
        } catch (e: any) {
            return e?.response?.data;
        }
    };

    const postApi = async ({
        requestUrl,
        requestPayload,
        config,
    }: {
        requestUrl: string;
        requestPayload: any;
        config?: any;
    }) => {
        try {
            const res = await Axios.post(requestUrl, requestPayload, config);

            return res?.data;
        } catch (e: any) {
            return e?.response?.data;
        }
    };

    const patchApi = async ({
        requestUrl,
        requestPayload,
        config,
    }: {
        requestUrl: string;
        requestPayload: any;
        config?: any;
    }) => {
        try {
            const res = await Axios.patch(requestUrl, requestPayload, config);

            return res?.data;
        } catch (e: any) {
            return e?.response?.data;
        }
    };

    return { getApi, postApi, patchApi };
};

export default useApiCall;
