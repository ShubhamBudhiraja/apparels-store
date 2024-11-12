import { formatDiscount, formatPrice } from '@utils/common';
import style from './index.module.scss';
import React, { useCallback, useContext, useMemo } from 'react';
import { LayoutContextData } from 'src/lib/context/layout';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ILoginModalSuccess } from 'src/lib/interface/user';
import { IProductData } from '@interface/products';
import useLogin from '@customHooks/useLogin';
import useProduct from '@customHooks/useProduct';
import { useAppSelector } from '@store';

const ProductCard = (productData: IProductData) => {
    const {
        images,
        currencySymbol,
        isWishlisted,
        isInCart,
        productId,
        title,
        price,
        offerPrice,
        units = 0,
        discountPercentage = 0,
    } = productData;

    const { initiateLogin } = useLogin();
    const { handleAddToCart, handleAddToWishlist, handleRemoveFromCart, handleRemoveFromWishlist } = useProduct();
    const { userId } = useAppSelector((state) => state.userProfile);
    const { dictionary } = useContext(LayoutContextData);
    const router = useRouter();

    const fewPiecesMsg = useMemo(() => {
        if (units > 0 && units < 10) return dictionary?.fewPiecesLabel?.replace('$', units);
    }, [units]);

    const handleCtaClick = useCallback(
        async (e: any, iconName: string) => {
            e.preventDefault();
            if (productId)
                switch (iconName) {
                    case 'search':
                        router.push(`/shop/${productId}`);
                        break;
                    case 'bag':
                        if (userId) await handleAddToCart({ userId: userId, product: productData });
                        else
                            initiateLogin({
                                successCallback: (data?: ILoginModalSuccess) =>
                                    handleAddToCart({ userId: data?.userId, product: productData }),
                            });
                        break;
                    case 'heart':
                        if (userId) await handleAddToWishlist({ userId: userId, product: productData });
                        else
                            initiateLogin({
                                successCallback: (data?: ILoginModalSuccess) =>
                                    handleAddToWishlist({ userId: data?.userId, product: productData }),
                            });
                        break;
                    case 'bag-filled':
                        await handleRemoveFromCart({ userId: userId, product: productData });
                        break;
                    case 'heart-filled':
                        await handleRemoveFromWishlist({ userId: userId, product: productData });
                        break;
                    default:
                        break;
                }
        },
        [userId, productId]
    );

    return (
        <Link className={style.cardWrapper} href={`/shop/${productId}`}>
            <div className={style.thumbnail}>
                <img src={images?.[0]} alt="productImage" />
                {discountPercentage > 0 && <span>{formatDiscount(discountPercentage, true)}</span>}
                {units !== 0 && (
                    <div className={style.cta}>
                        <Button onClick={(e: any) => handleCtaClick(e, isWishlisted ? 'heart-filled' : 'heart')}>
                            <i className={`font icon-${isWishlisted ? 'heart-filled' : 'heart'}`}></i>
                        </Button>
                        <Button onClick={(e: any) => handleCtaClick(e, isInCart ? 'bag-filled' : 'bag')}>
                            <i className={`font icon-${isInCart ? 'bag-filled' : 'bag'}`}></i>
                        </Button>
                        <Button onClick={(e: any) => handleCtaClick(e, 'search')}>
                            <i className="font icon-search"></i>
                        </Button>
                    </div>
                )}
            </div>
            <h3>{title}</h3>
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
            {fewPiecesMsg && <p>{fewPiecesMsg}</p>}
        </Link>
    );
};

export default ProductCard;
