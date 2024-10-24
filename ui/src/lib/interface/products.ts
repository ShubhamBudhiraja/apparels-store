export interface IProductData {
    title?: string;
    price?: string;
    offerPrice?: number;
    discountPer?: number;
    discountAmount?: number;
    currencySymbol?: string;
    images?: string[];
    shortDescription?: string;
    units?: number;
    isWishlisted?: boolean;
    isInCart?: boolean;
}
