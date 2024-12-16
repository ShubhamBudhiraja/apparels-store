import VerifyPayment from '@pages/VerifyPayment';

const Page = (pageProps: any) => {
    const { searchParams } = pageProps;

    return <VerifyPayment orderId={searchParams?.order_id} statusId={searchParams?.status_id} />;
};

export default Page;
