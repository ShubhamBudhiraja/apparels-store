import React, { useEffect, useState } from 'react';
import TopBar from './TopBar';
import { IHeaderData, ISingleNavItem, ISocialIcons } from 'src/lib/interface/layout';
import style from './index.module.scss';
import { Container } from 'react-bootstrap';
import Hamburger from './Hamburger';

interface IHeader extends IHeaderData {
    socialIcons?: ISocialIcons[];
    showHamburger: boolean;
    setShowHamburger: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = (props: IHeader) => {
    const { topBar, primaryMenu, secondaryMenu, socialIcons, logo, showHamburger, setShowHamburger, hamburgerData } =
        props;

    const [stickyHeader, setStickyHeader] = useState(false);

    const cartItemsCount = 3; // temporary
    const wishlistItemsCount = 1; // temporary

    const handleScroll = () => {
        const scroll = window.scrollY;
        const headerHeight = document.getElementById('main-header')?.clientHeight || 0;
        if (scroll > headerHeight) {
            setStickyHeader(true);
        } else setStickyHeader(false);
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
                                            <a href={menuItem?.link}>{menuItem?.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <a href="/" className={style.logo}>
                                <img src={logo} alt="site logo" />
                            </a>
                            <ul className={`${style.secondaryNav} flex-end`}>
                                {secondaryMenu?.map((menuItem: ISingleNavItem, index: number) => (
                                    <SecondaryNavItem
                                        key={`secondaryNav_${index}`}
                                        menuItem={menuItem}
                                        cartCount={cartItemsCount}
                                        wishlistCount={wishlistItemsCount}
                                    />
                                ))}
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
}

const SecondaryNavItem = (props: ISecondaryNavItem) => {
    const { menuItem, cartCount = 0, wishlistCount = 0 } = props;

    let counter = 0;

    switch (menuItem?.icon) {
        case 'bag':
            counter = cartCount;
            break;
        case 'wishlist':
            counter = wishlistCount;
            break;
        default:
            break;
    }

    return (
        <li>
            <a href={menuItem?.link}>
                <i className={`font icon-${menuItem?.icon}`}></i>
                {counter > 0 && <span>{counter}</span>}
            </a>
        </li>
    );
};

export default Header;
