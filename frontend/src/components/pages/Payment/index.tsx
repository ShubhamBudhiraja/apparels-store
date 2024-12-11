'use client';
import { useAppSelector } from '@store';
import React, { useEffect } from 'react';
import style from './index.module.scss';
import Card from './Card';
import { useSearchParams } from 'next/navigation';

const Payment = () => {
    const { cart } = useAppSelector((state) => state.userProfile);
    const params = useSearchParams();

    console.log(params);

    if (cart.products.length === 0) return <></>;

    return (
        <div className={style.wrapper}>
            <Card total={cart.total} />
        </div>
    );
};

export default Payment;
