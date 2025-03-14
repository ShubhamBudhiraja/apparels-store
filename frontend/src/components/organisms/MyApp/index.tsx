'use client';
import { Provider } from 'react-redux';
import { store } from 'src/lib/store/store';
import Layout from 'src/components/organisms/Layout';

function MyApp({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}

export default MyApp;
