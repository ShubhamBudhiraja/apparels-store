import { DiscountType } from "@prisma/client";
import { generateCommonResponse } from "../lib/utils/common";
import prisma from "../config/prisma";
import { isSaleCurrentlyActive } from "../lib/utils/pricing";

const saleInclude = {
    products: {
        include: {
            product: {
                select: {
                    productId: true,
                    title: true,
                    thumbnail: true,
                    price: true,
                },
            },
        },
    },
} as const;

const formatSale = (sale: any) => ({
    id: sale.id,
    name: sale.name,
    slug: sale.slug,
    discountType: sale.discountType,
    discountValue: sale.discountValue,
    startsAt: sale.startsAt,
    endsAt: sale.endsAt,
    isActive: sale.isActive,
    priority: sale.priority,
    isCurrentlyActive: isSaleCurrentlyActive(sale),
    products: (sale.products || []).map((entry: any) => ({
        productId: entry.product.productId,
        title: entry.product.title,
        thumbnail: entry.product.thumbnail,
        price: entry.product.price,
    })),
});

export const SaleControllers = () => {
    const listSales = async (req: any, res: any) => {
        const { activeOnly } = req.query;

        try {
            const now = new Date();
            const sales = await prisma.sale.findMany({
                where:
                    activeOnly === "true"
                        ? {
                              isActive: true,
                              startsAt: { lte: now },
                              endsAt: { gte: now },
                          }
                        : undefined,
                include: saleInclude,
                orderBy: [{ priority: "desc" }, { startsAt: "desc" }],
            });

            return res.status(200).json(
                generateCommonResponse(2040, true, {
                    sales: sales.map(formatSale),
                }),
            );
        } catch (e) {
            console.log("error occured while listing sales", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const getSale = async (req: any, res: any) => {
        const { saleId, slug } = req.query;

        try {
            const sale = await prisma.sale.findFirst({
                where: {
                    ...(saleId ? { id: saleId } : {}),
                    ...(slug ? { slug } : {}),
                },
                include: saleInclude,
            });

            if (!sale) {
                return res.status(404).json(generateCommonResponse(4040));
            }

            return res
                .status(200)
                .json(generateCommonResponse(2040, true, formatSale(sale)));
        } catch (e) {
            console.log("error occured while getting sale", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const createSale = async (req: any, res: any) => {
        const {
            name,
            slug,
            discountType,
            discountValue,
            startsAt,
            endsAt,
            isActive,
            priority,
            productIds = [],
        } = req.body;

        try {
            if (
                !name ||
                !slug ||
                !discountType ||
                discountValue === undefined ||
                !startsAt ||
                !endsAt
            ) {
                return res.status(400).json(generateCommonResponse(4000));
            }

            if (
                !Object.values(DiscountType).includes(discountType) ||
                Number(discountValue) <= 0
            ) {
                return res.status(400).json(generateCommonResponse(4000));
            }

            if (discountType === DiscountType.PERCENT && discountValue > 100) {
                return res.status(400).json(generateCommonResponse(4000));
            }

            const uniqueProductIds: string[] = [
                ...new Set(productIds as string[]),
            ];

            if (uniqueProductIds.length) {
                const products = await prisma.product.findMany({
                    where: { productId: { in: uniqueProductIds } },
                    select: { productId: true },
                });
                if (products.length !== uniqueProductIds.length) {
                    return res.status(400).json(generateCommonResponse(4008));
                }
            }

            const sale = await prisma.sale.create({
                data: {
                    name,
                    slug: String(slug).toLowerCase(),
                    discountType,
                    discountValue: Number(discountValue),
                    startsAt: new Date(startsAt),
                    endsAt: new Date(endsAt),
                    isActive: isActive ?? true,
                    priority: priority ?? 0,
                    products: {
                        create: uniqueProductIds.map((productId) => ({
                            productId,
                        })),
                    },
                },
                include: saleInclude,
            });

            return res
                .status(200)
                .json(generateCommonResponse(2041, true, formatSale(sale)));
        } catch (e) {
            console.log("error occured while creating sale", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const updateSale = async (req: any, res: any) => {
        const {
            saleId,
            name,
            slug,
            discountType,
            discountValue,
            startsAt,
            endsAt,
            isActive,
            priority,
        } = req.body;

        try {
            if (!saleId) {
                return res.status(400).json(generateCommonResponse(4000));
            }

            const existing = await prisma.sale.findUnique({
                where: { id: saleId },
            });
            if (!existing) {
                return res.status(404).json(generateCommonResponse(4040));
            }

            if (
                discountType &&
                !Object.values(DiscountType).includes(discountType)
            ) {
                return res.status(400).json(generateCommonResponse(4000));
            }

            const sale = await prisma.sale.update({
                where: { id: saleId },
                data: {
                    ...(name !== undefined && { name }),
                    ...(slug !== undefined && {
                        slug: String(slug).toLowerCase(),
                    }),
                    ...(discountType !== undefined && { discountType }),
                    ...(discountValue !== undefined && {
                        discountValue: Number(discountValue),
                    }),
                    ...(startsAt !== undefined && {
                        startsAt: new Date(startsAt),
                    }),
                    ...(endsAt !== undefined && { endsAt: new Date(endsAt) }),
                    ...(isActive !== undefined && { isActive }),
                    ...(priority !== undefined && { priority }),
                },
                include: saleInclude,
            });

            return res
                .status(200)
                .json(generateCommonResponse(2042, true, formatSale(sale)));
        } catch (e) {
            console.log("error occured while updating sale", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const addProductsToSale = async (req: any, res: any) => {
        const { saleId, productIds = [] } = req.body;

        try {
            if (!saleId || !productIds.length) {
                return res.status(400).json(generateCommonResponse(4000));
            }

            const sale = await prisma.sale.findUnique({
                where: { id: saleId },
            });
            if (!sale) {
                return res.status(404).json(generateCommonResponse(4040));
            }

            const uniqueProductIds: string[] = [
                ...new Set(productIds as string[]),
            ];
            const products = await prisma.product.findMany({
                where: { productId: { in: uniqueProductIds } },
                select: { productId: true },
            });

            if (products.length !== uniqueProductIds.length) {
                return res.status(400).json(generateCommonResponse(4008));
            }

            await prisma.saleProduct.createMany({
                data: uniqueProductIds.map((productId) => ({
                    saleId,
                    productId,
                })),
                skipDuplicates: true,
            });

            const updated = await prisma.sale.findUnique({
                where: { id: saleId },
                include: saleInclude,
            });

            return res
                .status(200)
                .json(
                    generateCommonResponse(2043, true, formatSale(updated)),
                );
        } catch (e) {
            console.log("error occured while adding products to sale", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const removeProductsFromSale = async (req: any, res: any) => {
        const { saleId, productIds = [] } = req.body;

        try {
            if (!saleId || !productIds.length) {
                return res.status(400).json(generateCommonResponse(4000));
            }

            await prisma.saleProduct.deleteMany({
                where: {
                    saleId,
                    productId: { in: productIds },
                },
            });

            const updated = await prisma.sale.findUnique({
                where: { id: saleId },
                include: saleInclude,
            });

            if (!updated) {
                return res.status(404).json(generateCommonResponse(4040));
            }

            return res
                .status(200)
                .json(
                    generateCommonResponse(2044, true, formatSale(updated)),
                );
        } catch (e) {
            console.log("error occured while removing products from sale", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const deleteSale = async (req: any, res: any) => {
        const { saleId } = req.query;

        try {
            if (!saleId) {
                return res.status(400).json(generateCommonResponse(4000));
            }

            const existing = await prisma.sale.findUnique({
                where: { id: saleId },
            });
            if (!existing) {
                return res.status(404).json(generateCommonResponse(4040));
            }

            await prisma.sale.delete({ where: { id: saleId } });
            return res.status(200).json(generateCommonResponse(2045, true));
        } catch (e) {
            console.log("error occured while deleting sale", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    return {
        listSales,
        getSale,
        createSale,
        updateSale,
        addProductsToSale,
        removeProductsFromSale,
        deleteSale,
    };
};
