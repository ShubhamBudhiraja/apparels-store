import ProductDetails from 'src/components/pages/ProductDetails';
import pageData from '@staticData/productDetail.json';

const Page = (props: any) => {
    const { params } = props;

    return <ProductDetails productId={params.productId} segment={params.segment} serverData={pageData} />;
};

export default Page;
