import { CART_PRODUCT_OPERATION } from '@enums/products';
import { IProductData } from '@interface/products';
import { useAppDispatch, useAppSelector } from '@store';
import { UserDataActions } from '@store/reducers/userProfileSlice';
import useProductsAPI from 'api-managers/services/products';
import { BILLING_DETAILS } from '../constants/product';

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
                const cartTotal = cart?.cartTotal + (product?.offerPrice || product?.price);
                let total = cart?.total + (product?.offerPrice || product?.price);
                let isDeliveryFeeIncluded = cart.isDeliveryFeeIncluded;
                if (isDeliveryFeeIncluded) {
                    if (cartTotal > BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                        total -= BILLING_DETAILS.DELIVERY_FEE;
                        isDeliveryFeeIncluded = false;
                    }
                } else {
                    if (cartTotal < BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                        total += BILLING_DETAILS.DELIVERY_FEE;
                        isDeliveryFeeIncluded = true;
                    }
                }
                const products = cart?.products?.length
                    ? [{ ...product, quantity: 1, selectedVariant }, ...cart?.products]
                    : [{ ...product, quantity: 1, selectedVariant }];
                dispatch(UserDataActions.updateCart({ total, cartTotal, products, isDeliveryFeeIncluded }));
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
                let [total, cartTotal, products, isDeliveryFeeIncluded]: any = [0, 0, [], cart.isDeliveryFeeIncluded];
                switch (operation) {
                    case CART_PRODUCT_OPERATION.INCREASE:
                        total = cart?.total + (product?.offerPrice || product?.price);
                        cartTotal = cart?.cartTotal + (product?.offerPrice || product?.price);

                        if (isDeliveryFeeIncluded) {
                            if (cartTotal > BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                                total -= BILLING_DETAILS.DELIVERY_FEE;
                                isDeliveryFeeIncluded = false;
                            }
                        } else {
                            if (cartTotal < BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                                total += BILLING_DETAILS.DELIVERY_FEE;
                                isDeliveryFeeIncluded = true;
                            }
                        }

                        products = cart?.products?.map((prod: IProductData) => {
                            const temp = { ...prod };
                            if (temp?.productId === product?.productId && temp?.selectedVariant === selectedVariant) {
                                temp.quantity = temp.quantity + 1;
                            }
                            return temp;
                        });

                        break;
                    case CART_PRODUCT_OPERATION.DECREASE:
                        total = cart?.total - (product?.offerPrice || product?.price);
                        cartTotal = cart?.cartTotal - (product?.offerPrice || product?.price);

                        if (cartTotal > 0) {
                            if (isDeliveryFeeIncluded) {
                                if (cartTotal > BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                                    total -= BILLING_DETAILS.DELIVERY_FEE;
                                    isDeliveryFeeIncluded = false;
                                }
                            } else {
                                if (cartTotal < BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                                    total += BILLING_DETAILS.DELIVERY_FEE;
                                    isDeliveryFeeIncluded = true;
                                }
                            }
                        } else {
                            total = 0;
                            isDeliveryFeeIncluded = false;
                        }

                        cart?.products?.forEach((prod: IProductData) => {
                            const temp = { ...prod };
                            if (temp?.productId === product?.productId && temp?.selectedVariant === selectedVariant) {
                                temp.quantity = (temp.quantity || 0) - 1;
                            }
                            if (temp.quantity !== 0) return products.push(temp);
                        });

                    default:
                        break;
                }
                dispatch(
                    UserDataActions.updateCart({
                        total,
                        cartTotal,
                        products,
                        isDeliveryFeeIncluded,
                    })
                );
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
                    const reducedAmount = foundProduct?.quantity * (product?.offerPrice || product?.price);
                    let total = cart?.total - reducedAmount;
                    const cartTotal = cart?.cartTotal - reducedAmount;
                    let isDeliveryFeeIncluded = cart.isDeliveryFeeIncluded;

                    if (cartTotal > 0) {
                        if (cart.isDeliveryFeeIncluded) {
                            if (cartTotal > BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                                total -= BILLING_DETAILS.DELIVERY_FEE;
                                isDeliveryFeeIncluded = false;
                            }
                        } else {
                            if (cartTotal < BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                                total += BILLING_DETAILS.DELIVERY_FEE;
                                isDeliveryFeeIncluded = true;
                            }
                        }
                    } else {
                        total = 0;
                        isDeliveryFeeIncluded = false;
                    }

                    const products = cart?.products?.filter((prod: IProductData) => {
                        if (prod.productId === product.productId) {
                            if (prod?.selectedVariant === selectedVariant) return false;
                        }
                        return true;
                    });
                    dispatch(UserDataActions.updateCart({ total, cartTotal, products, isDeliveryFeeIncluded }));
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
                if (products) dispatch(UserDataActions.updateWishlist(products));
                dispatch(UserDataActions.updateCart({ ...cart, products: cartProducts }));
            }
        }
    };

    const handleRemoveFromWishlist = async ({ userId, product }: { userId?: string; product?: IProductData }) => {
        if (userId && product?.productId) {
            const res = await removeFromWishlist({ userId, productId: product.productId });
            if (res?.status) {
                const products: IProductData[] | undefined = wishlist?.filter(
                    (prod: IProductData) => prod.productId !== product.productId
                );
                const cartProducts = cart?.products?.map((prod: IProductData) => {
                    if (prod?.productId === product?.productId) {
                        const temp = { ...prod };
                        temp.inWishlist = false;
                        return temp;
                    }
                    return prod;
                });
                if (products) dispatch(UserDataActions.updateWishlist(products));
                dispatch(UserDataActions.updateCart({ ...cart, products: cartProducts }));
            }
        }
    };

    return { handleAddToCart, handleUpdateCart, handleRemoveFromCart, handleAddToWishlist, handleRemoveFromWishlist };
};

export default useProduct;
