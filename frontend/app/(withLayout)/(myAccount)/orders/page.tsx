import OrdersListing from '@pages/OrdersListing';
import { Metadata } from 'next';

export function generateMetadata(): Metadata {
    return { title: 'Apparel Store | Orders' };
}

const Page = () => {
    return <OrdersListing />;
};

export default Page;
