import { CART_PRODUCT_OPERATION } from '@enums/products';
import { IProductData } from '@interface/products';
import { useAppDispatch, useAppSelector } from '@store';
import { UserDataActions } from '@store/reducers/userProfileSlice';
import useProductsAPI from 'api-managers/services/products';

const useProduct = () => {
    const { addToCart, addToWishlist, removeFromCart, removeFromWishlist, updateCart } = useProductsAPI();
    const { cart, wishlist } = useAppSelector((state) => state.userProfile);
    const dispatch = useAppDispatch();

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
                const total = (cart?.total || 0) + (product?.price || 0);
                const cartTotal = (cart?.cartTotal || 0) + (product?.offerPrice || product?.price || 0);
                const discount = cart.discount + (product?.discountAmount || 0);
                const products = cart?.products?.length
                    ? [{ ...product, quantity: 1, selectedVariant }, ...cart?.products]
                    : [{ ...product, quantity: 1, selectedVariant }];
                dispatch(UserDataActions.updateCustomerDetails({ cart: { total, cartTotal, products, discount } }));
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
            const res = await updateCart({ productId: product.productId, userId, operation, variant: selectedVariant });

            if (res?.status) {
                let [total, cartTotal, products, discount]: any = [0, 0, [], cart.discount];
                switch (operation) {
                    case CART_PRODUCT_OPERATION.INCREASE:
                        total = cart?.total + product?.price;
                        cartTotal = cart?.cartTotal + (product?.offerPrice || product?.price || 0);

                        products = cart?.products?.map((prod: IProductData) => {
                            const temp = { ...prod };
                            if (temp?.productId === product?.productId && temp?.selectedVariant === selectedVariant) {
                                temp.quantity = temp.quantity + 1;
                                discount += temp?.discountAmount || 0;
                            }
                            return temp;
                        });
                        dispatch(
                            UserDataActions.updateCustomerDetails({ cart: { total, cartTotal, discount, products } })
                        );
                        break;
                    case CART_PRODUCT_OPERATION.DECREASE:
                        total = cart?.total - product?.price;
                        cartTotal = cart?.cartTotal - (product?.offerPrice || product?.price);
                        cart?.products?.forEach((prod: IProductData) => {
                            const temp = { ...prod };
                            if (temp?.productId === product?.productId && temp?.selectedVariant === selectedVariant) {
                                temp.quantity = (temp.quantity || 0) - 1;
                                discount -= temp?.discountAmount || 0;
                            }
                            if (temp.quantity !== 0) return products.push(temp);
                        });
                        dispatch(
                            UserDataActions.updateCustomerDetails({ cart: { total, cartTotal, discount, products } })
                        );
                    default:
                        break;
                }
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
            const res = await removeFromCart({ userId, productId: product.productId, variant: selectedVariant });
            if (res?.status) {
                const foundProduct = cart?.products?.find(
                    (prod: IProductData) =>
                        prod.productId === product.productId && prod?.selectedVariant === selectedVariant
                );
                if (foundProduct) {
                    const total = cart?.total - foundProduct.quantity * (product?.price || 0);
                    const cartTotal =
                        cart?.cartTotal - foundProduct?.quantity * (product?.offerPrice || product?.price);
                    const discount = cart.discount - foundProduct?.quantity * (foundProduct?.discountAmount || 0);
                    const products = cart?.products?.filter((prod: IProductData) => {
                        if (prod.productId === product.productId) {
                            if (prod?.selectedVariant === selectedVariant) return false;
                        }
                        return true;
                    });
                    dispatch(UserDataActions.updateCustomerDetails({ cart: { total, cartTotal, products, discount } }));
                }
            }
        }
    };

    const handleAddToWishlist = async ({ userId, product }: { userId?: string; product?: IProductData }) => {
        if (userId && product?.productId) {
            const res = await addToWishlist({ userId, productId: product.productId });
            if (res?.status) {
                const products = wishlist?.length ? [product, ...wishlist] : [product];
                const cartProducts = cart?.products?.map((prod: IProductData) => {
                    if (prod?.productId === product?.productId) return { ...prod, inWishlist: true };
                    return prod;
                });
                dispatch(
                    UserDataActions.updateCustomerDetails({
                        wishlist: products,
                        cart: { ...cart, products: cartProducts },
                    })
                );
            }
        }
    };

    const handleRemoveFromWishlist = async ({ userId, product }: { userId?: string; product?: IProductData }) => {
        if (userId && product?.productId) {
            const res = await removeFromWishlist({ userId, productId: product.productId });
            if (res?.status) {
                const products = wishlist?.filter((prod: IProductData) => prod.productId !== product.productId);
                const cartProducts = cart?.products?.map((prod: IProductData) => {
                    if (prod?.productId === product?.productId) {
                        const temp = { ...prod };
                        temp.inWishlist = false;
                        return temp;
                    }
                    return prod;
                });
                dispatch(
                    UserDataActions.updateCustomerDetails({
                        wishlist: products,
                        cart: { ...cart, products: cartProducts },
                    })
                );
            }
        }
    };

    return { handleAddToCart, handleUpdateCart, handleRemoveFromCart, handleAddToWishlist, handleRemoveFromWishlist };
};

export default useProduct;
