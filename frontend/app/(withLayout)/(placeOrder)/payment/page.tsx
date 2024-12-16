import Payment from '@pages/Payment';

const Page = (pageProps: any) => {
    return <Payment orderId={pageProps?.searchParams?.orderId} />;
};

export default Page;
