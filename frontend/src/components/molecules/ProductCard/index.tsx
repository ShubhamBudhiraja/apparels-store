import { formatDiscount } from '@utils/common';
import style from './index.module.scss';
import React, { useCallback, useContext, useMemo } from 'react';
import { IProductData } from 'src/lib/interface/products';
import { LayoutContextData } from 'src/lib/context/layout';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useLogin from 'src/lib/customHooks/useLogin';
import useProduct from 'src/lib/customHooks/useProduct';
import { ILoginModalSuccess } from 'src/lib/interface/user';

interface IProductCard extends IProductData {
    isLoggedIn?: boolean;
    userId?: string;
}

const ProductCard = (props: IProductCard) => {
    const {
        userId,
        id,
        name,
        images,
        price,
        currencySymbol,
        offerPrice,
        discountPer = 0,
        units = 0,
        isWishlisted,
        isInCart,
    } = props;

    const { initiateLogin } = useLogin();
    const { handleAddToCart, handleAddToWishlist } = useProduct();
    const { dictionary } = useContext(LayoutContextData);
    const router = useRouter();

    const fewPiecesMsg = useMemo(() => {
        if (units > 0 && units < 10) return dictionary?.fewPiecesLabel?.replace('$', units);
    }, [units]);

    const handleCtaClick = useCallback(
        (e: any, iconName: string) => {
            e.preventDefault();
            if (id)
                switch (iconName) {
                    case 'search':
                        router.push(`/shop/${id}`);
                        break;
                    case 'bag':
                        if (userId) handleAddToCart({ userId: userId, productId: id });
                        else
                            initiateLogin({
                                successCallback: (data?: ILoginModalSuccess) =>
                                    handleAddToCart({ userId: data?.email, productId: id }),
                            });
                        break;
                    case 'heart':
                        if (userId) handleAddToWishlist({ userId: userId, productId: id });
                        else
                            initiateLogin({
                                successCallback: (data?: ILoginModalSuccess) =>
                                    handleAddToWishlist({ userId: data?.email, productId: id }),
                            });
                        break;
                    default:
                        break;
                }
        },
        [userId, id]
    );

    return (
        <Link className={style.cardWrapper} href={`/shop/${id}`}>
            <div className={style.thumbnail}>
                <img src={images?.[0]} alt="productImage" />
                {discountPer > 0 && <span>{formatDiscount(discountPer, true)}</span>}
                <div className={style.cta}>
                    <Button onClick={(e: any) => handleCtaClick(e, 'heart')}>
                        <i className={`font icon-${isWishlisted ? 'heart-filled' : 'heart'}`}></i>
                    </Button>
                    <Button onClick={(e: any) => handleCtaClick(e, 'bag')}>
                        <i className={`font icon-${isInCart ? 'bag-filled' : 'bag'}`}></i>
                    </Button>
                    <Button onClick={(e: any) => handleCtaClick(e, 'search')}>
                        <i className="font icon-search"></i>
                    </Button>
                </div>
            </div>
            <h3>{name}</h3>
            <div>
                {discountPer > 0 && (
                    <span>
                        {currencySymbol}
                        {offerPrice}
                    </span>
                )}
                <span className={discountPer > 0 ? style.originalPrice : undefined}>
                    {currencySymbol}
                    {price}
                </span>
            </div>
            {fewPiecesMsg && <p>{fewPiecesMsg}</p>}
        </Link>
    );
};

export default ProductCard;
