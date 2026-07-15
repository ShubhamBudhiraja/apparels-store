import prisma from "../../config/prisma";
import { BILLING_DETAILS } from "../../constants/common";
import { findProducts, formatProduct } from "./product";

/** Frontend still sends email as `userId` across APIs. */
export const resolveEmailId = (payload: {
    userId?: string;
    emailId?: string;
}) => payload.emailId || payload.userId;

export const findUserByEmail = async (emailId: string) => {
    return prisma.user.findUnique({
        where: { emailId },
        include: {
            addresses: { orderBy: { createdAt: "asc" } },
            cart: { include: { items: true } },
            wishlist: true,
        },
    });
};

export const ensureUserCart = async (userId: string) => {
    return prisma.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
        include: { items: true },
    });
};

const computeBilling = (cartTotal: number) => {
    if (cartTotal <= 0) {
        return {
            cartTotal: 0,
            total: 0,
            isDeliveryFeeIncluded: false,
            couponDiscount: 0,
        };
    }

    const isDeliveryFeeIncluded =
        cartTotal < BILLING_DETAILS.NO_DELIVERY_FEE_VALUE;

    return {
        cartTotal,
        total: isDeliveryFeeIncluded
            ? cartTotal + BILLING_DETAILS.DELIVERY_FEE
            : cartTotal,
        isDeliveryFeeIncluded,
        couponDiscount: 0,
    };
};

export const buildCartResponse = async (
    cartItems: {
        productId: string;
        selectedVariant: string;
        quantity: number;
    }[],
    wishlistProductIds: Set<string> = new Set(),
) => {
    if (!cartItems.length) {
        return {
            products: [],
            ...computeBilling(0),
        };
    }

    const productIds = [...new Set(cartItems.map((item) => item.productId))];
    const products = await findProducts({ productId: { in: productIds } });
    const productMap = new Map(
        products.map((product) => [
            product.productId,
            formatProduct(product),
        ]),
    );

    let cartTotal = 0;
    const hydratedProducts = cartItems
        .map((item) => {
            const product = productMap.get(item.productId);
            if (!product) return null;

            const variant = product.variants.find(
                (entry) => entry.id === item.selectedVariant,
            );
            const unitPrice = product.offerPrice || product.price;
            cartTotal += unitPrice * item.quantity;

            return {
                productId: product.productId,
                title: product.title,
                price: product.price,
                offerPrice: product.offerPrice,
                thumbnail: product.thumbnail,
                isAvailable: (variant?.units || 0) > 0,
                quantity: item.quantity,
                segment: product.segment,
                category: product.category,
                inWishlist: wishlistProductIds.has(item.productId),
                discountAmount: product.discountAmount,
                discountPercentage: product.discountPercentage,
                activeSale: product.activeSale,
                selectedVariant: item.selectedVariant,
            };
        })
        .filter(Boolean);

    return {
        products: hydratedProducts,
        ...computeBilling(cartTotal),
    };
};

export const buildWishlistResponse = async (
    wishlistItems: { productId: string }[],
) => {
    if (!wishlistItems.length) return [];

    const productIds = wishlistItems.map((item) => item.productId);
    const products = await findProducts({ productId: { in: productIds } });
    const productMap = new Map(
        products.map((product) => [
            product.productId,
            formatProduct(product),
        ]),
    );

    return wishlistItems
        .map((item) => {
            const product = productMap.get(item.productId);
            if (!product) return null;

            return {
                productId: product.productId,
                title: product.title,
                price: product.price,
                offerPrice: product.offerPrice,
                thumbnail: product.thumbnail,
                discountPercentage: product.discountPercentage,
            };
        })
        .filter(Boolean);
};

export const formatAddress = (address: {
    id: string;
    firstName: string;
    lastName: string;
    mobileNo: string;
    houseNo: string;
    streetAddress: string;
    city: string;
    pincode: string;
    state: string;
    isDefault: boolean;
}) => ({
    _id: address.id,
    firstName: address.firstName,
    lastName: address.lastName,
    mobileNo: address.mobileNo,
    houseNo: address.houseNo,
    streetAddress: address.streetAddress,
    city: address.city,
    pincode: address.pincode,
    state: address.state,
    isDefault: address.isDefault,
});

export const buildProfileResponse = async (
    user: NonNullable<Awaited<ReturnType<typeof findUserByEmail>>>,
) => {
    const wishlistProductIds = new Set(
        user.wishlist.map((item) => item.productId),
    );
    const cart = await buildCartResponse(
        user.cart?.items || [],
        wishlistProductIds,
    );
    const wishlist = await buildWishlistResponse(user.wishlist);

    return {
        userId: user.emailId,
        emailId: user.emailId,
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNo: user.mobileNo,
        dob: user.dateOfBirth,
        isVerified: user.isVerified,
        addresses: user.addresses.map(formatAddress),
        cart,
        wishlist,
    };
};
