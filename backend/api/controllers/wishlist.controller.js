"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistControllers = void 0;
const common_1 = require("../lib/utils/common");
const product_model_1 = require("../models/product.model");
const user_model_1 = require("../models/user.model");
const WishlistControllers = () => {
    const addToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, prodId } = req.body;
        try {
            const foundProduct = yield product_model_1.ProductModel.findOne({
                productId: prodId,
            });
            const foundUser = yield user_model_1.UserModel.findOne({ userId });
            if (foundUser) {
                console.log("user found");
                if (foundProduct) {
                    console.log("product found");
                    const userDetails = foundUser;
                    if (userDetails.wishlist.find((prod) => prod.productId === prodId)) {
                        console.log("product already added in wishlist");
                        return res
                            .status(400)
                            .json((0, common_1.generateCommonResponse)(4014));
                    }
                    else {
                        console.log("adding product to wishlist");
                        const prodPosInCart = userDetails.cart.products.findIndex((prod) => prod.productId === prodId);
                        if (prodPosInCart !== -1)
                            userDetails.cart.products[prodPosInCart].inWishlist = true;
                        const productDetails = {
                            productId: foundProduct.get("productId"),
                            title: foundProduct.get("title"),
                            price: foundProduct.get("price"),
                            offerPrice: foundProduct.get("offerPrice"),
                            thumbnail: foundProduct.get("thumbnail"),
                            discountPercentage: foundProduct.get("discountPercentage"),
                        };
                        userDetails.set("wishlist", [
                            productDetails,
                            ...userDetails.wishlist,
                        ]);
                        yield user_model_1.UserModel.findOneAndUpdate({ userId }, {
                            $set: {
                                wishlist: userDetails.wishlist,
                                cart: userDetails.cart,
                            },
                        });
                        return res
                            .status(200)
                            .json((0, common_1.generateCommonResponse)(2013, true));
                    }
                }
                else {
                    console.log("product not found");
                    return res.status(400).json((0, common_1.generateCommonResponse)(4008));
                }
            }
            else {
                console.log("user not found while adding product to wishlist");
                return res.status(400).json((0, common_1.generateCommonResponse)(4004));
            }
        }
        catch (e) {
            console.log("error occured while adding product to wishlist", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const deleteFromWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, prodId } = req.query;
        try {
            const foundProduct = yield product_model_1.ProductModel.findOne({
                productId: prodId,
            });
            const foundUser = yield user_model_1.UserModel.findOne({ userId });
            if (foundUser) {
                console.log("user found");
                if (foundProduct) {
                    console.log("product found");
                    const userDetails = foundUser;
                    const productIndex = userDetails.wishlist.findIndex((prod) => prod.productId === prodId);
                    if (productIndex === -1) {
                        console.log("product not found in wishlist");
                        return res
                            .status(400)
                            .json((0, common_1.generateCommonResponse)(4015));
                    }
                    else {
                        console.log("updating wishlist");
                        const prodPosInCart = userDetails.cart.products.findIndex((prod) => prod.productId === prodId);
                        if (prodPosInCart !== -1)
                            userDetails.cart.products[prodPosInCart].inWishlist = false;
                        userDetails.wishlist.splice(productIndex, 1);
                        yield user_model_1.UserModel.findOneAndUpdate({ userId }, {
                            $set: {
                                cart: userDetails.cart,
                                wishlist: userDetails.wishlist,
                            },
                        });
                        return res
                            .status(200)
                            .json((0, common_1.generateCommonResponse)(2014, true));
                    }
                }
                else {
                    console.log("product not found");
                    return res.status(400).json((0, common_1.generateCommonResponse)(4008));
                }
            }
            else {
                console.log("user not found while adding product to cart");
                return res.status(400).json((0, common_1.generateCommonResponse)(4004));
            }
        }
        catch (e) {
            console.log("error occured while adding product to cart", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    return { addToWishlist, deleteFromWishlist };
};
exports.WishlistControllers = WishlistControllers;
//# sourceMappingURL=wishlist.controller.js.map