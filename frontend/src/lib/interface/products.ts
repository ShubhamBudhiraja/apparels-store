export interface IProductData {
    id: string;
    name?: string;
    description?: string;
    shortDescription?: string;
    price?: string;
    offerPrice?: number;
    discountPer?: number;
    discountAmount?: number;
    currencySymbol?: string;
    images?: string[];
    units?: number;
    rating?: number;
    ratingsCount?: number;
    isWishlisted?: boolean;
    isInCart?: boolean;
}
