import '@styles/styles.scss';
import LayoutContextProvider from 'src/lib/context/layout';
import dictionaryData from '@staticData/dictionary.json';
import Header from 'src/components/organisms/Header';
import Footer from 'src/components/organisms/Footer';
import headerData from '@staticData/header.json';
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
                        <Layout headerData={headerData}>{children}</Layout>
                    </main>
                </LayoutContextProvider>
            </body>
        </html>
    );
}
