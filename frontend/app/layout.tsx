import '@styles/styles.scss';
import LayoutContextProvider from 'src/lib/context/layout';
import dictionaryData from '@staticData/dictionary.json';
import MyApp from 'src/components/organisms/MyApp';

export const metadata = {
    title: 'Apparel Store',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <LayoutContextProvider dictionary={dictionaryData}>
                <MyApp>{children}</MyApp>
            </LayoutContextProvider>
        </html>
    );
}
