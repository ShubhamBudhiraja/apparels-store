'use client';
import React from 'react';
import style from './index.module.scss';
import { useAppSelector } from '@store';
import { IProductData } from '@interface/products';
import ProductWrapper from './productWrapper';

interface ICart {}

const Cart = (props: ICart) => {
    const { userId, cart } = useAppSelector((state) => state.userProfile);

    return (
        <ul className={style.productsWrapper}>
            {cart?.products?.map((product: IProductData, index: number) => (
                <ProductWrapper key={`product_${index}`} userId={userId} productData={product} />
            ))}
        </ul>
    );
};

export default Cart;
