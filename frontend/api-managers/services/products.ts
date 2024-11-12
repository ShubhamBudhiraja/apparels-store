import { CART_PRODUCT_OPERATION } from '@enums/products';
import useApiCall from 'api-managers/base';
import API_ENDPOINTS from 'api-managers/endpoints';

const useProductsAPI = () => {
    const { getApi, postApi, patchApi, deleteApi } = useApiCall();

    const getProducts = async (params?: any) => {
        try {
            const res = await getApi({
                requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PRODUCT.GET_ALL_PRODUCTS}`,
                config: { params },
            });

            return res;
        } catch (e) {
            return false;
        }
    };

    const addToCart = async ({ productId, userId }: { productId: string; userId: string }) => {
        try {
            const res = await postApi({
                requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PRODUCT.ADD_TO_CART}`,
                requestPayload: { userId, prodId: productId },
            });

            return res;
        } catch (e) {
            return false;
        }
    };

    const updateCart = async ({
        productId,
        userId,
        operation,
    }: {
        productId: string;
        userId: string;
        operation: CART_PRODUCT_OPERATION;
    }) => {
        try {
            const res = await patchApi({
                requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PRODUCT.UPDATE_CART}`,
                requestPayload: { userId, prodId: productId, operation },
            });

            return res;
        } catch (e) {
            return false;
        }
    };

    const removeFromCart = async ({ productId, userId }: { productId: string; userId: string }) => {
        try {
            const res = await deleteApi({
                requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PRODUCT.REMOVE_FROM_CART}`,
                config: { params: { userId, prodId: productId } },
            });

            return res;
        } catch (e) {
            return false;
        }
    };

    const addToWishlist = async ({ productId, userId }: { productId: string; userId: string }) => {
        try {
            const res = await postApi({
                requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PRODUCT.ADD_TO_WISHLIST}`,
                requestPayload: { userId, prodId: productId },
            });

            return res;
        } catch (e) {
            return false;
        }
    };

    const removeFromWishlist = async ({ productId, userId }: { productId: string; userId: string }) => {
        try {
            const res = await deleteApi({
                requestUrl: `${process.env.NEXT_PUBLIC_EXPRESS_BASE_URL}${API_ENDPOINTS.PRODUCT.REMOVE_FROM_WISHLIST}`,
                config: { params: { userId, prodId: productId } },
            });

            return res;
        } catch (e) {
            return false;
        }
    };

    return { getProducts, addToCart, updateCart, removeFromCart, addToWishlist, removeFromWishlist };
};

export default useProductsAPI;
