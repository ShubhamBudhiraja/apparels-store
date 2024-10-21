'use client';
import Footer from 'src/components/organisms/Footer';
import Header from 'src/components/organisms/Header';
import React from 'react';

interface ILayout {
    headerData?: any;
    footerData?: any;
    children: React.ReactNode;
}

const Layout = (props: ILayout) => {
    const { headerData, footerData, children } = props;
    return (
        <>
            <Header topBar={headerData?.topBar} />
            {children}
            <Footer formData={footerData?.signupForm} siteInfo={footerData?.siteInformation} />
        </>
    );
};

export default Layout;
