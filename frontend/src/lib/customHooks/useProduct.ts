import { CART_PRODUCT_OPERATION } from '@enums/products';
import { IProductData } from '@interface/products';
import useProfile from '@customHooks/useProfile';
import useProductsAPI from 'api-managers/services/products';

const useProduct = () => {
    const { addToCart, addToWishlist, removeFromCart, removeFromWishlist, updateCart } = useProductsAPI();
    const { refreshProfile } = useProfile();

    const handleAddToCart = async ({
        userId,
        product,
        selectedVariant = 'default',
    }: {
        userId?: string;
        product?: IProductData;
        selectedVariant?: string;
    }) => {
        if (userId && product?.productId) {
            const res = await addToCart({
                userId,
                productId: product.productId,
                variant: selectedVariant,
            });

            if (res?.status) {
                await refreshProfile(userId);
                return;
            }

            // Already in cart for this variant — increase quantity instead
            if (res?.responseCode === 4005) {
                await handleUpdateCart({
                    userId,
                    product,
                    selectedVariant,
                    operation: CART_PRODUCT_OPERATION.INCREASE,
                });
            }
        }
    };

    const handleUpdateCart = async ({
        userId,
        product,
        selectedVariant = 'default',
        operation,
    }: {
        userId?: string;
        product?: IProductData;
        selectedVariant?: string;
        operation: CART_PRODUCT_OPERATION;
    }) => {
        if (userId && product?.productId) {
            const res = await updateCart({
                productId: product.productId,
                userId,
                operation,
                variant: selectedVariant,
            });

            if (res?.status) {
                await refreshProfile(userId);
            }
        }
    };

    const handleRemoveFromCart = async ({
        userId,
        product,
        selectedVariant = 'default',
    }: {
        userId?: string;
        product?: IProductData;
        selectedVariant?: string;
    }) => {
        if (userId && product?.productId) {
            const res = await removeFromCart({
                userId,
                productId: product.productId,
                variant: selectedVariant,
            });

            if (res?.status) {
                await refreshProfile(userId);
            }
        }
    };

    const handleAddToWishlist = async ({ userId, product }: { userId?: string; product?: IProductData }) => {
        if (userId && product?.productId) {
            const res = await addToWishlist({ userId, productId: product.productId });

            if (res?.status) {
                await refreshProfile(userId);
            }
        }
    };

    const handleRemoveFromWishlist = async ({ userId, product }: { userId?: string; product?: IProductData }) => {
        if (userId && product?.productId) {
            const res = await removeFromWishlist({ userId, productId: product.productId });

            if (res?.status) {
                await refreshProfile(userId);
            }
        }
    };

    return {
        handleAddToCart,
        handleUpdateCart,
        handleRemoveFromCart,
        handleAddToWishlist,
        handleRemoveFromWishlist,
    };
};

export default useProduct;
