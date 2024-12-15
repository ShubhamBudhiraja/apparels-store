import Footer from 'src/components/organisms/Footer';
import Header from 'src/components/organisms/Header';
import React, { useEffect, useState } from 'react';
import { ISocialIcons } from 'src/lib/interface/layout';
import { Provider } from 'react-redux';
import { store } from 'src/lib/store/store';
import LoginModal from '@molecules/LoginModal';
import { getStorageItem } from '@utils/storage';
import { STORAGE_KEY, STORAGE_TYPE } from '@enums/storage';
import CustomToast from '@atoms/Toast';
import { useAppDispatch, useAppSelector } from '@store';
import { ToastActions } from '@store/reducers/toastSlice';
import useProfile from '@customHooks/useProfile';
import PageLoader from '@atoms/PageLoader';

interface ILayout {
    headerData?: any;
    footerData?: any;
    loginModalData?: any;
    socialIcons?: ISocialIcons[];
    children: React.ReactNode;
}

const Layout = (props: ILayout) => {
    const { headerData, footerData, loginModalData, socialIcons, children } = props;

    const { storeUser } = useProfile();
    const { onClose, ...toastProps } = useAppSelector((state) => state.toast);
    const dispatch = useAppDispatch();

    const [showHamburger, setShowHamburger] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const handleToastClose = () => {
        onClose?.();
        dispatch(ToastActions.updateToastState({ show: false }));
    };

    const initialiser = async () => {
        setShowLoader(true);
        const userId = getStorageItem({ key: STORAGE_KEY.USERID, storageType: STORAGE_TYPE.COOKIE });
        if (userId) await storeUser({ userId });
        setShowLoader(false);
    };

    useEffect(() => {
        initialiser();
    }, []);

    return (
        <body className={showHamburger ? 'overflow-hidden' : ''}>
            <Provider store={store}>
                <CustomToast onClose={handleToastClose} {...toastProps} />
                <main>
                    {showLoader ? (
                        <PageLoader />
                    ) : (
                        <>
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
                        </>
                    )}
                </main>
            </Provider>
        </body>
    );
};

export default Layout;
