import { UserModel } from "../models/user.model";
import { BILLING_DETAILS, CART_OPERATION } from "../constants/common";
import { generateCommonResponse } from "../lib/utils/common";
import { ProductModel } from "../models/product.model";

export const CartControllers = () => {
    const handleDeletion = async (userDetails: any, productIndex: number) => {
        const cartData = userDetails.cart;
        cartData.cartTotal -=
            cartData.products[productIndex].quantity *
            (cartData.products[productIndex].offerPrice ||
                cartData.products[productIndex].price);
        cartData.total -=
            cartData.products[productIndex].quantity *
            (cartData.products[productIndex].offerPrice ||
                cartData.products[productIndex].price);

        if (cartData.cartTotal > 0) {
            if (cartData.isDeliveryFeeIncluded) {
                if (
                    cartData.cartTotal > BILLING_DETAILS.NO_DELIVERY_FEE_VALUE
                ) {
                    cartData.total -= BILLING_DETAILS.DELIVERY_FEE;
                    cartData.isDeliveryFeeIncluded = false;
                }
            } else {
                if (
                    cartData.cartTotal < BILLING_DETAILS.NO_DELIVERY_FEE_VALUE
                ) {
                    cartData.total += BILLING_DETAILS.DELIVERY_FEE;
                    cartData.isDeliveryFeeIncluded = true;
                }
            }
        } else {
            cartData.total = 0;
            cartData.isDeliveryFeeIncluded = false;
        }

        cartData.products.splice(productIndex, 1);

        return await UserModel.findOneAndUpdate(
            { userId: userDetails.userId },
            { $set: { cart: cartData, wishlist: userDetails.wishlist } }
        );
    };

    const addToCart = async (req: any, res: any) => {
        const { userId, prodId, variant } = req.body;

        try {
            const foundProduct = await ProductModel.findOne({
                productId: prodId,
            });
            const foundUser = await UserModel.findOne({ userId });

            if (foundUser) {
                console.log("user found");

                if (foundProduct) {
                    console.log(foundProduct, "product found");

                    const foundVariant = foundProduct.variants.find(
                        (item: any) => item.id === variant
                    );

                    if (foundVariant) {
                        if (foundVariant.units === 0) {
                            console.log("product is out of stock");

                            return res
                                .status(200)
                                .json(generateCommonResponse(4007));
                        }

                        const wishlistData = foundUser.get("wishlist");
                        const cartData = foundUser.get("cart");

                        if (
                            cartData.products?.find(
                                (prod) =>
                                    prod.productId === prodId &&
                                    prod.selectedVariant === variant
                            )
                        ) {
                            console.log("product already added in cart");

                            return res
                                .status(200)
                                .json(generateCommonResponse(4005));
                        } else {
                            console.log("adding product to cart");

                            const prodPosInWishlist = wishlistData.findIndex(
                                (prod) => prod.productId === prodId
                            );

                            const productDetails = {
                                productId: foundProduct.get("productId"),
                                title: foundProduct.get("title"),
                                price: foundProduct.get("price"),
                                offerPrice: foundProduct.get("offerPrice"),
                                thumbnail: foundProduct.get("thumbnail"),
                                isAvailable: true,
                                quantity: 1,
                                segment: foundProduct.get("segment"),
                                category: foundProduct.get("category"),
                                inWishlist: prodPosInWishlist !== -1,
                                discountAmount:
                                    foundProduct.get("discountAmount"),
                                selectedVariant: variant,
                            };
                            cartData;
                            cartData.cartTotal +=
                                foundProduct.get("offerPrice") ||
                                foundProduct.get("price");
                            cartData.total +=
                                foundProduct.get("offerPrice") ||
                                foundProduct.get("price");

                            if (cartData.isDeliveryFeeIncluded) {
                                if (
                                    cartData.cartTotal >
                                    BILLING_DETAILS.NO_DELIVERY_FEE_VALUE
                                ) {
                                    cartData.total -=
                                        BILLING_DETAILS.DELIVERY_FEE;
                                    cartData.isDeliveryFeeIncluded = false;
                                }
                            } else {
                                if (
                                    cartData.cartTotal <
                                    BILLING_DETAILS.NO_DELIVERY_FEE_VALUE
                                ) {
                                    cartData.total +=
                                        BILLING_DETAILS.DELIVERY_FEE;
                                    cartData.isDeliveryFeeIncluded = true;
                                }
                            }

                            foundUser.set("cart", {
                                ...cartData,
                                products: [
                                    productDetails,
                                    ...cartData.products,
                                ],
                            });

                            await UserModel.findOneAndUpdate(
                                { userId },
                                {
                                    $set: { cart: foundUser.cart },
                                }
                            );

                            return res
                                .status(200)
                                .json(generateCommonResponse(2007, true));
                        }
                    } else {
                        console.log("variant not found");
                        return res
                            .status(200)
                            .json(generateCommonResponse(4016));
                    }
                } else {
                    console.log("product not found");
                    return res.status(200).json(generateCommonResponse(4008));
                }
            } else {
                console.log("user not found while adding product to cart");
                return res.status(200).json(generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while adding product to cart", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const updateCart = async (req: any, res: any) => {
        const { userId, prodId, variant, operation } = req.body;

        try {
            const foundProduct = await ProductModel.findOne({
                productId: prodId,
            });
            const foundUser = await UserModel.findOne({ userId });

            if (foundUser) {
                console.log("user found");

                if (foundProduct) {
                    console.log("product found");
                    const variantData = foundProduct?.variants?.find(
                        (item) => item?.id === variant
                    );

                    if (variantData?.units === 0) {
                        console.log("product is out of stock");

                        return res
                            .status(200)
                            .json(generateCommonResponse(4007));
                    }

                    const userDetails = foundUser;
                    const productIndex = userDetails.cart.products.findIndex(
                        (prod) =>
                            prod.productId === prodId &&
                            prod.selectedVariant === variant
                    );

                    if (productIndex === -1) {
                        console.log("product not found in cart");

                        return res
                            .status(200)
                            .json(generateCommonResponse(4006));
                    } else {
                        console.log("updating cart");

                        switch (operation) {
                            case CART_OPERATION.INCREASE:
                                if (
                                    userDetails.cart.products[productIndex]
                                        .quantity === variantData?.units
                                ) {
                                    console.log("maximum inventory reached");

                                    return res
                                        .status(200)
                                        .json(generateCommonResponse(4009));
                                } else {
                                    userDetails.cart.products[
                                        productIndex
                                    ].quantity += 1;
                                    userDetails.cart.cartTotal +=
                                        foundProduct.offerPrice ||
                                        foundProduct.price;
                                    userDetails.cart.total +=
                                        foundProduct.offerPrice ||
                                        foundProduct.price;

                                    if (
                                        userDetails.cart.isDeliveryFeeIncluded
                                    ) {
                                        if (
                                            userDetails.cart.cartTotal >
                                            BILLING_DETAILS.NO_DELIVERY_FEE_VALUE
                                        ) {
                                            userDetails.cart.total -=
                                                BILLING_DETAILS.DELIVERY_FEE;
                                            userDetails.cart.isDeliveryFeeIncluded =
                                                false;
                                        }
                                    } else {
                                        if (
                                            userDetails.cart.cartTotal <
                                            BILLING_DETAILS.NO_DELIVERY_FEE_VALUE
                                        ) {
                                            userDetails.cart.total +=
                                                BILLING_DETAILS.DELIVERY_FEE;
                                            userDetails.cart.isDeliveryFeeIncluded =
                                                true;
                                        }
                                    }

                                    await UserModel.findOneAndUpdate(
                                        { userId },
                                        { $set: { cart: userDetails.cart } }
                                    );

                                    return res
                                        .status(200)
                                        .json(
                                            generateCommonResponse(2008, true)
                                        );
                                }
                            case CART_OPERATION.DECREASE:
                                if (
                                    userDetails.cart.products[productIndex]
                                        .quantity === 1
                                ) {
                                    await handleDeletion(
                                        userDetails,
                                        productIndex
                                    );

                                    return res
                                        .status(200)
                                        .json(
                                            generateCommonResponse(2009, true)
                                        );
                                } else {
                                    userDetails.cart.products[
                                        productIndex
                                    ].quantity -= 1;
                                    userDetails.cart.cartTotal -=
                                        foundProduct.offerPrice ||
                                        foundProduct.price;
                                    userDetails.cart.total -=
                                        foundProduct.offerPrice ||
                                        foundProduct.price;

                                    if (
                                        userDetails.cart.isDeliveryFeeIncluded
                                    ) {
                                        if (
                                            userDetails.cart.cartTotal >
                                            BILLING_DETAILS.NO_DELIVERY_FEE_VALUE
                                        ) {
                                            userDetails.cart.total -=
                                                BILLING_DETAILS.DELIVERY_FEE;
                                            userDetails.cart.isDeliveryFeeIncluded =
                                                false;
                                        }
                                    } else {
                                        if (
                                            userDetails.cart.cartTotal <
                                            BILLING_DETAILS.NO_DELIVERY_FEE_VALUE
                                        ) {
                                            userDetails.cart.total +=
                                                BILLING_DETAILS.DELIVERY_FEE;
                                            userDetails.cart.isDeliveryFeeIncluded =
                                                true;
                                        }
                                    }

                                    await UserModel.findOneAndUpdate(
                                        { userId },
                                        { $set: { cart: userDetails.cart } }
                                    );

                                    return res
                                        .status(200)
                                        .json(
                                            generateCommonResponse(2008, true)
                                        );
                                }
                            default:
                                console.log("invalid operation");
                                return res
                                    .status(200)
                                    .json(generateCommonResponse(4010));
                        }
                    }
                } else {
                    console.log("product not found");
                    return res.status(200).json(generateCommonResponse(4008));
                }
            } else {
                console.log("user not found while adding product to cart");
                return res.status(200).json(generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while adding product to cart", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const deleteFromCart = async (req: any, res: any) => {
        const { userId, prodId, variant } = req.query;

        try {
            const foundProduct = await ProductModel.findOne({
                productId: prodId,
            });
            const foundUser = await UserModel.findOne({ userId });

            if (foundUser) {
                console.log("user found");

                if (foundProduct) {
                    console.log("product found");

                    const userDetails = foundUser;
                    const productIndex = userDetails.cart.products.findIndex(
                        (prod) =>
                            prod.productId === prodId &&
                            prod.selectedVariant === variant
                    );
                    if (productIndex !== -1) {
                        console.log("updating cart");

                        await handleDeletion(userDetails, productIndex);
                        console.log("deleted");

                        return res
                            .status(200)
                            .json(generateCommonResponse(2009, true));
                    } else {
                        console.log("product not found in cart");
                        return res
                            .status(200)
                            .json(generateCommonResponse(4006));
                    }
                } else {
                    console.log("product not found");
                    return res.status(200).json(generateCommonResponse(4008));
                }
            } else {
                console.log("user not found while deleting product from cart");
                return res.status(200).json(generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while deleting product from cart", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    return { addToCart, updateCart, deleteFromCart };
};
