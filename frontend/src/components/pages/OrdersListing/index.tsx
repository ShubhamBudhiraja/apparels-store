'use client';
import { useAppSelector } from '@store';
import ordersApiHandler from 'api-managers/services/orders';
import { useEffect, useState } from 'react';
import style from './index.module.scss';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@interface/orders';
import CustomDateRangePicker from '@atoms/CustomDateRangePicker';
import { format } from 'date-fns';
import SectionHeader from '@atoms/SectionHeader';
import ReactPaginate from 'react-paginate';
import CustomButton from '@atoms/CustomButton';

const OrdersListing = () => {
    const { userId } = useAppSelector((state) => state.userProfile);
    const { getOrdersList } = ordersApiHandler();
    const [orders, setOrders] = useState<{
        list: Order[];
        pagination: { hasMore: Boolean; currentPage: number };
    }>();
    const [selectedDateRange, setSelectedDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
        startDate: null,
        endDate: null,
    });
    const [loading, setLoading] = useState(false);

    const fetchOrders = async ({
        startDate,
        endDate,
        pageNumber = 1,
    }: {
        startDate?: Date | null;
        endDate?: Date | null;
        pageNumber?: number;
    }) => {
        if (userId) {
            setLoading(true);
            const res = await getOrdersList({
                userId,
                startDate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
                endDate: endDate ? format(endDate, 'yyyy-MM-dd') : '',
                pageNumber,
            });
            setOrders(res.responseBody);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders({});
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

    return orders ? (
        <>
            <div className="flex-between mb-4">
                <SectionHeader heading="Orders" className="mb-0" />
                <CustomDateRangePicker
                    start={selectedDateRange.startDate}
                    end={selectedDateRange.endDate}
                    onChange={({ start, end }) => {
                        setSelectedDateRange({ startDate: start, endDate: end });
                        if (start && end) fetchOrders({ startDate: start, endDate: end });
                    }}
                    maxDate={new Date()}
                />
            </div>
            {orders.list.length ? (
                <>
                    {orders.list.map((order) => (
                        <Link href={`/orders/${order.orderId}`} className={style.card}>
                            <div className={style.cardHeader}>
                                <div>
                                    <h3 className={style.orderTitle}>Order #{order.orderId}</h3>
                                    <div className={style.meta}>
                                        <time dateTime={order.orderTimeStamp || ''}>
                                            {formatDate(order.orderTimeStamp)}
                                        </time>
                                        <span className={style.dot}>•</span>
                                        <span className={style.totalPreview}>
                                            {formatCurrency(order.total ?? order.cartTotal)}
                                        </span>
                                    </div>
                                </div>
                                {order.status && <span className={style.status}>{order.status}</span>}
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
                    ))}
                    {orders.pagination.hasMore && (
                        <CustomButton
                            variant="secondary"
                            className="mx-auto d-block"
                            loading={loading}
                            onClick={() =>
                                fetchOrders({
                                    startDate: selectedDateRange.startDate,
                                    endDate: selectedDateRange.endDate,
                                    pageNumber: orders.pagination.currentPage + 1,
                                })
                            }
                        >
                            Load More
                        </CustomButton>
                    )}
                </>
            ) : (
                <p>No orders found</p>
            )}
        </>
    ) : (
        <></>
    );
};

export default OrdersListing;
