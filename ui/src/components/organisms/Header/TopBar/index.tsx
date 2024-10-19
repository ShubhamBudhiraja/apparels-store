import React, { useEffect, useState } from 'react';
import style from './index.module.scss';
import { Container } from 'react-bootstrap';
import { CURRENCY } from 'src/lib/constants/product';
import { IDropdownOptions } from 'src/lib/interface/common';
import TopBarDropDown from './dropdown';
import { setStorageItem } from '@utils/storage';
import { STORAGE_KEY, STORAGE_TYPE } from '@enums/storage';

interface ISocialIcons {
    iconName?: string;
    iconUrl?: string;
}

interface ITopBar {
    heading?: string;
    socialIcons?: ISocialIcons[];
    currencySelector?: { title?: string; id?: string }[];
}

const TopBar = (props: ITopBar) => {
    const { heading, socialIcons, currencySelector } = props;

    const [currency, setCurrency] = useState<IDropdownOptions>();

    useEffect(() => {
        if (currencySelector?.length) {
            const inr = currencySelector?.find((cur: IDropdownOptions) => cur?.id === CURRENCY.INR);
            setCurrency(inr);
        }
    }, [currencySelector]);

    useEffect(() => {
        setStorageItem({ key: STORAGE_KEY.CURRENCY, value: currency?.id, storageType: STORAGE_TYPE.LOCAL });
    }, [currency]);

    return (
        <div className={style.wrapper}>
            <Container fluid className="flex-between">
                <div className={`${style.socialIcons} flex-between`}>
                    {socialIcons?.map((icon: ISocialIcons, index: number) => (
                        <a href={icon?.iconUrl} className="flex-center" key={`icon_${index}`}>
                            <i className={`font icon-${icon?.iconName}`}></i>
                        </a>
                    ))}
                </div>
                <h5>{heading}</h5>
                <TopBarDropDown options={currencySelector} selected={currency} setSelected={setCurrency} />
            </Container>
        </div>
    );
};

export default TopBar;
