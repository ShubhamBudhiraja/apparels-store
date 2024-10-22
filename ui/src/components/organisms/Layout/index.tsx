'use client';
import Footer from 'src/components/organisms/Footer';
import Header from 'src/components/organisms/Header';
import React, { useState } from 'react';
import { IHeaderData, ISocialIcons } from 'src/lib/interface/layout';

interface ILayout {
    headerData?: any;
    footerData?: any;
    socialIcons?: ISocialIcons[];
    children: React.ReactNode;
}

const Layout = (props: ILayout) => {
    const { headerData, footerData, socialIcons, children } = props;
    const [showHamburger, setShowHamburger] = useState(false);

    return (
        <body className={showHamburger ? 'overflow-hidden' : ''}>
            <main>
                <Header
                    topBar={headerData?.topBar}
                    primaryMenu={headerData?.primaryMenu}
                    secondaryMenu={headerData?.secondaryMenu}
                    logo={headerData?.logo}
                    socialIcons={socialIcons}
                    setShowHamburger={setShowHamburger}
                    showHamburger={showHamburger}
                    hamburgerData={headerData?.hamburgerData}
                />
                {children}
                <Footer
                    formData={footerData?.formData}
                    siteInfo={footerData?.siteInformation}
                    copyrightInfo={footerData?.copyrightText}
                    socialIcons={socialIcons}
                />
            </main>
        </body>
    );
};

export default Layout;
