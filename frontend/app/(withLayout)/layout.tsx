import '@styles/styles.scss';
import loginModalData from '@staticData/login.json';
import Layout from '@organisms/Layout';
import layoutData from '@staticData/layout.json';

export const metadata = {
    title: 'Apparel Store',
};

export default function BasicLayout({ children }: { children: React.ReactNode }) {
    return (
        <Layout
            headerData={layoutData?.headerData}
            footerData={layoutData?.footerData}
            socialIcons={layoutData?.socialIcons}
            loginModalData={loginModalData}
        >
            {children}
        </Layout>
    );
}
