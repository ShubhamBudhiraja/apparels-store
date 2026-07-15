export interface IProductData {
    productId?: string;
    title?: string;
    description?: string;
    shortDescription?: string;
    price: number;
    offerPrice?: number;
    discountPercentage?: number;
    discountAmount?: number;
    currencySymbol?: string;
    images?: string[];
    thumbnail?: string;
    units?: number;
    rating?: number;
    ratingsCount?: number;
    inWishlist?: boolean;
    isAvailable?: boolean;
    quantity: number;
    segment?: string;
    category?: string;
    selectedVariant?: string;
}
