export interface IProductData {
    productId?: string;
    title?: string;
    description?: string;
    shortDescription?: string;
    price?: number;
    offerPrice?: number;
    discountPercentage?: number;
    discountAmount?: number;
    currencySymbol?: string;
    images?: string[];
    units?: number;
    rating?: number;
    ratingsCount?: number;
    isWishlisted?: boolean;
    isInCart?: boolean;
}
