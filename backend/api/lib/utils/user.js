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
exports.buildProfileResponse = exports.formatAddress = exports.buildWishlistResponse = exports.buildCartResponse = exports.ensureUserCart = exports.findUserByEmail = exports.resolveEmailId = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const common_1 = require("../../constants/common");
const product_1 = require("./product");
/** Frontend still sends email as `userId` across APIs. */
const resolveEmailId = (payload) => payload.emailId || payload.userId;
exports.resolveEmailId = resolveEmailId;
const findUserByEmail = (emailId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.user.findUnique({
        where: { emailId },
        include: {
            addresses: { orderBy: { createdAt: "asc" } },
            cart: { include: { items: true } },
            wishlist: true,
        },
    });
});
exports.findUserByEmail = findUserByEmail;
const ensureUserCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
        include: { items: true },
    });
});
exports.ensureUserCart = ensureUserCart;
const computeBilling = (cartTotal) => {
    if (cartTotal <= 0) {
        return {
            cartTotal: 0,
            total: 0,
            isDeliveryFeeIncluded: false,
            couponDiscount: 0,
        };
    }
    const isDeliveryFeeIncluded = cartTotal < common_1.BILLING_DETAILS.NO_DELIVERY_FEE_VALUE;
    return {
        cartTotal,
        total: isDeliveryFeeIncluded
            ? cartTotal + common_1.BILLING_DETAILS.DELIVERY_FEE
            : cartTotal,
        isDeliveryFeeIncluded,
        couponDiscount: 0,
    };
};
const buildCartResponse = (cartItems_1, ...args_1) => __awaiter(void 0, [cartItems_1, ...args_1], void 0, function* (cartItems, wishlistProductIds = new Set()) {
    if (!cartItems.length) {
        return Object.assign({ products: [] }, computeBilling(0));
    }
    const productIds = [...new Set(cartItems.map((item) => item.productId))];
    const products = yield (0, product_1.findProducts)({ productId: { in: productIds } });
    const productMap = new Map(products.map((product) => [
        product.productId,
        (0, product_1.formatProduct)(product),
    ]));
    let cartTotal = 0;
    const hydratedProducts = cartItems
        .map((item) => {
        const product = productMap.get(item.productId);
        if (!product)
            return null;
        const variant = product.variants.find((entry) => entry.id === item.selectedVariant);
        const unitPrice = product.offerPrice || product.price;
        cartTotal += unitPrice * item.quantity;
        return {
            productId: product.productId,
            title: product.title,
            price: product.price,
            offerPrice: product.offerPrice,
            thumbnail: product.thumbnail,
            isAvailable: ((variant === null || variant === void 0 ? void 0 : variant.units) || 0) > 0,
            quantity: item.quantity,
            segment: product.segment,
            category: product.category,
            inWishlist: wishlistProductIds.has(item.productId),
            discountAmount: product.discountAmount,
            discountPercentage: product.discountPercentage,
            activeSale: product.activeSale,
            selectedVariant: item.selectedVariant,
        };
    })
        .filter(Boolean);
    return Object.assign({ products: hydratedProducts }, computeBilling(cartTotal));
});
exports.buildCartResponse = buildCartResponse;
const buildWishlistResponse = (wishlistItems) => __awaiter(void 0, void 0, void 0, function* () {
    if (!wishlistItems.length)
        return [];
    const productIds = wishlistItems.map((item) => item.productId);
    const products = yield (0, product_1.findProducts)({ productId: { in: productIds } });
    const productMap = new Map(products.map((product) => [
        product.productId,
        (0, product_1.formatProduct)(product),
    ]));
    return wishlistItems
        .map((item) => {
        const product = productMap.get(item.productId);
        if (!product)
            return null;
        return {
            productId: product.productId,
            title: product.title,
            price: product.price,
            offerPrice: product.offerPrice,
            thumbnail: product.thumbnail,
            discountPercentage: product.discountPercentage,
        };
    })
        .filter(Boolean);
});
exports.buildWishlistResponse = buildWishlistResponse;
const formatAddress = (address) => ({
    _id: address.id,
    firstName: address.firstName,
    lastName: address.lastName,
    mobileNo: address.mobileNo,
    houseNo: address.houseNo,
    streetAddress: address.streetAddress,
    city: address.city,
    pincode: address.pincode,
    state: address.state,
    isDefault: address.isDefault,
});
exports.formatAddress = formatAddress;
const buildProfileResponse = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const wishlistProductIds = new Set(user.wishlist.map((item) => item.productId));
    const cart = yield (0, exports.buildCartResponse)(((_a = user.cart) === null || _a === void 0 ? void 0 : _a.items) || [], wishlistProductIds);
    const wishlist = yield (0, exports.buildWishlistResponse)(user.wishlist);
    return {
        userId: user.emailId,
        emailId: user.emailId,
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNo: user.mobileNo,
        dob: user.dateOfBirth,
        isVerified: user.isVerified,
        addresses: user.addresses.map(exports.formatAddress),
        cart,
        wishlist,
    };
});
exports.buildProfileResponse = buildProfileResponse;
//# sourceMappingURL=user.js.map