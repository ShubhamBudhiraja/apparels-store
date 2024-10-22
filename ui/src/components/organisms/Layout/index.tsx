'use client';
import Footer from 'src/components/organisms/Footer';
import Header from 'src/components/organisms/Header';
import React from 'react';
import { ISocialIcons } from 'src/lib/interface/layout';

interface ILayout {
    headerData?: any;
    footerData?: any;
    socialIcons?: ISocialIcons[];
    children: React.ReactNode;
}

const Layout = (props: ILayout) => {
    const { headerData, footerData, socialIcons, children } = props;
    return (
        <>
            <Header
                topBar={headerData?.topBar}
                primaryMenu={headerData?.primaryMenu}
                secondaryMenu={headerData?.secondaryMenu}
                logo={headerData?.logo}
                socialIcons={socialIcons}
            />
            {children}
            <Footer
                formData={footerData?.signupForm}
                siteInfo={footerData?.siteInformation}
                copyrightInfo={footerData?.copyrightText}
                socialIcons={socialIcons}
            />
        </>
    );
};

export default Layout;
