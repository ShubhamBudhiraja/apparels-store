import React, { useState } from 'react';
import TopBar from './TopBar';
import { ISingleNavItem } from 'src/lib/interface/layout';
import style from './index.module.scss';
import { Container } from 'react-bootstrap';

interface IHeader {
    topBar?: any;
    primaryMenu?: ISingleNavItem;
}

const Header = (props: IHeader) => {
    const { topBar } = props;

    const [openHam, setOpenHam] = useState(false);

    return (
        <header>
            <TopBar
                heading={topBar?.heading}
                socialIcons={topBar?.socialIcons}
                currencySelector={topBar?.currencySelector}
            />
            <div className={style.wrapper}>
                <Container fluid className="flex-between">
                    <div className={`${style.primaryMenu} flex`} onClick={() => setOpenHam(!openHam)}>
                        <div className={`${style.hamburger} ${openHam ? style.open : ''}`}>
                            <span />
                            <span />
                        </div>
                    </div>
                </Container>
            </div>
        </header>
    );
};

export default Header;
