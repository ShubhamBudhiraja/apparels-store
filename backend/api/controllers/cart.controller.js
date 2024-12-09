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
exports.CartControllers = void 0;
const user_model_1 = require("../models/user.model");
const common_1 = require("../constants/common");
const common_2 = require("../lib/utils/common");
const product_model_1 = require("../models/product.model");
const CartControllers = () => {
    const handleDeletion = (userDetails, productIndex) => __awaiter(void 0, void 0, void 0, function* () {
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
                if (cartData.cartTotal > common_1.BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                    cartData.total -= common_1.BILLING_DETAILS.DELIVERY_FEE;
                    cartData.isDeliveryFeeIncluded = false;
                }
            }
            else {
                if (cartData.cartTotal < common_1.BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                    cartData.total += common_1.BILLING_DETAILS.DELIVERY_FEE;
                    cartData.isDeliveryFeeIncluded = true;
                }
            }
        }
        else {
            cartData.total = 0;
            cartData.isDeliveryFeeIncluded = false;
        }
        cartData.products.splice(productIndex, 1);
        return yield user_model_1.UserModel.findOneAndUpdate({ userId: userDetails.userId }, { $set: { cart: cartData, wishlist: userDetails.wishlist } });
    });
    const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { userId, prodId, variant } = req.body;
        try {
            const foundProduct = yield product_model_1.ProductModel.findOne({
                productId: prodId,
            });
            const foundUser = yield user_model_1.UserModel.findOne({ userId });
            if (foundUser) {
                console.log("user found");
                if (foundProduct) {
                    console.log(foundProduct, "product found");
                    const foundVariant = foundProduct.variants.find((item) => item.id === variant);
                    if (foundVariant) {
                        if (foundVariant.units === 0) {
                            console.log("product is out of stock");
                            return res
                                .status(400)
                                .json((0, common_2.generateCommonResponse)(4007));
                        }
                        const wishlistData = foundUser.get("wishlist");
                        const cartData = foundUser.get("cart");
                        if ((_a = cartData.products) === null || _a === void 0 ? void 0 : _a.find((prod) => prod.productId === prodId &&
                            prod.selectedVariant === variant)) {
                            console.log("product already added in cart");
                            return res
                                .status(400)
                                .json((0, common_2.generateCommonResponse)(4005));
                        }
                        else {
                            console.log("adding product to cart");
                            const prodPosInWishlist = wishlistData.findIndex((prod) => prod.productId === prodId);
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
                                discountAmount: foundProduct.get("discountAmount"),
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
                                if (cartData.cartTotal >
                                    common_1.BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                                    cartData.total -=
                                        common_1.BILLING_DETAILS.DELIVERY_FEE;
                                    cartData.isDeliveryFeeIncluded = false;
                                }
                            }
                            else {
                                if (cartData.cartTotal <
                                    common_1.BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                                    cartData.total +=
                                        common_1.BILLING_DETAILS.DELIVERY_FEE;
                                    cartData.isDeliveryFeeIncluded = true;
                                }
                            }
                            foundUser.set("cart", Object.assign(Object.assign({}, cartData), { products: [
                                    productDetails,
                                    ...cartData.products,
                                ] }));
                            yield user_model_1.UserModel.findOneAndUpdate({ userId }, {
                                $set: { cart: foundUser.cart },
                            });
                            return res
                                .status(200)
                                .json((0, common_2.generateCommonResponse)(2007, true));
                        }
                    }
                    else {
                        console.log("variant not found");
                        return res
                            .status(400)
                            .json((0, common_2.generateCommonResponse)(4016));
                    }
                }
                else {
                    console.log("product not found");
                    return res.status(400).json((0, common_2.generateCommonResponse)(4008));
                }
            }
            else {
                console.log("user not found while adding product to cart");
                return res.status(400).json((0, common_2.generateCommonResponse)(4004));
            }
        }
        catch (e) {
            console.log("error occured while adding product to cart", e);
            return res.status(500).json((0, common_2.generateCommonResponse)(5000));
        }
    });
    const updateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { userId, prodId, variant, operation } = req.body;
        try {
            const foundProduct = yield product_model_1.ProductModel.findOne({
                productId: prodId,
            });
            const foundUser = yield user_model_1.UserModel.findOne({ userId });
            if (foundUser) {
                console.log("user found");
                if (foundProduct) {
                    console.log("product found");
                    const variantData = (_a = foundProduct === null || foundProduct === void 0 ? void 0 : foundProduct.variants) === null || _a === void 0 ? void 0 : _a.find((item) => (item === null || item === void 0 ? void 0 : item.id) === variant);
                    if ((variantData === null || variantData === void 0 ? void 0 : variantData.units) === 0) {
                        console.log("product is out of stock");
                        return res
                            .status(400)
                            .json((0, common_2.generateCommonResponse)(4007));
                    }
                    const userDetails = foundUser;
                    const productIndex = userDetails.cart.products.findIndex((prod) => prod.productId === prodId &&
                        prod.selectedVariant === variant);
                    if (productIndex === -1) {
                        console.log("product not found in cart");
                        return res
                            .status(400)
                            .json((0, common_2.generateCommonResponse)(4006));
                    }
                    else {
                        console.log("updating cart");
                        switch (operation) {
                            case common_1.CART_OPERATION.INCREASE:
                                if (userDetails.cart.products[productIndex]
                                    .quantity === (variantData === null || variantData === void 0 ? void 0 : variantData.units)) {
                                    console.log("maximum inventory reached");
                                    return res
                                        .status(400)
                                        .json((0, common_2.generateCommonResponse)(4009));
                                }
                                else {
                                    userDetails.cart.products[productIndex].quantity += 1;
                                    userDetails.cart.cartTotal +=
                                        foundProduct.offerPrice ||
                                            foundProduct.price;
                                    userDetails.cart.total +=
                                        foundProduct.offerPrice ||
                                            foundProduct.price;
                                    if (userDetails.cart.isDeliveryFeeIncluded) {
                                        if (userDetails.cart.cartTotal >
                                            common_1.BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                                            userDetails.cart.total -=
                                                common_1.BILLING_DETAILS.DELIVERY_FEE;
                                            userDetails.cart.isDeliveryFeeIncluded =
                                                false;
                                        }
                                    }
                                    else {
                                        if (userDetails.cart.cartTotal <
                                            common_1.BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                                            userDetails.cart.total +=
                                                common_1.BILLING_DETAILS.DELIVERY_FEE;
                                            userDetails.cart.isDeliveryFeeIncluded =
                                                true;
                                        }
                                    }
                                    yield user_model_1.UserModel.findOneAndUpdate({ userId }, { $set: { cart: userDetails.cart } });
                                    return res
                                        .status(200)
                                        .json((0, common_2.generateCommonResponse)(2008, true));
                                }
                            case common_1.CART_OPERATION.DECREASE:
                                if (userDetails.cart.products[productIndex]
                                    .quantity === 1) {
                                    yield handleDeletion(userDetails, productIndex);
                                    return res
                                        .status(200)
                                        .json((0, common_2.generateCommonResponse)(2009, true));
                                }
                                else {
                                    userDetails.cart.products[productIndex].quantity -= 1;
                                    userDetails.cart.cartTotal -=
                                        foundProduct.offerPrice ||
                                            foundProduct.price;
                                    userDetails.cart.total -=
                                        foundProduct.offerPrice ||
                                            foundProduct.price;
                                    if (userDetails.cart.isDeliveryFeeIncluded) {
                                        if (userDetails.cart.cartTotal >
                                            common_1.BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                                            userDetails.cart.total -=
                                                common_1.BILLING_DETAILS.DELIVERY_FEE;
                                            userDetails.cart.isDeliveryFeeIncluded =
                                                false;
                                        }
                                    }
                                    else {
                                        if (userDetails.cart.cartTotal <
                                            common_1.BILLING_DETAILS.NO_DELIVERY_FEE_VALUE) {
                                            userDetails.cart.total +=
                                                common_1.BILLING_DETAILS.DELIVERY_FEE;
                                            userDetails.cart.isDeliveryFeeIncluded =
                                                true;
                                        }
                                    }
                                    yield user_model_1.UserModel.findOneAndUpdate({ userId }, { $set: { cart: userDetails.cart } });
                                    return res
                                        .status(200)
                                        .json((0, common_2.generateCommonResponse)(2008, true));
                                }
                            default:
                                console.log("invalid operation");
                                return res
                                    .status(400)
                                    .json((0, common_2.generateCommonResponse)(4010));
                        }
                    }
                }
                else {
                    console.log("product not found");
                    return res.status(400).json((0, common_2.generateCommonResponse)(4008));
                }
            }
            else {
                console.log("user not found while adding product to cart");
                return res.status(400).json((0, common_2.generateCommonResponse)(4004));
            }
        }
        catch (e) {
            console.log("error occured while adding product to cart", e);
            return res.status(500).json((0, common_2.generateCommonResponse)(5000));
        }
    });
    const deleteFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, prodId, variant } = req.query;
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
                    const productIndex = userDetails.cart.products.findIndex((prod) => prod.productId === prodId &&
                        prod.selectedVariant === variant);
                    if (productIndex !== -1) {
                        console.log("updating cart");
                        yield handleDeletion(userDetails, productIndex);
                        console.log("deleted");
                        return res
                            .status(200)
                            .json((0, common_2.generateCommonResponse)(2009, true));
                    }
                    else {
                        console.log("product not found in cart");
                        return res
                            .status(400)
                            .json((0, common_2.generateCommonResponse)(4006));
                    }
                }
                else {
                    console.log("product not found");
                    return res.status(400).json((0, common_2.generateCommonResponse)(4008));
                }
            }
            else {
                console.log("user not found while deleting product from cart");
                return res.status(400).json((0, common_2.generateCommonResponse)(4004));
            }
        }
        catch (e) {
            console.log("error occured while deleting product from cart", e);
            return res.status(500).json((0, common_2.generateCommonResponse)(5000));
        }
    });
    return { addToCart, updateCart, deleteFromCart };
};
exports.CartControllers = CartControllers;
