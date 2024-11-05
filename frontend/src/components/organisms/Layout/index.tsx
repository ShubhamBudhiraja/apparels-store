import Footer from 'src/components/organisms/Footer';
import Header from 'src/components/organisms/Header';
import React, { useEffect, useState } from 'react';
import { ISocialIcons } from 'src/lib/interface/layout';
import { Provider } from 'react-redux';
import { store } from 'src/lib/store/store';
import LoginModal from '@molecules/LoginModal';
import { getStorageItem } from '@utils/storage';
import { STORAGE_KEY, STORAGE_TYPE } from '@enums/storage';
import useLogin from 'src/lib/customHooks/useLogin';

interface ILayout {
    headerData?: any;
    footerData?: any;
    loginModalData?: any;
    socialIcons?: ISocialIcons[];
    children: React.ReactNode;
}

const Layout = (props: ILayout) => {
    const { headerData, footerData, loginModalData, socialIcons, children } = props;

    const { storeUser } = useLogin();

    const [showHamburger, setShowHamburger] = useState(false);

    useEffect(() => {
        const userId = getStorageItem({ key: STORAGE_KEY.USERID, storageType: STORAGE_TYPE.COOKIE });
        if (userId) storeUser({ email: userId });
    }, []);

    return (
        <body className={showHamburger ? 'overflow-hidden' : ''}>
            <Provider store={store}>
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
                    <LoginModal modalData={loginModalData} />
                </main>
            </Provider>
        </body>
    );
};

export default Layout;
