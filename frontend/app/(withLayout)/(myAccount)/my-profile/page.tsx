import MyProfile from '@pages/MyProfile';
import { Metadata } from 'next';

export function generateMetadata(): Metadata {
    return { title: 'My Profile' };
}

const Page = () => {
    return <MyProfile />;
};

export default Page;
