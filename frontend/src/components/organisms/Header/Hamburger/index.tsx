import React from 'react';
import style from './index.module.scss';
import { IHamburgerData, ISingleNavItem } from 'src/lib/interface/layout';
import LinkWrapper from '@atoms/LinkWrapper';

interface IHamburger extends IHamburgerData {
    show: boolean;
}

const Hamburger = (props: IHamburger) => {
    const { show, bannerImage, heading, menuItems } = props;

    return (
        <div className={`${style.wrapper} ${show ? style.show : ''}`}>
            <figure>
                <img src={bannerImage} alt="hamburger-banner" />
            </figure>
            <div className={style.content}>
                <h2>{heading}</h2>
                <div>
                    {menuItems?.map((list: ISingleNavItem) => (
                        <div key={list?.title} className={style.categoryMenu}>
                            <h5>{list?.title}</h5>
                            <ul className="row">
                                {list?.subMenu?.map((item: ISingleNavItem) => (
                                    <li className="col-lg-4" key={`item_${list?.title}_${item?.title}`}>
                                        <LinkWrapper href={item?.link}>{item?.title}</LinkWrapper>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hamburger;
