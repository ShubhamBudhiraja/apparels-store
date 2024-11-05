'use client';
import { Provider } from 'react-redux';
import { store } from 'src/lib/store/store';
import Layout from 'src/components/organisms/Layout';

function MyApp({
    children,
    layoutData,
    loginModalData,
}: {
    layoutData?: any;
    loginModalData?: any;
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <Layout
                headerData={layoutData?.headerData}
                footerData={layoutData?.footerData}
                socialIcons={layoutData?.socialIcons}
                loginModalData={loginModalData}
            >
                {children}
            </Layout>
        </Provider>
    );
}

export default MyApp;
