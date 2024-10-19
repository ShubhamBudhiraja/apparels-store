import React from 'react';
import TopBar from './TopBar';
import { ISingleNavItem } from 'src/lib/interface/layout';

interface IHeader {
    topBar?: any;
    primaryMenu?: ISingleNavItem;
}

const Header = (props: IHeader) => {
    const { topBar } = props;

    return (
        <header>
            <TopBar
                heading={topBar?.heading}
                socialIcons={topBar?.socialIcons}
                currencySelector={topBar?.currencySelector}
            />
        </header>
    );
};

export default Header;
