import OrderStatus from '@pages/OrderStatus';
import { Metadata } from 'next';

export function generateMetadata(): Metadata {
    return { title: 'Apparel Store | Order Status' };
}

const Page = async (pageParams: any) => {
    const { orderId, statusId } = (await pageParams?.searchParams) || {};

    return <OrderStatus orderId={orderId} orderStatusId={statusId} />;
};

export default Page;
