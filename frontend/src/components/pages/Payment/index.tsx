'use client';
import { useAppSelector } from '@store';
import React, { useEffect } from 'react';
import style from './index.module.scss';
import Card from './Card';
import usePaymentApi from 'api-managers/services/payment';
import { useRouter } from 'next/navigation';
import { ROUTES } from 'src/lib/constants/routes';

interface IPayment {
    orderId?: string;
}

const Payment = (props: IPayment) => {
    const { orderId } = props;

    const { userId, cart } = useAppSelector((state) => state.userProfile);
    const { getPaymentStatus } = usePaymentApi();
    const router = useRouter();

    const initialiser = async () => {
        if (orderId && userId) {
            const res = await getPaymentStatus({ userId, orderId });
            if (!res?.status) router.push(ROUTES.SHIPPING_DETAILS);
        }
    };

    useEffect(() => {
        initialiser();
    }, []);

    if (cart.products.length === 0 || !orderId) return <></>;

    return (
        <div className={style.wrapper}>
            <Card total={cart.total} orderId={orderId} />
        </div>
    );
};

export default Payment;
