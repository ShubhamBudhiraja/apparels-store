import React, { useCallback, useEffect, useState } from 'react';
import TopBar from './TopBar';
import style from './index.module.scss';
import { Container } from 'react-bootstrap';
import Hamburger from './Hamburger';
import { useAppSelector } from '@store';
import { IHeaderData, ISingleNavItem, ISocialIcons } from '@interface/layout';
import useLogin from '@customHooks/useLogin';
import LinkWrapper from '@atoms/LinkWrapper';
import { useRouter } from 'next/navigation';

interface IHeader extends IHeaderData {
    socialIcons?: ISocialIcons[];
    showHamburger: boolean;
    setShowHamburger: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = (props: IHeader) => {
    const { topBar, primaryMenu, secondaryMenu, socialIcons, logo, showHamburger, setShowHamburger, hamburgerData } =
        props;

    const { userId, cart, wishlist } = useAppSelector((state) => state.userProfile);
    const { handleLogout, initiateLogin } = useLogin();
    const router = useRouter();

    const [stickyHeader, setStickyHeader] = useState(false);

    const handleScroll = () => {
        const scroll = window.scrollY;
        const headerHeight = document.getElementById('main-header')?.clientHeight || 0;
        if (scroll > headerHeight) {
            setStickyHeader(true);
        } else setStickyHeader(false);
    };

    const handleSecondaryNavClick = (e?: any, url?: string) => {
        e?.preventDefault();
        if (!userId) {
            initiateLogin();
        } else if (url) router.push(url);
    };

    useEffect(() => {
        document.addEventListener('scroll', () => handleScroll());

        return document.removeEventListener('scroll', () => handleScroll());
    }, []);

    return (
        <>
            <header id="main-header" className={`${style.headerWrapper} ${stickyHeader ? style.fixed : ''}`}>
                <section>
                    <TopBar
                        heading={topBar?.heading}
                        socialIcons={socialIcons}
                        currencySelector={topBar?.currencySelector}
                    />
                    <div className={style.wrapper}>
                        <Container fluid className="flex">
                            <div className={`${style.primaryMenu} flex`}>
                                <div
                                    className={`${style.hamburger} ${showHamburger ? style.open : ''}`}
                                    onClick={() => {
                                        setShowHamburger(!showHamburger);
                                    }}
                                >
                                    <span />
                                    <span />
                                </div>
                                <ul className="flex">
                                    {primaryMenu?.map((menuItem: ISingleNavItem, index: number) => (
                                        <li key={`primaryMenuItem_${index}`}>
                                            <LinkWrapper href={menuItem?.link}>{menuItem?.title}</LinkWrapper>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <LinkWrapper href="/" className={style.logo}>
                                <img src={logo} alt="site logo" />
                            </LinkWrapper>
                            <ul className={`${style.secondaryNav} flex-end`}>
                                {secondaryMenu?.map((menuItem: ISingleNavItem, index: number) => (
                                    <SecondaryNavItem
                                        key={`secondaryNav_${index}`}
                                        menuItem={menuItem}
                                        cartCount={cart?.products?.length || 0}
                                        wishlistCount={wishlist?.length || 0}
                                        itemClick={handleSecondaryNavClick}
                                    />
                                ))}
                                {userId && (
                                    <li>
                                        <LinkWrapper href="javascript:void(0)" onClick={handleLogout}>
                                            <i className="font icon-logout"></i>
                                        </LinkWrapper>
                                    </li>
                                )}
                            </ul>
                        </Container>
                    </div>
                </section>
            </header>
            <Hamburger
                show={showHamburger}
                bannerImage={hamburgerData?.bannerImage}
                heading={hamburgerData?.heading}
                menuItems={hamburgerData?.menuItems}
            />
        </>
    );
};

interface ISecondaryNavItem {
    menuItem: ISingleNavItem;
    cartCount?: number;
    wishlistCount?: number;
    itemClick?: (e?: any, url?: string) => void;
}

const SecondaryNavItem = (props: ISecondaryNavItem) => {
    const { menuItem, cartCount = 0, wishlistCount = 0, itemClick } = props;

    let counter = 0;

    switch (menuItem?.icon) {
        case 'bag':
            counter = cartCount;
            break;
        case 'heart':
            counter = wishlistCount;
            break;
        default:
            break;
    }

    return (
        <li>
            <LinkWrapper href={menuItem?.link} onClick={(e: any) => itemClick?.(e, menuItem?.link)}>
                <i className={`font icon-${menuItem?.icon}`}></i>
                {counter > 0 && <span>{counter}</span>}
            </LinkWrapper>
        </li>
    );
};

export default Header;
