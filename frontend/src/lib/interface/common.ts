import { ModalHeaderProps } from 'react-bootstrap';

export interface IDropdownOptions {
    title?: string;
    id?: string;
}

export interface ISingleSlide {
    heading?: string;
    subHeading?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundImage?: string;
}

export interface IOverlay {
    show?: boolean;
    onHide: () => void;
    heading?: string;
    headerProps?: ModalHeaderProps;
    children?: React.ReactNode;
    bodyClassName?: string;
}

export interface IFormData {
    id: string;
    placeholder?: string;
}
