import { IDropdownOptions } from './common';

export interface ISingleNavItem {
    title?: string;
    link?: string;
    icon?: string;
    subMenu?: ISingleNavItem[];
}

export interface ISocialIcons {
    iconName?: string;
    iconUrl?: string;
}

export interface ITopBarData {
    heading?: string;
    currencySelector?: IDropdownOptions[];
}
export interface IHamburgerData {
    bannerImage?: string;
    heading?: string;
    menuItems?: ISingleNavItem[];
}

export interface IHeaderData {
    topBar?: ITopBarData;
    primaryMenu?: ISingleNavItem[];
    secondaryMenu?: ISingleNavItem[];
    logo?: string;
    hamburgerData?: IHamburgerData;
}

export interface INewsletterForm {
    fieldId: string;
    heading?: string;
    description?: string;
    placeholder?: string;
    btnText?: string;
}

export interface IFooterQuickMenu {
    title?: string;
    items?: ISingleNavItem[];
}

export interface IFooterData {
    formData?: INewsletterForm;
    siteInfo?: { logo?: string; address?: string; email?: string; phone?: string; quickMenu?: IFooterQuickMenu[] };
    copyrightInfo?: string;
}

export interface IToast {
    show?: boolean;
    title?: string;
    description?: string;
    autohide?: boolean;
    autohideDelay?: number;
    onClose?: () => void;
}
