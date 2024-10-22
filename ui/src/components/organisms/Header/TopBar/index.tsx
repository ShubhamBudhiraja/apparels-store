import React, { useEffect, useState } from 'react';
import style from './index.module.scss';
import { Container } from 'react-bootstrap';
import { CURRENCY } from 'src/lib/constants/product';
import { IDropdownOptions } from 'src/lib/interface/common';
import TopBarDropDown from './dropdown';
import { getStorageItem, setStorageItem } from '@utils/storage';
import { STORAGE_KEY, STORAGE_TYPE } from '@enums/storage';
import { ISocialIcons } from 'src/lib/interface/layout';

interface ITopBar {
    heading?: string;
    socialIcons?: ISocialIcons[];
    currencySelector?: { title?: string; id?: string }[];
}

const TopBar = (props: ITopBar) => {
    const { heading, socialIcons, currencySelector } = props;

    const [currency, setCurrency] = useState<IDropdownOptions>();

    const handleCurrencyChange = (currency: IDropdownOptions) => {
        setCurrency(currency);
        setStorageItem({ key: STORAGE_KEY.CURRENCY, value: currency?.id, storageType: STORAGE_TYPE.LOCAL });
        window.location.reload();
    };

    useEffect(() => {
        const currentCurrency = getStorageItem({ key: STORAGE_KEY.CURRENCY, storageType: STORAGE_TYPE.LOCAL });
        let selectedCurrency: any = {};
        if (!currentCurrency) {
            selectedCurrency = currencySelector?.find((cur: IDropdownOptions) => cur?.id === CURRENCY.INR);
        } else {
            selectedCurrency = currencySelector?.find((cur: IDropdownOptions) => cur?.id === currentCurrency);
        }
        setCurrency(selectedCurrency);
    }, [currencySelector]);

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
                <TopBarDropDown options={currencySelector} selected={currency} handleItemClick={handleCurrencyChange} />
            </Container>
        </div>
    );
};

export default TopBar;
