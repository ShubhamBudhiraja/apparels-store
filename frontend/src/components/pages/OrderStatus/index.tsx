'use client';
import { ROUTES } from '@enums/routes';
import { useAppSelector } from '@store';
import ordersApiHandler from 'api-managers/services/orders';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import style from './index.module.scss';
import { STATUS_MESSAGES } from 'src/lib/constants/orders';
import { IProductData } from '@interface/products';
import { SIZE_LABELS } from 'src/lib/constants/product';
import { formatPrice } from '@utils/common';
import FeedbackPopup from '@molecules/FeedbackPopup';

const OrderStatus = (props: { orderId: string; orderStatusId: string }) => {
    const { orderId, orderStatusId } = props;

    const { getOrderDetails } = ordersApiHandler();
    const router = useRouter();
    const { userId } = useAppSelector((state) => state.userProfile);

    const [orderDetails, setOrderDetails] = useState<any>();
    const [showTooltip, setShowTooltip] = useState(false);
    const [showFeedbackPopup, setShowFeedbackPopup] = useState(true);

    const deliveryLocation = useMemo(() => {
        if (orderDetails) {
            return `${orderDetails?.address?.houseNo} ${orderDetails?.address?.streetAddress} ${orderDetails?.address?.city} ${orderDetails?.address?.state} ${orderDetails?.address?.pincode}`;
        }
    }, [orderDetails]);

    const initialiser = async () => {
        if (userId) {
            const res = await getOrderDetails(orderId, userId);

            if (res?.status) {
                setOrderDetails(res?.responseBody);
            } else router.push(ROUTES.HOME);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(orderDetails?.orderId);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    };

    useEffect(() => {
        initialiser();
    }, []);

    return orderDetails ? (
        <>
            <div className={style.statusWrapper}>
                <div className={`${style.banner} mb-5`}>
                    <img src="/animations/confirm.gif"></img>
                    <h1>{STATUS_MESSAGES[orderStatusId]}</h1>
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <p>
                            Order ID: {orderDetails?.orderId}
                            <OverlayTrigger show={showTooltip} overlay={<Tooltip>Order ID copied</Tooltip>}>
                                <i className="font icon-copy" onClick={handleCopy}></i>
                            </OverlayTrigger>
                        </p>
                        <Button variant="link">Continue Shopping</Button>
                    </div>
                </div>
                <div className="mb-5">
                    <h2>Billing Address</h2>
                    <Row>
                        <Col md={4} xs={6} className="fw-bold">
                            Name:
                        </Col>
                        <Col md={7} xs={6}>
                            {orderDetails?.address?.firstName} {orderDetails?.address?.lastName}
                        </Col>
                        <Col md={4} xs={6} className="fw-bold">
                            Mobile No.:
                        </Col>
                        <Col md={7} xs={6}>
                            {orderDetails?.address?.mobileNo}
                        </Col>
                        <Col md={4} xs={6} className="fw-bold">
                            Delivery Location:
                        </Col>
                        <Col md={7} xs={6}>
                            {deliveryLocation}
                        </Col>
                    </Row>
                </div>
                <div className={style.orderDetails}>
                    <h2>Order Summary</h2>
                    {orderDetails?.products?.map((product: IProductData) => (
                        <div className={style.productWrapper}>
                            <figure>
                                <img src={product?.thumbnail} alt="" />
                            </figure>
                            <div className="d-md-flex justify-content-between w-100">
                                <div>
                                    <h5>{product?.title}</h5>
                                    <p>
                                        <span className="fw-bold">Quantity:</span> {product?.quantity}
                                    </p>
                                    <p>
                                        <span className="fw-bold">Variant:</span>{' '}
                                        {SIZE_LABELS?.[product?.selectedVariant || 'default']}
                                    </p>
                                </div>
                                <span className="fw-bold">{formatPrice(product?.offerPrice || product?.price)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <FeedbackPopup show={showFeedbackPopup} setShow={setShowFeedbackPopup} userId={userId} orderId={orderId} />
        </>
    ) : (
        <></>
    );
};

export default OrderStatus;
