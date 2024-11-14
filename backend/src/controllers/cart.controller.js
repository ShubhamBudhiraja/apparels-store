const GLOBAL_CONSTANTS = require("../constants/common");
const ProductModel = require("../models/product.model");
const UserModel = require("../models/user.model");
const commonUtils = require("../utils/common");

const CartControllers = () => {
    const { generateCommonResponse } = commonUtils();

    const handleDeletion = async (userDetails, productIndex) => {
        userDetails.cart.cartTotal -=
            userDetails.cart.products[productIndex].quantity *
            userDetails.cart.products[productIndex].price;
        userDetails.cart.total -=
            userDetails.cart.products[productIndex].quantity *
            (userDetails.cart.products[productIndex].offerPrice ||
                userDetails.cart.products[productIndex].price);

        const wishListProductIndex = userDetails.wishlist.findIndex(
            (prod) =>
                prod.productId ===
                userDetails.cart.products[productIndex].productId
        );

        if (wishListProductIndex !== -1)
            userDetails.wishlist[wishListProductIndex].inCart = false;

        userDetails.cart.products.splice(productIndex, 1);

        return await UserModel.findOneAndUpdate(
            { userId: userDetails.userId },
            { $set: { cart: userDetails.cart, wishlist: userDetails.wishlist } }
        );
    };

    const addToCart = async (req, res) => {
        const { userId, prodId } = req.body;

        try {
            const foundProduct = await ProductModel.findOne({
                productId: prodId,
            });
            const foundUser = await UserModel.findOne({ userId });

            if (foundUser) {
                console.log("user found");

                if (foundProduct) {
                    console.log("product found");

                    if (foundProduct.units === 0) {
                        console.log("product is out of stock");

                        return res
                            .status(400)
                            .json(generateCommonResponse(4007));
                    }

                    const userDetails = foundUser;
                    console.log(userDetails, "userDetails");
                    if (
                        userDetails.cart.products.find(
                            (prod) => prod.productId === prodId
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
                        } = foundProduct;
                        const productDetails = {
                            productId,
                            title,
                            price,
                            offerPrice,
                            thumbnail,
                            isAvailable: true,
                            quantity: 1,
                            inWishlist: prodPosInWishlist !== -1,
                        };
                        userDetails.cart.cartTotal += foundProduct.price;
                        userDetails.cart.total +=
                            foundProduct.offerPrice || foundProduct.price;
                        userDetails.cart.products = [
                            productDetails,
                            ...userDetails.cart.products,
                        ];
                        await UserModel.findOneAndUpdate(
                            { userId },
                            {
                                $set: {
                                    cart: userDetails.cart,
                                    wishlist: userDetails.wishlist,
                                },
                            }
                        );
                        return res
                            .status(200)
                            .json(generateCommonResponse(2007, true));
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
        const { userId, prodId, operation } = req.body;

        try {
            const foundProduct = await ProductModel.findOne({
                productId: prodId,
            });
            const foundUser = await UserModel.findOne({ userId });

            if (foundUser) {
                console.log("user found");

                if (foundProduct) {
                    console.log("product found");

                    if (foundProduct.units === 0) {
                        console.log("product is out of stock");

                        return res
                            .status(400)
                            .json(generateCommonResponse(4007));
                    }

                    const userDetails = foundUser;
                    const productIndex = userDetails.cart.products.findIndex(
                        (prod) => prod.productId === prodId
                    );
                    if (productIndex === -1) {
                        console.log("product not found in cart");
                        return res
                            .status(400)
                            .json(generateCommonResponse(4006));
                    } else {
                        console.log("updating cart");

                        switch (operation) {
                            case GLOBAL_CONSTANTS.CART_OPERATION.INCREASE:
                                if (
                                    userDetails.cart.products[productIndex]
                                        .quantity === foundProduct.units
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
                                        foundProduct.price;
                                    userDetails.cart.total +=
                                        foundProduct.offerPrice ||
                                        foundProduct.price;

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
                            case GLOBAL_CONSTANTS.CART_OPERATION.DECREASE:
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
        const { userId, prodId } = req.query;

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
                        (prod) => prod.productId === prodId
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
                console.log("user not found while adding product to cart");
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
