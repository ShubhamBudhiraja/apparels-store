import prisma from "../../config/prisma";
import { productInclude } from "./category";
import { resolveProductPricing, SaleLike } from "./pricing";

type CategoryWithParent = {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    parent?: {
        id: string;
        name: string;
        slug: string;
    } | null;
};

type ProductRecord = {
    productId: string;
    title: string;
    price: number;
    offerPrice: number | null;
    description: string | null;
    shortDescription: string | null;
    discountPercentage: number | null;
    discountAmount: number | null;
    images: string[];
    thumbnail: string | null;
    categoryId: string;
    category?: CategoryWithParent | null;
    variants: { variantId: string; units: number }[];
    sales?: { sale: SaleLike }[];
};

export const formatProduct = (
    product: ProductRecord,
    extras?: {
        ratings?: number;
        reviewsCount?: number;
        reviews?: {
            userId: string;
            rating: number;
            feedback: string | null;
        }[];
    },
) => {
    const leaf = product.category;
    const segmentSlug = leaf?.parent?.slug || leaf?.slug || "";
    const categorySlug = leaf?.parent ? leaf.slug : "";

    const pricing = resolveProductPricing({
        price: product.price,
        offerPrice: product.offerPrice,
        discountPercentage: product.discountPercentage,
        discountAmount: product.discountAmount,
        sales: (product.sales || []).map((entry) => entry.sale),
    });

    return {
        productId: product.productId,
        title: product.title,
        price: pricing.price,
        offerPrice: pricing.offerPrice,
        discountPercentage: pricing.discountPercentage,
        discountAmount: pricing.discountAmount,
        activeSale: pricing.activeSale,
        categoryId: product.categoryId,
        segment: segmentSlug,
        category: categorySlug || leaf?.slug || "",
        categoryName: leaf?.name,
        segmentName: leaf?.parent?.name || leaf?.name,
        description: product.description,
        shortDescription: product.shortDescription,
        images: product.images,
        thumbnail: product.thumbnail,
        variants: product.variants.map((variant) => ({
            id: variant.variantId,
            units: variant.units,
        })),
        ...(extras || {}),
    };
};

export const findProductByProductId = async (productId: string) => {
    return prisma.product.findUnique({
        where: { productId },
        include: productInclude,
    });
};

export const findProducts = async (filters: {
    productId?: string | { in: string[] };
    categoryId?: string | { in: string[] };
}) => {
    const where: {
        productId?: string | { in: string[] };
        categoryId?: string | { in: string[] };
    } = {};

    if (filters.productId) where.productId = filters.productId;
    if (filters.categoryId) where.categoryId = filters.categoryId;

    return prisma.product.findMany({
        where,
        include: productInclude,
    });
};

export const getFormattedProducts = async (filters?: {
    productId?: string | { in: string[] };
    categoryId?: string | { in: string[] };
}) => {
    const products = await findProducts(filters || {});
    return products.map((product) => formatProduct(product));
};

export const formatOrder = (order: {
    id: string;
    userId: string;
    orderId: string;
    orderTimeStamp: Date;
    status: string;
    couponDiscount: number;
    cartTotal: number;
    total: number;
    isDeliveryFeeIncluded: boolean;
    addressFirstName: string | null;
    addressLastName: string | null;
    addressMobileNo: string | null;
    addressHouseNo: string | null;
    addressStreetAddress: string | null;
    addressCity: string | null;
    addressPincode: string | null;
    addressState: string | null;
    feedbackRating: number | null;
    feedbackDescription: string | null;
    items: {
        id: string;
        productId: string;
        title: string;
        price: number;
        offerPrice: number | null;
        quantity: number;
        thumbnail: string | null;
        selectedVariant: string | null;
    }[];
}) => ({
    _id: order.id,
    userId: order.userId,
    orderId: order.orderId,
    orderTimeStamp: order.orderTimeStamp,
    status: order.status,
    couponDiscount: order.couponDiscount,
    cartTotal: order.cartTotal,
    total: order.total,
    isDeliveryFeeIncluded: order.isDeliveryFeeIncluded,
    address: {
        firstName: order.addressFirstName,
        lastName: order.addressLastName,
        mobileNo: order.addressMobileNo,
        houseNo: order.addressHouseNo,
        streetAddress: order.addressStreetAddress,
        city: order.addressCity,
        pincode: order.addressPincode,
        state: order.addressState,
    },
    feedback: {
        rating: order.feedbackRating || 0,
        description: order.feedbackDescription || undefined,
    },
    products: order.items.map((item) => ({
        _id: item.id,
        productId: item.productId,
        title: item.title,
        price: item.price,
        offerPrice: item.offerPrice,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
        selectedVariant: item.selectedVariant,
    })),
});
