import style from './index.module.scss';
import React from 'react';
import SignupForm from './signupform';
import { Container } from 'react-bootstrap';
import SectionWrapper from '@atoms/SectionWrapper';

interface IMenuItem {
    linkText?: string;
    linkUrl?: string;
}

interface IFooterQuickMenu {
    title?: string;
    items?: IMenuItem[];
}

interface IFooter {
    formData?: {
        heading?: string;
        description?: string;
        placeholder?: string;
        btnText?: string;
    };
    siteInfo?: { logo?: string; address?: string; email?: string; phone?: string; quickMenu?: IFooterQuickMenu[] };
}

const Footer = (props: IFooter) => {
    const { formData, siteInfo } = props;

    return (
        <div className={style.footerWrapper}>
            <Container fluid>
                <SectionWrapper>
                    <SignupForm fieldId="emailId" {...formData} />
                </SectionWrapper>
                <div className={style.siteSummary}>
                    <div className={`${style.summaryCol} ${style.info}`}>
                        <a href="/">
                            <img src={siteInfo?.logo} alt="" />
                        </a>
                        <p>{siteInfo?.address}</p>
                        <p>{siteInfo?.email}</p>
                        <p>{siteInfo?.phone}</p>
                    </div>
                    {siteInfo?.quickMenu?.map((menu: IFooterQuickMenu, index: number) => (
                        <div className={`${style.summaryCol} ${style.quickLinks}`} key={`item_${index}`}>
                            <h5>{menu?.title}</h5>
                            <ul>
                                {menu?.items?.map((subItem: IMenuItem, subIndex: number) => (
                                    <li key={`subItem_${index}_${subIndex}`}>
                                        <a href={subItem?.linkUrl}>{subItem?.linkText}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default Footer;
