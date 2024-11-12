import { IProductData } from './products';

export interface IUserAddress {
    houseNo: string;
    city: string;
    pincode: string;
    state: string;
}

export interface IUserData {
    name?: string;
    userId?: string;
    mobileNo?: string;
    dob?: Date;
    address?: IUserAddress;
    wishlist?: IProductData[];
    cart?: { cartTotal?: number; total?: number; products?: IProductData[] };
}

export interface ILoginModalSuccess {
    userId?: string;
}
