import '@styles/styles.scss';
import LayoutContextProvider from 'src/lib/context/layout';
import dictionaryData from '@staticData/dictionary.json';
import layoutData from '@staticData/layout.json';
import Layout from 'src/components/organisms/Layout';

export const metadata = {
    title: 'Apparel Store',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <LayoutContextProvider dictionary={dictionaryData}>
                    <main>
                        <Layout
                            headerData={layoutData?.headerData}
                            footerData={layoutData?.footerData}
                            socialIcons={layoutData?.socialIcons}
                        >
                            {children}
                        </Layout>
                    </main>
                </LayoutContextProvider>
            </body>
        </html>
    );
}
