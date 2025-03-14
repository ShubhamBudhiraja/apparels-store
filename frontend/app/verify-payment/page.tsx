import VerifyPayment from '@pages/VerifyPayment';

const Page = (pageProps: any) => {
    const { searchParams } = pageProps;

    return (
        <body>
            <VerifyPayment orderId={searchParams?.order_id} statusId={searchParams?.status_id} />
        </body>
    );
};

export default Page;
