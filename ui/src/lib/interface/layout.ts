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
