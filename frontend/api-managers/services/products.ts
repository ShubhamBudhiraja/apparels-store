import { CART_PRODUCT_OPERATION } from '@enums/products';
import useApiCall from 'api-managers/base';
import API_ENDPOINTS from 'api-managers/endpoints';

const useProductsAPI = () => {
    const { getApi, postApi, patchApi, deleteApi } = useApiCall();

    const getProducts = async (params?: any) => {
        const res = await getApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PRODUCT.GET_ALL_PRODUCTS}`,
            config: { params },
            showErrorPopup: false,
        });

        return res;
    };

    const getRelatedProducts = async ({ productId, categoryId }: { productId?: string; categoryId?: string }) => {
        if (productId && categoryId) {
            const res = await getApi({
                requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PRODUCT.GET_RELATED_PRODUCTS}`,
                config: { params: { prodId: productId, categoryId } },
            });

            return res;
        }
    };

    const getProductDetails = async (productId: string, segment: string) => {
        const res = await getApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PRODUCT.GET_PRODUCT_DETAILS}`,
            config: { params: { prodId: productId, segment } },
        });

        return res;
    };

    const addToCart = async ({
        productId,
        userId,
        variant,
    }: {
        productId: string;
        userId: string;
        variant: string;
    }) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PRODUCT.ADD_TO_CART}`,
            requestPayload: { userId, prodId: productId, variant },
            autoHidePopup: true,
        });

        return res;
    };

    const updateCart = async ({
        productId,
        userId,
        operation,
        variant,
    }: {
        productId: string;
        userId: string;
        operation: CART_PRODUCT_OPERATION;
        variant: string;
    }) => {
        const res = await patchApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PRODUCT.UPDATE_CART}`,
            requestPayload: { userId, prodId: productId, operation, variant },
            autoHidePopup: true,
        });

        return res;
    };

    const removeFromCart = async ({
        productId,
        userId,
        variant,
    }: {
        productId: string;
        userId: string;
        variant: string;
    }) => {
        const res = await deleteApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PRODUCT.REMOVE_FROM_CART}`,
            config: { params: { userId, prodId: productId, variant } },
            autoHidePopup: true,
        });

        return res;
    };

    const addToWishlist = async ({ productId, userId }: { productId: string; userId: string }) => {
        const res = await postApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PRODUCT.ADD_TO_WISHLIST}`,
            requestPayload: { userId, prodId: productId },
            autoHidePopup: true,
        });

        return res;
    };

    const removeFromWishlist = async ({ productId, userId }: { productId: string; userId: string }) => {
        const res = await deleteApi({
            requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PRODUCT.REMOVE_FROM_WISHLIST}`,
            config: { params: { userId, prodId: productId } },
            autoHidePopup: true,
        });

        return res;
    };

    return {
        getProducts,
        getProductDetails,
        addToCart,
        updateCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        getRelatedProducts,
    };
};

export default useProductsAPI;
