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
exports.getFormattedProducts = exports.generateOrderDetails = exports.checkProductsAvailability = exports.updateProductInventory = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const product_1 = require("./product");
Object.defineProperty(exports, "getFormattedProducts", { enumerable: true, get: function () { return product_1.getFormattedProducts; } });
const updateProductInventory = (allProducts, cartProducts) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = [];
    allProducts.forEach((product) => {
        cartProducts.forEach((cartProduct) => {
            if (product.productId !== cartProduct.productId)
                return;
            const variant = product.variants.find((entry) => entry.id === cartProduct.selectedVariant);
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
    yield Promise.allSettled(updates.map((update) => prisma_1.default.productVariant.update({
        where: {
            productId_variantId: {
                productId: update.productId,
                variantId: update.variantId,
            },
        },
        data: { units: Math.max(update.units, 0) },
    })));
    console.log("product inventory updated");
});
exports.updateProductInventory = updateProductInventory;
const checkProductsAvailability = (allProducts, cartProducts) => {
    for (const cartProduct of cartProducts) {
        const product = allProducts.find((entry) => entry.productId === cartProduct.productId);
        const variant = product === null || product === void 0 ? void 0 : product.variants.find((entry) => entry.id === cartProduct.selectedVariant);
        if (!variant || variant.units < cartProduct.quantity) {
            return false;
        }
    }
    return true;
};
exports.checkProductsAvailability = checkProductsAvailability;
const generateOrderDetails = ({ orderId, addressId, userDetails, }) => {
    var _a, _b;
    const address = (_a = userDetails.addresses) === null || _a === void 0 ? void 0 : _a.find((entry) => entry._id === addressId);
    return {
        orderId,
        orderTimeStamp: new Date(),
        cartTotal: userDetails.cart.cartTotal,
        total: userDetails.cart.total,
        isDeliveryFeeIncluded: userDetails.cart.isDeliveryFeeIncluded,
        couponDiscount: userDetails.cart.couponDiscount || 0,
        products: ((_b = userDetails.cart.products) === null || _b === void 0 ? void 0 : _b.map((product) => ({
            productId: product.productId,
            title: product.title || "",
            price: product.price,
            offerPrice: product.offerPrice,
            quantity: product.quantity,
            thumbnail: product.thumbnail,
            selectedVariant: product.selectedVariant,
        }))) || [],
        address,
    };
};
exports.generateOrderDetails = generateOrderDetails;
//# sourceMappingURL=payment.js.map