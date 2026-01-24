import { IUserAddress } from './user';

export interface Order {
    address: IUserAddress;
    total: number;
    feedback: {
        rating: number;
    };
    _id: number;
    userId: string;
    cartTotal: number;
    couponDiscount: number;
    isDeliveryFeeIncluded: boolean;
    orderId: number;
    orderTimeStamp: string;
    status: string;
    products: [
        {
            productId: string;
            title: string;
            price: number;
            offerPrice: number;
            quantity: number;
            thumbnail: string;
            selectedVariant: string;
            _id: string;
        }
    ];
}
