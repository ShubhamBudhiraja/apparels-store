import OrderStatus from '@pages/OrderStatus';
import { Metadata } from 'next';

export function generateMetadata(): Metadata {
    return { title: 'Apparel Store | Order Status' };
}

const Page = async (pageParams: any) => {
    const { orderId } = (await pageParams?.params) || {};

    return <OrderStatus orderId={orderId} />;
};

export default Page;
