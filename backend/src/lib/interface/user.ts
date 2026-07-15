import { IProductData } from "./product";

export interface IUserAddress {
    firstName: string;
    lastName: string;
    mobileNo: string;
    houseNo: string;
    streetAddress: string;
    city: string;
    pincode: string;
    state: string;
    _id: string;
    isDefault?: boolean;
}

export interface IUserCartProducts extends IProductData {
    quantity: number;
    selectedVariant: string;
}

export interface IUserData {
    userId: string;
    firstName?: string | null;
    lastName?: string | null;
    dob?: Date | null;
    addresses?: IUserAddress[] | null;
    cart: {
        products?: IUserCartProducts[];
        total: number;
        cartTotal: number;
        couponDiscount: number;
        isDeliveryFeeIncluded?: boolean;
    };
}
