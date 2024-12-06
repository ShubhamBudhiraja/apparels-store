export interface ICardDetails {
    cardSecurityCode: number;
    paymentMethodType: string;
    paymentMethod?: string;
    cardNumber?: string;
    cardExpMonth?: string;
    cardExpYear?: string;
    nameOnCard?: string;
    cardToken?: string;
    shouldSaveCard?: boolean;
    isSavedCard?: boolean;
}
