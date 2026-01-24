import OrderDetails from '@pages/OrderDetails';
import { Metadata } from 'next';

export function generateMetadata(): Metadata {
    return { title: 'Apparel Store | Order Status' };
}

const Page = async (pageParams: any) => {
    const { orderId } = (await pageParams?.params) || {};

    return <OrderDetails orderId={orderId} />;
};

export default Page;
