import { Suspense } from 'react';
import ShopMain from '@pages/ShopMain';
import Loader from '@atoms/Loader';

const Page = () => {
    return (
        <Suspense
            fallback={
                <div className="d-flex justify-content-center py-5">
                    <Loader />
                </div>
            }
        >
            <ShopMain />
        </Suspense>
    );
};

export default Page;
