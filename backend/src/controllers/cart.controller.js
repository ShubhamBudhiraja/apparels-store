const { CART_OPERATION } = require("../constants/common");
const ProductModel = require("../models/product.model");
const UserModel = require("../models/user.model");
const commonUtils = require("../utils/common");

const CartControllers = () => {
    const { generateCommonResponse } = commonUtils();

    const handleDeletion = async (userDetails, productIndex) => {
        const cartData = userDetails.cart;
        cartData.cartTotal -=
            cartData.products[productIndex].quantity *
            cartData.products[productIndex].price;
        cartData.total -=
            cartData.products[productIndex].quantity *
            (cartData.products[productIndex].offerPrice ||
                cartData.products[productIndex].price);
        cartData.discount -=
            cartData.products[productIndex].quantity *
            cartData.products[productIndex].discountAmount;

        cartData.products.splice(productIndex, 1);

        return await UserModel.findOneAndUpdate(
            { userId: userDetails.userId },
            { $set: { cart: cartData, wishlist: userDetails.wishlist } }
        );
    };

    const addToCart = async (req, res) => {
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
                        (item) => item.id === variant
                    );

                    if (foundVariant) {
                        if (foundVariant.units === 0) {
                            console.log("product is out of stock");

                            return res
                                .status(400)
                                .json(generateCommonResponse(4007));
                        }

                        const userDetails = foundUser;
                        console.log(userDetails, "userDetails");

                        if (
                            userDetails.cart.products.find(
                                (prod) =>
                                    prod.productId === prodId &&
                                    prod.selectedVariant === variant
                            )
                        ) {
                            console.log("product already added in cart");

                            return res
                                .status(400)
                                .json(generateCommonResponse(4005));
                        } else {
                            console.log("adding product to cart");

                            const prodPosInWishlist =
                                userDetails.wishlist.findIndex(
                                    (prod) => prod.productId === prodId
                                );
                            if (prodPosInWishlist !== -1)
                                userDetails.wishlist[prodPosInWishlist].inCart =
                                    true;
                            const {
                                productId,
                                title,
                                price,
                                offerPrice,
                                thumbnail,
                                segment,
                                category,
                                discountAmount,
                            } = foundProduct;

                            const productDetails = {
                                productId,
                                title,
                                price,
                                offerPrice,
                                thumbnail,
                                isAvailable: true,
                                quantity: 1,
                                segment,
                                category,
                                inWishlist: prodPosInWishlist !== -1,
                                discountAmount,
                                selectedVariant: variant,
                            };
                            userDetails.cart.cartTotal += price;
                            userDetails.cart.total += offerPrice || price;
                            userDetails.cart.discount += discountAmount;
                            userDetails.cart.products = [
                                productDetails,
                                ...userDetails.cart.products,
                            ];

                            await UserModel.findOneAndUpdate(
                                { userId },
                                {
                                    $set: { cart: userDetails.cart },
                                }
                            );

                            return res
                                .status(200)
                                .json(generateCommonResponse(2007, true));
                        }
                    } else {
                        console.log("variant not found");
                        return res
                            .status(400)
                            .json(generateCommonResponse(4016));
                    }
                } else {
                    console.log("product not found");
                    return res.status(400).json(generateCommonResponse(4008));
                }
            } else {
                console.log("user not found while adding product to cart");
                return res.status(400).json(generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while adding product to cart", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const updateCart = async (req, res) => {
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

                    if (variantData.units === 0) {
                        console.log("product is out of stock");

                        return res
                            .status(400)
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
                            .status(400)
                            .json(generateCommonResponse(4006));
                    } else {
                        console.log("updating cart");

                        switch (operation) {
                            case CART_OPERATION.INCREASE:
                                if (
                                    userDetails.cart.products[productIndex]
                                        .quantity === variantData.units
                                ) {
                                    console.log("maximum inventory reached");

                                    return res
                                        .status(400)
                                        .json(generateCommonResponse(4009));
                                } else {
                                    userDetails.cart.products[
                                        productIndex
                                    ].quantity += 1;
                                    userDetails.cart.cartTotal +=
                                        foundProduct.price;
                                    userDetails.cart.total +=
                                        foundProduct.offerPrice ||
                                        foundProduct.price;
                                    userDetails.cart.discount +=
                                        foundProduct.discountAmount;

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
                                        foundProduct.price;
                                    userDetails.cart.total -=
                                        foundProduct.offerPrice ||
                                        foundProduct.price;
                                    userDetails.cart.discount -=
                                        foundProduct.discountAmount;

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
                                    .status(400)
                                    .json(generateCommonResponse(4010));
                        }
                    }
                } else {
                    console.log("product not found");
                    return res.status(400).json(generateCommonResponse(4008));
                }
            } else {
                console.log("user not found while adding product to cart");
                return res.status(400).json(generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while adding product to cart", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const deleteFromCart = async (req, res) => {
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
                            .status(400)
                            .json(generateCommonResponse(4006));
                    }
                } else {
                    console.log("product not found");
                    return res.status(400).json(generateCommonResponse(4008));
                }
            } else {
                console.log("user not found while deleting product from cart");
                return res.status(400).json(generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while deleting product from cart", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    return { addToCart, updateCart, deleteFromCart };
};

module.exports = CartControllers;
