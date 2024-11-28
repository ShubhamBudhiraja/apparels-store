import { formatDiscount, formatPrice } from '@utils/common';
import style from './index.module.scss';
import React from 'react';
import Link from 'next/link';
import { ILoginModalSuccess } from 'src/lib/interface/user';
import { IProductData } from '@interface/products';
import useProduct from '@customHooks/useProduct';
import { useAppSelector } from '@store';
import useProfile from '@customHooks/useProfile';

const ProductCard = (productData: IProductData) => {
    const {
        images,
        currencySymbol,
        inWishlist,
        productId,
        title,
        price,
        offerPrice,
        discountPercentage = 0,
        segment = 'men',
    } = productData;

    const { initiateLogin } = useProfile();
    const { handleAddToWishlist, handleRemoveFromWishlist } = useProduct();
    const { userId } = useAppSelector((state) => state.userProfile);

    const handleWishlistClick = async (e?: any) => {
        e?.preventDefault();
        if (inWishlist) await handleRemoveFromWishlist({ userId: userId, product: productData });
        else {
            if (userId) await handleAddToWishlist({ userId: userId, product: productData });
            else
                initiateLogin({
                    successCallback: (data?: ILoginModalSuccess) =>
                        handleAddToWishlist({ userId: data?.userId, product: productData }),
                });
        }
    };

    return (
        <Link className={style.cardWrapper} href={`/shop/${segment}/${productId}`}>
            <figure className={style.thumbnail}>
                <img src={images?.[0]} alt="" />
                {discountPercentage > 0 && <figcaption>{formatDiscount(discountPercentage, true)}</figcaption>}
            </figure>
            <div className={style.productTitle}>
                <h3>{title}</h3>
                <i className={`font icon-${inWishlist ? 'heart-filled' : 'heart'}`} onClick={handleWishlistClick}></i>
            </div>
            <div>
                {discountPercentage > 0 && (
                    <span>
                        {currencySymbol}
                        {formatPrice(offerPrice)}
                    </span>
                )}
                <span className={discountPercentage > 0 ? style.originalPrice : undefined}>
                    {currencySymbol}
                    {formatPrice(price)}
                </span>
            </div>
        </Link>
    );
};

export default ProductCard;
