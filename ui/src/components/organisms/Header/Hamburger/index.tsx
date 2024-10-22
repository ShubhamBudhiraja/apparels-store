import React from 'react';
import style from './index.module.scss';
import { ISingleNavItem } from 'src/lib/interface/layout';
import { Col, Row } from 'react-bootstrap';

interface IHamburger {
    show: boolean;
    heading?: string;
    menuList?: any;
    bannerImg?: string;
}

const Hamburger = (props: IHamburger) => {
    const { show, bannerImg, heading, menuList } = props;

    return (
        <div className={`${style.wrapper} ${show ? style.show : ''}`}>
            <figure>
                <img src={bannerImg} alt="hamburger-banner" />
            </figure>
            <div className={style.content}>
                <h2>{heading}</h2>
                <div>
                    {menuList?.map((list: ISingleNavItem) => (
                        <div key={list?.title} className={style.categoryMenu}>
                            <h5>{list?.title}</h5>
                            <ul className="row">
                                {list?.subMenu?.map((item: ISingleNavItem) => (
                                    <li className="col-lg-4" key={`item_${list?.title}_${item?.title}`}>
                                        <a href={item?.link}>{item?.title}</a>
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
