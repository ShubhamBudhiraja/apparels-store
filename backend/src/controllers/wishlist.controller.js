const GLOBAL_CONSTANTS = require("../constants/common");
const ProductModel = require("../models/product.model");
const UserModel = require("../models/user.model");
const commonUtils = require("../utils/common");

const WishlistControllers = () => {
    const { generateCommonResponse } = commonUtils();

    const addToWishlist = async (req, res) => {
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

                    const userDetails = foundUser;
                    if (
                        userDetails.wishlist.find(
                            (prod) => prod.productId === prodId
                        )
                    ) {
                        console.log("product already added in wishlist");

                        return res
                            .status(400)
                            .json(generateCommonResponse(4014));
                    } else {
                        console.log("adding product to wishlist");

                        const prodPosInCart =
                            userDetails.cart.products.findIndex(
                                (prod) => prod.productId === prodId
                            );
                        if (prodPosInCart !== -1)
                            userDetails.cart.products[
                                prodPosInCart
                            ].inWishlist = true;
                        const {
                            productId,
                            title,
                            price,
                            offerPrice,
                            thumbnail,
                            units,
                        } = foundProduct;
                        const productDetails = {
                            productId,
                            title,
                            price,
                            offerPrice,
                            thumbnail,
                            isAvailable: units > 0,
                            inCart: prodPosInCart !== -1,
                        };
                        userDetails.wishlist = [
                            productDetails,
                            ...userDetails.wishlist,
                        ];
                        await UserModel.findOneAndUpdate(
                            { userId },
                            {
                                $set: {
                                    wishlist: userDetails.wishlist,
                                    cart: userDetails.cart,
                                },
                            }
                        );
                        return res
                            .status(200)
                            .json(generateCommonResponse(2013, true));
                    }
                } else {
                    console.log("product not found");
                    return res.status(400).json(generateCommonResponse(4008));
                }
            } else {
                console.log("user not found while adding product to wishlist");
                return res.status(400).json(generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while adding product to wishlist", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const deleteFromWishlist = async (req, res) => {
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
                    const productIndex = userDetails.wishlist.findIndex(
                        (prod) => prod.productId === prodId
                    );
                    if (productIndex === -1) {
                        console.log("product not found in wishlist");
                        return res
                            .status(400)
                            .json(generateCommonResponse(4015));
                    } else {
                        console.log("updating wishlist");
                        const prodPosInCart =
                            userDetails.cart.products.findIndex(
                                (prod) => prod.productId === prodId
                            );
                        if (prodPosInCart !== -1)
                            userDetails.cart.products[
                                prodPosInCart
                            ].inWishlist = false;

                        userDetails.wishlist.splice(productIndex, 1);

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
                            .json(generateCommonResponse(2014, true));
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

    return { addToWishlist, deleteFromWishlist };
};

module.exports = WishlistControllers;
