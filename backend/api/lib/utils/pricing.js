"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnitPrice = exports.resolveProductPricing = exports.pickBestSale = exports.computeSalePrice = exports.isSaleCurrentlyActive = void 0;
const client_1 = require("@prisma/client");
const isSaleCurrentlyActive = (sale, now = new Date()) => sale.isActive && sale.startsAt <= now && sale.endsAt >= now;
exports.isSaleCurrentlyActive = isSaleCurrentlyActive;
const computeSalePrice = (basePrice, sale) => {
    if (sale.discountType === client_1.DiscountType.PERCENT) {
        const discounted = basePrice - (basePrice * sale.discountValue) / 100;
        return Math.max(Math.round(discounted * 100) / 100, 0);
    }
    return Math.max(Math.round((basePrice - sale.discountValue) * 100) / 100, 0);
};
exports.computeSalePrice = computeSalePrice;
/** Picks highest priority active sale; ties break on deepest discount. */
const pickBestSale = (sales, basePrice, now = new Date()) => {
    const active = sales.filter((sale) => (0, exports.isSaleCurrentlyActive)(sale, now));
    if (!active.length)
        return null;
    return active.reduce((best, current) => {
        if (!best)
            return current;
        if (current.priority !== best.priority) {
            return current.priority > best.priority ? current : best;
        }
        const bestPrice = (0, exports.computeSalePrice)(basePrice, best);
        const currentPrice = (0, exports.computeSalePrice)(basePrice, current);
        return currentPrice < bestPrice ? current : best;
    }, null);
};
exports.pickBestSale = pickBestSale;
const resolveProductPricing = ({ price, offerPrice, discountPercentage, discountAmount, sales = [], }) => {
    const activeSale = (0, exports.pickBestSale)(sales, price);
    if (activeSale) {
        const salePrice = (0, exports.computeSalePrice)(price, activeSale);
        const amountOff = Math.max(price - salePrice, 0);
        const percentOff = price > 0 ? Math.round((amountOff / price) * 1000) / 10 : 0;
        return {
            price,
            offerPrice: salePrice,
            discountAmount: amountOff,
            discountPercentage: percentOff,
            activeSale: {
                id: activeSale.id,
                name: activeSale.name,
                slug: activeSale.slug,
                discountType: activeSale.discountType,
                discountValue: activeSale.discountValue,
            },
        };
    }
    return {
        price,
        offerPrice: offerPrice !== null && offerPrice !== void 0 ? offerPrice : null,
        discountAmount: discountAmount !== null && discountAmount !== void 0 ? discountAmount : null,
        discountPercentage: discountPercentage !== null && discountPercentage !== void 0 ? discountPercentage : null,
        activeSale: null,
    };
};
exports.resolveProductPricing = resolveProductPricing;
const getUnitPrice = (pricing) => { var _a; return (_a = pricing.offerPrice) !== null && _a !== void 0 ? _a : pricing.price; };
exports.getUnitPrice = getUnitPrice;
//# sourceMappingURL=pricing.js.map