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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartControllers = void 0;
const common_1 = require("../constants/common");
const common_2 = require("../lib/utils/common");
const prisma_1 = __importDefault(require("../config/prisma"));
const user_1 = require("../lib/utils/user");
const product_1 = require("../lib/utils/product");
const CartControllers = () => {
    const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.body);
        const { prodId, variant } = req.body;
        try {
            if (!emailId || !prodId || !variant) {
                return res.status(401).json((0, common_2.generateCommonResponse)(4000));
            }
            const foundProductRecord = yield (0, product_1.findProductByProductId)(prodId);
            const foundUser = yield (0, user_1.findUserByEmail)(emailId);
            if (!foundUser) {
                console.log("user not found while adding product to cart");
                return res.status(200).json((0, common_2.generateCommonResponse)(4004));
            }
            if (!foundProductRecord) {
                console.log("product not found");
                return res.status(200).json((0, common_2.generateCommonResponse)(4008));
            }
            const foundProduct = (0, product_1.formatProduct)(foundProductRecord);
            console.log(foundProduct, "product found");
            const foundVariant = foundProduct.variants.find((item) => item.id === variant);
            if (!foundVariant) {
                console.log("variant not found");
                return res.status(200).json((0, common_2.generateCommonResponse)(4016));
            }
            if (foundVariant.units === 0) {
                console.log("product is out of stock");
                return res.status(200).json((0, common_2.generateCommonResponse)(4007));
            }
            const cart = yield (0, user_1.ensureUserCart)(foundUser.id);
            const existingItem = cart.items.find((item) => item.productId === prodId &&
                item.selectedVariant === variant);
            if (existingItem) {
                console.log("product already added in cart");
                return res.status(200).json((0, common_2.generateCommonResponse)(4005));
            }
            console.log("adding product to cart");
            yield prisma_1.default.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: prodId,
                    selectedVariant: variant,
                    quantity: 1,
                },
            });
            return res.status(200).json((0, common_2.generateCommonResponse)(2007, true));
        }
        catch (e) {
            console.log("error occured while adding product to cart", e);
            return res.status(500).json((0, common_2.generateCommonResponse)(5000));
        }
    });
    const updateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.body);
        const { prodId, variant, operation } = req.body;
        try {
            if (!emailId || !prodId || !variant || !operation) {
                return res.status(401).json((0, common_2.generateCommonResponse)(4000));
            }
            const foundProductRecord = yield (0, product_1.findProductByProductId)(prodId);
            const foundUser = yield (0, user_1.findUserByEmail)(emailId);
            if (!foundUser) {
                console.log("user not found while updating cart");
                return res.status(200).json((0, common_2.generateCommonResponse)(4004));
            }
            if (!foundProductRecord) {
                console.log("product not found");
                return res.status(200).json((0, common_2.generateCommonResponse)(4008));
            }
            const foundProduct = (0, product_1.formatProduct)(foundProductRecord);
            const variantData = foundProduct.variants.find((item) => item.id === variant);
            if ((variantData === null || variantData === void 0 ? void 0 : variantData.units) === 0) {
                console.log("product is out of stock");
                return res.status(200).json((0, common_2.generateCommonResponse)(4007));
            }
            const cart = yield (0, user_1.ensureUserCart)(foundUser.id);
            const cartItem = cart.items.find((item) => item.productId === prodId &&
                item.selectedVariant === variant);
            if (!cartItem) {
                console.log("product not found in cart");
                return res.status(200).json((0, common_2.generateCommonResponse)(4006));
            }
            console.log("updating cart");
            switch (operation) {
                case common_1.CART_OPERATION.INCREASE:
                    if (cartItem.quantity === (variantData === null || variantData === void 0 ? void 0 : variantData.units)) {
                        console.log("maximum inventory reached");
                        return res
                            .status(200)
                            .json((0, common_2.generateCommonResponse)(4009));
                    }
                    yield prisma_1.default.cartItem.update({
                        where: { id: cartItem.id },
                        data: { quantity: cartItem.quantity + 1 },
                    });
                    return res
                        .status(200)
                        .json((0, common_2.generateCommonResponse)(2008, true));
                case common_1.CART_OPERATION.DECREASE:
                    if (cartItem.quantity === 1) {
                        yield prisma_1.default.cartItem.delete({
                            where: { id: cartItem.id },
                        });
                        return res
                            .status(200)
                            .json((0, common_2.generateCommonResponse)(2009, true));
                    }
                    yield prisma_1.default.cartItem.update({
                        where: { id: cartItem.id },
                        data: { quantity: cartItem.quantity - 1 },
                    });
                    return res
                        .status(200)
                        .json((0, common_2.generateCommonResponse)(2008, true));
                default:
                    console.log("invalid operation");
                    return res.status(200).json((0, common_2.generateCommonResponse)(4010));
            }
        }
        catch (e) {
            console.log("error occured while updating cart", e);
            return res.status(500).json((0, common_2.generateCommonResponse)(5000));
        }
    });
    const deleteFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.query);
        const { prodId, variant } = req.query;
        try {
            if (!emailId || !prodId || !variant) {
                return res.status(401).json((0, common_2.generateCommonResponse)(4000));
            }
            const foundProductRecord = yield (0, product_1.findProductByProductId)(prodId);
            const foundUser = yield (0, user_1.findUserByEmail)(emailId);
            if (!foundUser) {
                console.log("user not found while deleting product from cart");
                return res.status(200).json((0, common_2.generateCommonResponse)(4004));
            }
            if (!foundProductRecord) {
                console.log("product not found");
                return res.status(200).json((0, common_2.generateCommonResponse)(4008));
            }
            const cart = yield (0, user_1.ensureUserCart)(foundUser.id);
            const cartItem = cart.items.find((item) => item.productId === prodId &&
                item.selectedVariant === variant);
            if (!cartItem) {
                console.log("product not found in cart");
                return res.status(200).json((0, common_2.generateCommonResponse)(4006));
            }
            console.log("updating cart");
            yield prisma_1.default.cartItem.delete({ where: { id: cartItem.id } });
            console.log("deleted");
            return res.status(200).json((0, common_2.generateCommonResponse)(2009, true));
        }
        catch (e) {
            console.log("error occured while deleting product from cart", e);
            return res.status(500).json((0, common_2.generateCommonResponse)(5000));
        }
    });
    return { addToCart, updateCart, deleteFromCart };
};
exports.CartControllers = CartControllers;
//# sourceMappingURL=cart.controller.js.map