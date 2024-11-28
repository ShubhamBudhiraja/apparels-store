import { IProductData } from './products';

export interface IUserAddress {
    _id?: string;
    firstName?: string;
    lastName?: string;
    mobileNo?: string;
    houseNo?: string;
    streetAddress?: string;
    city?: string;
    pincode?: string;
    state?: string;
}

export interface IProfileDetails {
    firstName?: string;
    lastName?: string;
    userId?: string;
    mobileNo?: string;
    dob?: Date;
    selectedAddress?: string;
}

export interface ICartData {
    cartTotal: number;
    total: number;
    products: IProductData[];
    isDeliveryFeeIncluded?: boolean;
}

export interface IUserData extends IProfileDetails {
    addresses?: IUserAddress[];
    wishlist?: IProductData[];
    cart: ICartData;
}

export interface ILoginModalSuccess {
    userId?: string;
}
