import PlaceOrderLayout from 'src/components/organisms/PlaceOrderLayout';
import checkoutData from '@staticData/checkout.json';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return <PlaceOrderLayout pageData={checkoutData}>{children}</PlaceOrderLayout>;
};

export default Layout;
