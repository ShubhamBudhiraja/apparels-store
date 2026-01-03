'use client';
import { useAppSelector } from '@store';
import ordersApiHandler from 'api-managers/services/orders';
import { useEffect, useState } from 'react';
import style from './index.module.scss';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const OrdersListing = () => {
    const { userId } = useAppSelector((state) => state.userProfile);
    const { getOrdersList } = ordersApiHandler();
    const router = useRouter();
    const [order, setOrder] = useState<any>();

    const initialiser = async () => {
        if (userId) {
            const res = await getOrdersList(userId, 1);
            setOrder(res.responseBody?.[0]);
        }
    };

    useEffect(() => {
        initialiser();
    }, []);

    const formatCurrency = (n?: number) => {
        if (n == null) return '-';
        return `₹${n.toFixed(2)}`;
    };

    const formatDate = (iso?: string) => {
        if (!iso) return '-';
        try {
            const d = new Date(iso);
            return d.toLocaleString();
        } catch {
            return iso;
        }
    };

    return order ? (
        <Link href={`/orders/${order.orderId}`} className={style.card}>
            <div className={style.cardHeader}>
                <div>
                    <h3 className={style.orderTitle}>Order #{order.orderId}</h3>
                    <div className={style.meta}>
                        <time dateTime={order.orderTimeStamp || ''}>{formatDate(order.orderTimeStamp)}</time>
                        <span className={style.dot}>•</span>
                        <span className={style.totalPreview}>{formatCurrency(order.total ?? order.cartTotal)}</span>
                    </div>
                </div>
                <span className={style.status}>DELIVERED</span>
            </div>

            <section className="d-flex justify-content-between align-items-end">
                <div className={style.details}>
                    <h5>
                        {order.address?.firstName} {order.address?.lastName}
                    </h5>
                    <p>
                        {order.address?.city}, {order.address?.state}
                    </p>
                    <p>{order.address?.mobileNo}</p>
                </div>
                <div className={style.images}>
                    {order.products.slice(0, 2).map((product: any) => (
                        <figure className={style.thumbnail}>
                            <img src={product.thumbnail} alt="" />
                        </figure>
                    ))}
                    {order.products.length > 2 && (
                        <div className={style.thumbnail}>
                            <span>+{order.products.length - 1} more</span>
                        </div>
                    )}
                </div>
            </section>
        </Link>
    ) : (
        <></>
    );
};

export default OrdersListing;
