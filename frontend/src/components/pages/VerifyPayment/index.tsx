'use client';
import PageLoader from '@atoms/PageLoader';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { ROUTES } from '@enums/routes';
import { useAppDispatch, useAppSelector } from '@store';
import { UserDataActions } from '@store/reducers/userProfileSlice';

interface IVerifyPayment {
    orderId?: string;
    statusId?: string;
}

const VerifyPayment = (props: IVerifyPayment) => {
    const { statusId, orderId } = props;

    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        debugger;
        dispatch(UserDataActions.updateCart({ cartTotal: 0, total: 0, products: [] }));
        router.push(
            `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${ROUTES.ORDER_STATUS}?orderId=${orderId}&statusId=${statusId}`
        );
    }, [orderId, statusId]);

    return <PageLoader />;
};

export default VerifyPayment;
