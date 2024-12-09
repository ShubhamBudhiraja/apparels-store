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
exports.generateOrderDetails = exports.checkProductsAvailability = exports.updateProductInventory = exports.updateProduct = void 0;
const product_model_1 = require("../../models/product.model");
const updateProduct = (productId, variants) => {
    return product_model_1.ProductModel.findOneAndUpdate({ productId }, { $set: { variants } });
};
exports.updateProduct = updateProduct;
const updateProductInventory = (allProducts, cartProducts) => __awaiter(void 0, void 0, void 0, function* () {
    const record = {};
    allProducts.forEach((product) => {
        const prod = product;
        cartProducts.forEach((cartProduct) => {
            const variantIndex = prod.variants.findIndex((variant) => variant.id === cartProduct.selectedVariant);
            if (variantIndex !== -1) {
                prod.variants[variantIndex].units -= cartProduct.quantity;
                record[cartProduct.productId] = prod.variants;
            }
        });
    });
    console.log("updating product inventory");
    const productPromise = Object.entries(record).map(([key, value]) => (0, exports.updateProduct)(key, value));
    yield Promise.allSettled(productPromise);
    console.log("product inventory updated");
});
exports.updateProductInventory = updateProductInventory;
const checkProductsAvailability = (allProducts, cartProducts) => {
    let allProductsAvailable = true;
    for (let productIndex = 0; productIndex < allProducts.length; productIndex++) {
        for (let cartProductIndex = 0; cartProductIndex < cartProducts.length; cartProductIndex++) {
            const addedVariant = allProducts[productIndex].variants.find((variant) => variant.id ===
                cartProducts[cartProductIndex].selectedVariant);
            if (addedVariant &&
                addedVariant.units < cartProducts[cartProductIndex].quantity) {
                allProductsAvailable = false;
                break;
            }
        }
        if (!allProductsAvailable)
            break;
    }
    return allProductsAvailable;
};
exports.checkProductsAvailability = checkProductsAvailability;
const generateOrderDetails = ({ orderId, addressId, userDetails, }) => {
    var _a, _b;
    return ({
        orderId,
        orderTimeStamp: new Date(),
        cartTotal: userDetails.cart.cartTotal,
        total: userDetails.cart.total,
        isDeliveryFeeIncluded: userDetails.cart.isDeliveryFeeIncluded,
        couponDiscount: userDetails.cart.couponDiscount,
        products: (_a = userDetails.cart.products) === null || _a === void 0 ? void 0 : _a.map((product) => ({
            productId: product.productId,
            title: product.title,
            price: product.price,
            offerPrice: product.offerPrice,
            quantity: product.quantity,
            thumbnail: product.thumbnail,
            selectedVariant: product.selectedVariant,
        })),
        address: (_b = userDetails.addresses) === null || _b === void 0 ? void 0 : _b.find((address) => address._id.toString() === addressId),
    });
};
exports.generateOrderDetails = generateOrderDetails;
//# sourceMappingURL=payment.js.map