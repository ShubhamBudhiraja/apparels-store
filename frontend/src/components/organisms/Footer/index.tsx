import style from './index.module.scss';
import React from 'react';
import { Container } from 'react-bootstrap';
import { IFooterData, IFooterQuickMenu, ISingleNavItem, ISocialIcons } from 'src/lib/interface/layout';
import NewsletterForm from './newsletterForm';

interface IFooter extends IFooterData {
    socialIcons?: ISocialIcons[];
}

const Footer = (props: IFooter) => {
    const { formData, siteInfo, copyrightInfo, socialIcons } = props;

    return (
        <>
            <div className={style.footerWrapper}>
                <Container fluid>
                    <NewsletterForm fieldId="emailId" {...formData} />
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
                                    {menu?.items?.map((subItem: ISingleNavItem, subIndex: number) => (
                                        <li key={`subItem_${index}_${subIndex}`}>
                                            <a href={subItem?.link}>{subItem?.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
            <div className={style.slimFooter}>
                <Container fluid className="flex-between">
                    <span>{copyrightInfo}</span>
                    <div className={`${style.socialIcons} flex-between`}>
                        {socialIcons?.map((icon: ISocialIcons, index: number) => (
                            <a href={icon?.iconUrl} key={`icon_${index}`}>
                                <i className={`font icon-${icon?.iconName}`}></i>
                            </a>
                        ))}
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Footer;
