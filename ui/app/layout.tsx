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
                <LayoutContextProvider dictionaryData={dictionaryData}>
                    <main>
                        <Layout headerData={layoutData?.headerData} footerData={layoutData?.footerData}>
                            {children}
                        </Layout>
                    </main>
                </LayoutContextProvider>
            </body>
        </html>
    );
}
