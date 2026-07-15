'use client';
import React from 'react';
import style from './index.module.scss';
import { useAppSelector } from '@store';
import { IProductData } from '@interface/products';
import ProductWrapper from './productWrapper';

const Cart = () => {
    const { userId, cart } = useAppSelector((state) => state.userProfile);

    return (
        <ul className={style.productsWrapper}>
            {cart?.products?.map((product: IProductData) => (
                <ProductWrapper
                    key={`${product.productId}_${product.selectedVariant}`}
                    userId={userId}
                    productData={product}
                />
            ))}
        </ul>
    );
};

export default Cart;
