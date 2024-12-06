export interface IProductVariant {
    id: string;
    units: number;
}

export interface IProductData {
    productId: string;
    title: string;
    price: number;
    offerPrice?: number | null;
    segment: string;
    category: string;
    variants: IProductVariant[];
    description?: string | null;
    shortDescription?: string | null;
    discountPercentage?: number | null;
    discountAmount?: number | null;
    images?: string[] | null;
    thumbnail?: string | null;
}
