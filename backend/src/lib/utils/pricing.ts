import { DiscountType } from "@prisma/client";

export type SaleLike = {
    id: string;
    name: string;
    slug: string;
    discountType: DiscountType;
    discountValue: number;
    startsAt: Date;
    endsAt: Date;
    isActive: boolean;
    priority: number;
};

export const isSaleCurrentlyActive = (
    sale: Pick<SaleLike, "isActive" | "startsAt" | "endsAt">,
    now = new Date(),
) => sale.isActive && sale.startsAt <= now && sale.endsAt >= now;

export const computeSalePrice = (
    basePrice: number,
    sale: Pick<SaleLike, "discountType" | "discountValue">,
) => {
    if (sale.discountType === DiscountType.PERCENT) {
        const discounted =
            basePrice - (basePrice * sale.discountValue) / 100;
        return Math.max(Math.round(discounted * 100) / 100, 0);
    }

    return Math.max(
        Math.round((basePrice - sale.discountValue) * 100) / 100,
        0,
    );
};

/** Picks highest priority active sale; ties break on deepest discount. */
export const pickBestSale = (
    sales: SaleLike[],
    basePrice: number,
    now = new Date(),
) => {
    const active = sales.filter((sale) => isSaleCurrentlyActive(sale, now));
    if (!active.length) return null;

    return active.reduce((best, current) => {
        if (!best) return current;
        if (current.priority !== best.priority) {
            return current.priority > best.priority ? current : best;
        }

        const bestPrice = computeSalePrice(basePrice, best);
        const currentPrice = computeSalePrice(basePrice, current);
        return currentPrice < bestPrice ? current : best;
    }, null as SaleLike | null);
};

export const resolveProductPricing = ({
    price,
    offerPrice,
    discountPercentage,
    discountAmount,
    sales = [],
}: {
    price: number;
    offerPrice?: number | null;
    discountPercentage?: number | null;
    discountAmount?: number | null;
    sales?: SaleLike[];
}) => {
    const activeSale = pickBestSale(sales, price);

    if (activeSale) {
        const salePrice = computeSalePrice(price, activeSale);
        const amountOff = Math.max(price - salePrice, 0);
        const percentOff =
            price > 0 ? Math.round((amountOff / price) * 1000) / 10 : 0;

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
        offerPrice: offerPrice ?? null,
        discountAmount: discountAmount ?? null,
        discountPercentage: discountPercentage ?? null,
        activeSale: null,
    };
};

export const getUnitPrice = (pricing: {
    price: number;
    offerPrice?: number | null;
}) => pricing.offerPrice ?? pricing.price;
