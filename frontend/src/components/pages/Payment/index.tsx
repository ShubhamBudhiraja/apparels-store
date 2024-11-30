'use client';
import { IProductData } from '@interface/products';
import { useAppDispatch, useAppSelector } from '@store';
import { UserDataActions } from '@store/reducers/userProfileSlice';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import usePaymentApi from 'api-managers/services/payment';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ROUTES } from 'src/lib/constants/routes';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const Payment = () => {
    const { createCheckoutSession, completePayment } = usePaymentApi();
    const { userId, cart, selectedAddress } = useAppSelector((state) => state.userProfile);
    const dispatch = useAppDispatch();

    const router = useRouter();

    const fetchClientSecret = async () => {
        if (userId) {
            const res = await createCheckoutSession({
                userId,
                products: cart.products.map((product: IProductData) => ({
                    title: product.title,
                    price: product.offerPrice || product.price,
                    quantity: product.quantity,
                })),
            });

            if (res?.status) return res?.responseBody?.clientSecret;
        }
    };

    const handlePaymentSuccess = async () => {
        if (userId && selectedAddress) {
            const res = await completePayment({ userId, addressId: selectedAddress });

            if (res?.status && res?.responseBody?.orderId) {
                dispatch(
                    UserDataActions.updateCart({
                        cartTotal: 0,
                        total: 0,
                        products: [],
                        isDeliveryFeeIncluded: false,
                        couponDiscount: 0,
                    })
                );
                router.push(`${ROUTES.ORDER_STATUS}?orderId=${res.responseBody.orderId}&status=success`);
            } else router.push(`${ROUTES.ORDER_STATUS}?status=failed&errorCode=${res?.responseCode || 4000}`);
        }
    };

    const options = { fetchClientSecret, onComplete: handlePaymentSuccess };

    if (cart.products.length === 0) return <></>;

    return (
        <div id="checkout">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    );
};

export default Payment;
