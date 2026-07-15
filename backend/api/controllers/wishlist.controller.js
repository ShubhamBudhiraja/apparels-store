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
exports.WishlistControllers = void 0;
const common_1 = require("../lib/utils/common");
const prisma_1 = __importDefault(require("../config/prisma"));
const user_1 = require("../lib/utils/user");
const product_1 = require("../lib/utils/product");
const WishlistControllers = () => {
    const addToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.body);
        const { prodId } = req.body;
        try {
            if (!emailId || !prodId) {
                return res.status(401).json((0, common_1.generateCommonResponse)(4000));
            }
            const foundProduct = yield (0, product_1.findProductByProductId)(prodId);
            const foundUser = yield (0, user_1.findUserByEmail)(emailId);
            if (!foundUser) {
                console.log("user not found while adding product to wishlist");
                return res.status(400).json((0, common_1.generateCommonResponse)(4004));
            }
            if (!foundProduct) {
                console.log("product not found");
                return res.status(400).json((0, common_1.generateCommonResponse)(4008));
            }
            const existing = foundUser.wishlist.find((item) => item.productId === prodId);
            if (existing) {
                console.log("product already added in wishlist");
                return res.status(400).json((0, common_1.generateCommonResponse)(4014));
            }
            console.log("adding product to wishlist");
            yield prisma_1.default.wishlistItem.create({
                data: {
                    userId: foundUser.id,
                    productId: prodId,
                },
            });
            return res.status(200).json((0, common_1.generateCommonResponse)(2013, true));
        }
        catch (e) {
            console.log("error occured while adding product to wishlist", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const deleteFromWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.query);
        const { prodId } = req.query;
        try {
            if (!emailId || !prodId) {
                return res.status(401).json((0, common_1.generateCommonResponse)(4000));
            }
            const foundProduct = yield (0, product_1.findProductByProductId)(prodId);
            const foundUser = yield (0, user_1.findUserByEmail)(emailId);
            if (!foundUser) {
                console.log("user not found while deleting product from wishlist");
                return res.status(400).json((0, common_1.generateCommonResponse)(4004));
            }
            if (!foundProduct) {
                console.log("product not found");
                return res.status(400).json((0, common_1.generateCommonResponse)(4008));
            }
            const wishlistItem = foundUser.wishlist.find((item) => item.productId === prodId);
            if (!wishlistItem) {
                console.log("product not found in wishlist");
                return res.status(400).json((0, common_1.generateCommonResponse)(4015));
            }
            console.log("updating wishlist");
            yield prisma_1.default.wishlistItem.delete({
                where: { id: wishlistItem.id },
            });
            return res.status(200).json((0, common_1.generateCommonResponse)(2014, true));
        }
        catch (e) {
            console.log("error occured while deleting from wishlist", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    return { addToWishlist, deleteFromWishlist };
};
exports.WishlistControllers = WishlistControllers;
//# sourceMappingURL=wishlist.controller.js.map