import useApiCall from 'api-managers/base';
import API_ENDPOINTS from 'api-managers/endpoints';

export interface ICategoryChild {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    sortOrder: number;
    isActive: boolean;
}

export interface ICategoryNode extends ICategoryChild {
    children: ICategoryChild[];
}

const useCategoriesAPI = () => {
    const { getApi } = useApiCall();

    const getCategoryTree = async () => {
        const res = await getApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.CATEGORIES.TREE}`,
            showErrorPopup: false,
        });

        return res;
    };

    return { getCategoryTree };
};

export default useCategoriesAPI;
