import React, { useState } from 'react';
import { SIZE_LABELS } from 'src/lib/constants/product';
import style from './index.module.scss';
import LinkWrapper from '@atoms/LinkWrapper';
import cx from 'classnames';
import CounterButton from '@atoms/CounterButton';
import { CART_PRODUCT_OPERATION } from '@enums/products';
import { formatPrice } from '@utils/common';
import { useAppSelector } from '@store';
import useProduct from '@customHooks/useProduct';

interface IProductWrapper {
    userId?: string;
    productData?: any;
}

const ProductWrapper = (props: IProductWrapper) => {
    const { userId, productData } = props;

    const { handleUpdateCart, handleRemoveFromCart, handleAddToWishlist, handleRemoveFromWishlist } = useProduct();

    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateQuantity = async (operation: CART_PRODUCT_OPERATION) => {
        setIsLoading(true);
        await handleUpdateCart({
            userId,
            product: productData,
            operation,
            selectedVariant: productData?.selectedVariant,
        });
        setIsLoading(false);
    };

    return (
        <li>
            <figure>
                <img src={productData?.thumbnail} alt="" />
            </figure>
            <div className={style.details}>
                <div>
                    <div className="flex-between">
                        <LinkWrapper
                            href={`/shop/${productData?.segment}/${productData?.productId}`}
                            className={style.title}
                        >
                            {productData?.title}
                        </LinkWrapper>
                        <div className={style.price}>
                            <span className={cx(productData?.offerPrice && style.offerApplicable)}>
                                {formatPrice(productData?.price, false)}
                            </span>
                            {productData?.offerPrice && productData?.offerPrice > 0 ? (
                                <span className={style.discounted}>{formatPrice(productData?.offerPrice, false)}</span>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    {productData?.selectedVariant && (
                        <p>
                            Size: <span>{SIZE_LABELS[productData?.selectedVariant]}</span>
                        </p>
                    )}
                </div>
                <div className={cx(style.cta, 'flex-end')}>
                    <i
                        className={`font icon-${productData?.inWishlist ? 'heart-filled' : 'heart'} ${
                            productData?.inWishlist ? style.wishlisted : ''
                        }`}
                        onClick={() =>
                            productData?.inWishlist
                                ? handleRemoveFromWishlist({ userId, product: productData })
                                : handleAddToWishlist({ userId, product: productData })
                        }
                    ></i>
                    <CounterButton
                        count={productData?.quantity}
                        loading={isLoading}
                        handleDecrement={() => handleUpdateQuantity(CART_PRODUCT_OPERATION.DECREASE)}
                        handleIncrement={() => handleUpdateQuantity(CART_PRODUCT_OPERATION.INCREASE)}
                    />
                    <i
                        className="font icon-delete"
                        onClick={() =>
                            handleRemoveFromCart({
                                userId,
                                product: productData,
                                selectedVariant: productData?.selectedVariant,
                            })
                        }
                    ></i>
                </div>
            </div>
        </li>
    );
};

export default ProductWrapper;
