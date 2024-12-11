import React, { useMemo } from 'react';
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
import { IUserAddress } from '@interface/user';
import usePaymentApi from 'api-managers/services/payment';

interface ICheckoutSummary {
    activeStep: number;
    ctaText?: string;
    billingData?: any;
    shippingData?: any;
}

const CheckoutSummary = (props: ICheckoutSummary) => {
    const { activeStep, ctaText, billingData, shippingData } = props;

    const { userId, cart, addresses, selectedAddress } = useAppSelector((state) => state.userProfile);
    const router = useRouter();
    const { initiatePayment } = usePaymentApi();

    const deliveryFeeMsg = useMemo(() => {
        if (billingData?.deliveryFee?.message)
            return billingData?.deliveryFee?.message
                ?.replace('{deliveryFee}', formatPrice(BILLING_DETAILS.DELIVERY_FEE, false))
                ?.replace('{minValue}', formatPrice(BILLING_DETAILS.NO_DELIVERY_FEE_VALUE, false));
    }, [billingData]);

    const isDisabled = useMemo(() => {
        switch (activeStep) {
            case 1:
                if (!selectedAddress) return true;
                else return false;
            case 2:
                return true;
            default:
                return false;
        }
    }, [activeStep, selectedAddress]);

    const activeAddress = useMemo(() => {
        if (selectedAddress && addresses?.length && activeStep > 1) {
            return addresses?.find((address: IUserAddress) => address?._id === selectedAddress);
        }
    }, [addresses, selectedAddress, activeStep]);

    const handleCtaClick = async () => {
        switch (activeStep) {
            case 0:
                router.push(ROUTES.SHIPPING_DETAILS);
                break;
            case 1:
                if (userId) {
                    const res = await initiatePayment({ userId, amount: cart?.total });
                    if (res?.status) router.push(`${ROUTES.PAYMENT}?orderId=${res?.responseBody?.order_id}`);
                }
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
                            <span className={cx(!cart?.isDeliveryFeeIncluded && 'text-decoration-line-through')}>
                                {formatPrice(BILLING_DETAILS.DELIVERY_FEE, false)}
                            </span>

                            {!cart?.isDeliveryFeeIncluded ? (
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

            {activeAddress && (
                <>
                    <h3>{shippingData?.heading}</h3>
                    <div className={style.addressDetails}>
                        <h6>
                            {activeAddress?.firstName} <span>{activeAddress?.mobileNo}</span>
                        </h6>

                        <p>
                            {activeAddress?.houseNo}, {activeAddress?.streetAddress}, {activeAddress?.city},{' '}
                            {activeAddress?.state} - {activeAddress?.pincode}
                        </p>
                    </div>
                </>
            )}
            {activeStep < 2 && (
                <CustomButton variant="secondary" onClick={handleCtaClick} disabled={isDisabled}>
                    {ctaText}
                </CustomButton>
            )}
        </div>
    );
};

export default CheckoutSummary;
