import prisma from "../../config/prisma";
import { IProductData, IProductVariant } from "../interface/product";
import { IUserCartProducts, IUserData } from "../interface/user";
import { getFormattedProducts } from "./product";

export const updateProductInventory = async (
    allProducts: IProductData[],
    cartProducts: IUserCartProducts[],
) => {
    const updates: { productId: string; variantId: string; units: number }[] =
        [];

    allProducts.forEach((product) => {
        cartProducts.forEach((cartProduct) => {
            if (product.productId !== cartProduct.productId) return;

            const variant = product.variants.find(
                (entry: IProductVariant) =>
                    entry.id === cartProduct.selectedVariant,
            );

            if (variant) {
                updates.push({
                    productId: product.productId,
                    variantId: variant.id,
                    units: variant.units - cartProduct.quantity,
                });
            }
        });
    });

    console.log("updating product inventory");

    await Promise.allSettled(
        updates.map((update) =>
            prisma.productVariant.update({
                where: {
                    productId_variantId: {
                        productId: update.productId,
                        variantId: update.variantId,
                    },
                },
                data: { units: Math.max(update.units, 0) },
            }),
        ),
    );

    console.log("product inventory updated");
};

export const checkProductsAvailability = (
    allProducts: IProductData[],
    cartProducts: IUserCartProducts[],
) => {
    for (const cartProduct of cartProducts) {
        const product = allProducts.find(
            (entry) => entry.productId === cartProduct.productId,
        );
        const variant = product?.variants.find(
            (entry) => entry.id === cartProduct.selectedVariant,
        );

        if (!variant || variant.units < cartProduct.quantity) {
            return false;
        }
    }

    return true;
};

export const generateOrderDetails = ({
    orderId,
    addressId,
    userDetails,
}: {
    orderId: string;
    addressId: string;
    userDetails: IUserData;
}) => {
    const address = userDetails.addresses?.find(
        (entry) => entry._id === addressId,
    );

    return {
        orderId,
        orderTimeStamp: new Date(),
        cartTotal: userDetails.cart.cartTotal,
        total: userDetails.cart.total,
        isDeliveryFeeIncluded: userDetails.cart.isDeliveryFeeIncluded,
        couponDiscount: userDetails.cart.couponDiscount || 0,
        products:
            userDetails.cart.products?.map((product) => ({
                productId: product.productId,
                title: product.title || "",
                price: product.price,
                offerPrice: product.offerPrice,
                quantity: product.quantity,
                thumbnail: product.thumbnail,
                selectedVariant: product.selectedVariant,
            })) || [],
        address,
    };
};

export { getFormattedProducts };
