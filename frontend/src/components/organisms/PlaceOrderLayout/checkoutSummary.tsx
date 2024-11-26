import React, { useEffect, useMemo, useState } from 'react';
import style from './index.module.scss';
import { useAppSelector } from '@store';
import { IProductData } from '@interface/products';
import { BILLING_DETAILS, SIZE_LABELS } from 'src/lib/constants/product';
import { formatPrice } from '@utils/common';
import cx from 'classnames';
import CustomButton from '@atoms/CustomButton';
import { useRouter } from 'next/navigation';
import { ROUTES } from 'src/lib/constants/routes';
import { VARIANT_ID } from '@enums/products';

interface ICheckoutSummary {
    activeStep: number;
    ctaText?: string;
    billingData?: any;
}

const CheckoutSummary = (props: ICheckoutSummary) => {
    const { activeStep, ctaText, billingData } = props;

    const { cart } = useAppSelector((state) => state.userProfile);
    const router = useRouter();

    const deliveryFeeMsg = useMemo(() => {
        if (billingData?.deliveryFee?.message)
            return billingData?.deliveryFee?.message
                ?.replace('{deliveryFee}', formatPrice(BILLING_DETAILS.DELIVERY_FEE, false))
                ?.replace('{minValue}', formatPrice(BILLING_DETAILS.NO_DELIVERY_FEE_VALUE, false));
    }, [billingData]);

    const handleCtaClick = () => {
        switch (activeStep) {
            case 0:
                router.push(ROUTES.SHIPPING_DETAILS);
                break;
            case 1:
                router.push(ROUTES.PAYMENT);
                break;
            default:
                break;
        }
    };

    return (
        <div className={style.summaryWrapper}>
            <h3>{billingData?.heading}</h3>
            <div className={cx(style.billingDetails, 'mb-2')}>
                {cart?.products?.map((prod: IProductData, index: number) => (
                    <div key={`cartSummary_${index}`} className="d-flex">
                        <div className="w-75">
                            <p>
                                {prod?.quantity} <span className={style.cross}>X</span> {prod?.title}{' '}
                                {prod?.selectedVariant &&
                                    (prod?.selectedVariant === VARIANT_ID.DEFAULT
                                        ? ''
                                        : `(${SIZE_LABELS[prod?.selectedVariant]})`)}
                            </p>
                        </div>
                        <div className="w-25">
                            <p className="text-end">
                                {formatPrice(prod?.quantity * (prod?.offerPrice || prod?.price))}
                            </p>
                        </div>
                    </div>
                ))}
                <div className={cx(style.total, 'd-flex')}>
                    <div className="w-75">
                        <p>{billingData?.subTotalLabel}</p>
                    </div>
                    <div className="w-25">
                        <p className="text-end">{formatPrice(cart?.cartTotal)}</p>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="w-75">
                        <p>{billingData?.deliveryFee?.label}</p>
                    </div>
                    <div className="w-25">
                        <p className="text-end">
                            <span className={cx(!cart.isDeliveryFeeIncluded && 'text-decoration-line-through')}>
                                {formatPrice(BILLING_DETAILS.DELIVERY_FEE, false)}
                            </span>

                            {!cart.isDeliveryFeeIncluded ? (
                                <span className={style.discount}> {formatPrice(0, false)}</span>
                            ) : (
                                ''
                            )}
                        </p>
                    </div>
                </div>
                <div className={cx(style.total, 'd-flex')}>
                    <div className="w-75">
                        <p>{billingData?.totalLabel}</p>
                    </div>
                    <div className="w-25">
                        <p className="text-end">{formatPrice(cart?.total)}</p>
                    </div>
                </div>
            </div>

            {deliveryFeeMsg && <p className={style.disclaimer}>{deliveryFeeMsg}</p>}

            {activeStep > 1 && (
                <>
                    <h3>Selected Address</h3>
                    <div className={style.addressDetails}></div>
                </>
            )}
            <CustomButton variant="secondary" onClick={handleCtaClick}>
                {ctaText}
            </CustomButton>
        </div>
    );
};

export default CheckoutSummary;
