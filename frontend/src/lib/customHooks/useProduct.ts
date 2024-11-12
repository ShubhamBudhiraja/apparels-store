import { IProductData } from '@interface/products';
import { useAppDispatch, useAppSelector } from '@store';
import { UserDataActions } from '@store/reducers/userProfileSlice';
import useProductsAPI from 'api-managers/services/products';

const useProduct = () => {
    const { addToCart, addToWishlist, removeFromCart, removeFromWishlist } = useProductsAPI();
    const { cart, wishlist } = useAppSelector((state) => state.userProfile);
    const dispatch = useAppDispatch();

    const handleAddToCart = async ({ userId, product }: { userId?: string; product?: IProductData }) => {
        if (userId && product?.productId) {
            const res = await addToCart({ userId, productId: product.productId });
            if (res?.status) {
                const total = (cart?.total || 0) + (product?.price || 0);
                const cartTotal = (cart?.cartTotal || 0) + (product?.offerPrice || product?.price || 0);
                const products = cart?.products?.length ? [product, ...cart?.products] : [product];
                dispatch(UserDataActions.updateCustomerDetails({ cart: { total, cartTotal, products } }));
            }
        }
    };

    const handleRemoveFromCart = async ({ userId, product }: { userId?: string; product?: IProductData }) => {
        if (userId && product?.productId) {
            const res = await removeFromCart({ userId, productId: product.productId });
            if (res?.status) {
                const total = (cart?.total || 0) - (product?.price || 0);
                const cartTotal = (cart?.cartTotal || 0) - (product?.offerPrice || product?.price || 0);
                const products = cart?.products?.filter((prod: IProductData) => prod.productId !== product.productId);
                dispatch(UserDataActions.updateCustomerDetails({ cart: { total, cartTotal, products } }));
            }
        }
    };

    const handleAddToWishlist = async ({ userId, product }: { userId?: string; product?: IProductData }) => {
        if (userId && product?.productId) {
            const res = await addToWishlist({ userId, productId: product.productId });
            if (res?.status) {
                const products = wishlist?.length ? [product, ...wishlist] : [product];
                dispatch(UserDataActions.updateCustomerDetails({ wishlist: products }));
            }
        }
    };

    const handleRemoveFromWishlist = async ({ userId, product }: { userId?: string; product?: IProductData }) => {
        if (userId && product?.productId) {
            const res = await removeFromWishlist({ userId, productId: product.productId });
            if (res?.status) {
                const products = wishlist?.filter((prod: IProductData) => prod.productId !== product.productId);
                dispatch(UserDataActions.updateCustomerDetails({ wishlist: products }));
            }
        }
    };

    return { handleAddToCart, handleRemoveFromCart, handleAddToWishlist, handleRemoveFromWishlist };
};

export default useProduct;
