import { IProductData } from './products';

export interface IUserAddress {
    houseNo: string;
    city: string;
    pincode: string;
    state: string;
}

export interface IUserData {
    name?: string;
    email?: string;
    mobileNo?: string;
    dob?: Date;
    address?: IUserAddress;
    wishlist?: IProductData[];
    cart?: IProductData[];
}
