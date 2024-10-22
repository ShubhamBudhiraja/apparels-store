export interface ISingleNavItem {
    title?: string;
    link?: string;
    icon?: string;
    dropdownList?: ISingleNavItem[];
}

export interface ISocialIcons {
    iconName?: string;
    iconUrl?: string;
}
