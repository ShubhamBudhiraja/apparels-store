import { Suspense } from 'react';
import ShopMain from '@pages/ShopMain';
import Loader from '@atoms/Loader';

interface IPage {
    params: {
        segment: string;
    };
}

const Page = ({ params }: IPage) => {
    return (
        <Suspense
            fallback={
                <div className="d-flex justify-content-center py-5">
                    <Loader />
                </div>
            }
        >
            <ShopMain segment={params.segment} />
        </Suspense>
    );
};

export default Page;
