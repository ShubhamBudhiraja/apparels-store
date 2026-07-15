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
exports.formatOrder = exports.getFormattedProducts = exports.findProducts = exports.findProductByProductId = exports.formatProduct = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const category_1 = require("./category");
const pricing_1 = require("./pricing");
const formatProduct = (product, extras) => {
    var _a, _b;
    const leaf = product.category;
    const segmentSlug = ((_a = leaf === null || leaf === void 0 ? void 0 : leaf.parent) === null || _a === void 0 ? void 0 : _a.slug) || (leaf === null || leaf === void 0 ? void 0 : leaf.slug) || "";
    const categorySlug = (leaf === null || leaf === void 0 ? void 0 : leaf.parent) ? leaf.slug : "";
    const pricing = (0, pricing_1.resolveProductPricing)({
        price: product.price,
        offerPrice: product.offerPrice,
        discountPercentage: product.discountPercentage,
        discountAmount: product.discountAmount,
        sales: (product.sales || []).map((entry) => entry.sale),
    });
    return Object.assign({ productId: product.productId, title: product.title, price: pricing.price, offerPrice: pricing.offerPrice, discountPercentage: pricing.discountPercentage, discountAmount: pricing.discountAmount, activeSale: pricing.activeSale, categoryId: product.categoryId, segment: segmentSlug, category: categorySlug || (leaf === null || leaf === void 0 ? void 0 : leaf.slug) || "", categoryName: leaf === null || leaf === void 0 ? void 0 : leaf.name, segmentName: ((_b = leaf === null || leaf === void 0 ? void 0 : leaf.parent) === null || _b === void 0 ? void 0 : _b.name) || (leaf === null || leaf === void 0 ? void 0 : leaf.name), description: product.description, shortDescription: product.shortDescription, images: product.images, thumbnail: product.thumbnail, variants: product.variants.map((variant) => ({
            id: variant.variantId,
            units: variant.units,
        })) }, (extras || {}));
};
exports.formatProduct = formatProduct;
const findProductByProductId = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.product.findUnique({
        where: { productId },
        include: category_1.productInclude,
    });
});
exports.findProductByProductId = findProductByProductId;
const findProducts = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {};
    if (filters.productId)
        where.productId = filters.productId;
    if (filters.categoryId)
        where.categoryId = filters.categoryId;
    return prisma_1.default.product.findMany({
        where,
        include: category_1.productInclude,
    });
});
exports.findProducts = findProducts;
const getFormattedProducts = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield (0, exports.findProducts)(filters || {});
    return products.map((product) => (0, exports.formatProduct)(product));
});
exports.getFormattedProducts = getFormattedProducts;
const formatOrder = (order) => ({
    _id: order.id,
    userId: order.userId,
    orderId: order.orderId,
    orderTimeStamp: order.orderTimeStamp,
    status: order.status,
    couponDiscount: order.couponDiscount,
    cartTotal: order.cartTotal,
    total: order.total,
    isDeliveryFeeIncluded: order.isDeliveryFeeIncluded,
    address: {
        firstName: order.addressFirstName,
        lastName: order.addressLastName,
        mobileNo: order.addressMobileNo,
        houseNo: order.addressHouseNo,
        streetAddress: order.addressStreetAddress,
        city: order.addressCity,
        pincode: order.addressPincode,
        state: order.addressState,
    },
    feedback: {
        rating: order.feedbackRating || 0,
        description: order.feedbackDescription || undefined,
    },
    products: order.items.map((item) => ({
        _id: item.id,
        productId: item.productId,
        title: item.title,
        price: item.price,
        offerPrice: item.offerPrice,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
        selectedVariant: item.selectedVariant,
    })),
});
exports.formatOrder = formatOrder;
//# sourceMappingURL=product.js.map