import '@styles/styles.scss';
import LayoutContextProvider from 'src/lib/context/layout';
import dictionaryData from '@staticData/dictionary.json';
import layoutData from '@staticData/layout.json';
import loginModalData from '@staticData/login.json';

import MyApp from 'src/components/organisms/MyApp';

export const metadata = {
    title: 'Apparel Store',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <LayoutContextProvider dictionary={dictionaryData}>
                <MyApp layoutData={layoutData} loginModalData={loginModalData}>
                    {children}
                </MyApp>
            </LayoutContextProvider>
        </html>
    );
}
