import MyProfileLayout from '@organisms/MyProfileLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <MyProfileLayout>{children}</MyProfileLayout>;
}
