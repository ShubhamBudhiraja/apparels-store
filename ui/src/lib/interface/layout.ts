export interface ISingleNavItem {
    title?: string;
    link?: string;
    dropdownList: ISingleNavItem[];
}
