import Carousel from '@molecules/Carousel';
import ProductCard from '@molecules/ProductCard';
import React from 'react';
import style from './index.module.scss';
import { Settings } from 'react-slick';
import { IProductData } from '@interface/products';
import { useAppSelector } from '@store';

interface IProductsCarousel {
    productsList?: IProductData[];
}

const ProductsCarousel = (props: IProductsCarousel) => {
    const { productsList } = props;

    const { cart, wishlist } = useAppSelector((state) => state.userProfile);

    const carouselSettings: Settings = {
        infinite: false,
        arrows: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        className: style.carouselWrap,
        autoplay: false,
        nextArrow: (
            <span>
                <i className="font icon-right"></i>
            </span>
        ),
        prevArrow: (
            <span>
                <i className="font icon-left"></i>
            </span>
        ),
    };

    return (
        <Carousel settings={carouselSettings}>
            {productsList?.map((product: IProductData, index: number) => (
                <>
                    <ProductCard
                        key={`product_${index}`}
                        {...product}
                        isInCart={
                            !!cart?.products?.find((item: IProductData) => item?.productId === product?.productId)
                        }
                        isWishlisted={!!wishlist?.find((item: IProductData) => item?.productId === product?.productId)}
                    />
                </>
            ))}
        </Carousel>
    );
};

export default ProductsCarousel;
