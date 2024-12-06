import { ProductModel } from "../../models/product.model";
import { IProductData, IProductVariant } from "../interface/product";
import { IUserCartProducts, IUserData } from "../interface/user";

export const updateProduct = (productId: string, variants: any) => {
    return ProductModel.findOneAndUpdate({ productId }, { $set: { variants } });
};

export const updateProductInventory = async (
    allProducts: IProductData[],
    cartProducts: IUserCartProducts[]
) => {
    const record: any = {};

    allProducts.forEach((product: any) => {
        const prod = product;
        cartProducts.forEach((cartProduct) => {
            const variantIndex = prod.variants.findIndex(
                (variant: IProductVariant) =>
                    variant.id === cartProduct.selectedVariant
            );
            if (variantIndex !== -1) {
                prod.variants[variantIndex].units -= cartProduct.quantity;
                record[cartProduct.productId] = prod.variants;
            }
        });
    });

    console.log("updating product inventory");

    const productPromise = Object.entries(record).map(([key, value]) =>
        updateProduct(key, value)
    );
    await Promise.allSettled(productPromise);

    console.log("product inventory updated");
};

export const checkProductsAvailability = (
    allProducts: IProductData[],
    cartProducts: IUserCartProducts[]
) => {
    let allProductsAvailable = true;
    for (
        let productIndex = 0;
        productIndex < allProducts.length;
        productIndex++
    ) {
        for (
            let cartProductIndex = 0;
            cartProductIndex < cartProducts.length;
            cartProductIndex++
        ) {
            const addedVariant = allProducts[productIndex].variants.find(
                (variant) =>
                    variant.id ===
                    cartProducts[cartProductIndex].selectedVariant
            );
            if (
                addedVariant &&
                addedVariant.units < cartProducts[cartProductIndex].quantity
            ) {
                allProductsAvailable = false;
                break;
            }
        }
        if (!allProductsAvailable) break;
    }

    return allProductsAvailable;
};

export const generateOrderDetails = ({
    orderId,
    addressId,
    userDetails,
}: {
    orderId: string;
    addressId: string;
    userDetails: IUserData;
}) => ({
    orderId,
    orderTimeStamp: new Date(),
    cartTotal: userDetails.cart.cartTotal,
    total: userDetails.cart.total,
    isDeliveryFeeIncluded: userDetails.cart.isDeliveryFeeIncluded,
    couponDiscount: userDetails.cart.couponDiscount,
    products: userDetails.cart.products?.map((product) => ({
        productId: product.productId,
        title: product.title,
        price: product.price,
        offerPrice: product.offerPrice,
        quantity: product.quantity,
        thumbnail: product.thumbnail,
        selectedVariant: product.selectedVariant,
    })),
    address: userDetails.addresses?.find(
        (address) => address._id.toString() === addressId
    ),
});
