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
exports.SaleControllers = void 0;
const client_1 = require("@prisma/client");
const common_1 = require("../lib/utils/common");
const prisma_1 = __importDefault(require("../config/prisma"));
const pricing_1 = require("../lib/utils/pricing");
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
};
const formatSale = (sale) => ({
    id: sale.id,
    name: sale.name,
    slug: sale.slug,
    discountType: sale.discountType,
    discountValue: sale.discountValue,
    startsAt: sale.startsAt,
    endsAt: sale.endsAt,
    isActive: sale.isActive,
    priority: sale.priority,
    isCurrentlyActive: (0, pricing_1.isSaleCurrentlyActive)(sale),
    products: (sale.products || []).map((entry) => ({
        productId: entry.product.productId,
        title: entry.product.title,
        thumbnail: entry.product.thumbnail,
        price: entry.product.price,
    })),
});
const SaleControllers = () => {
    const listSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { activeOnly } = req.query;
        try {
            const now = new Date();
            const sales = yield prisma_1.default.sale.findMany({
                where: activeOnly === "true"
                    ? {
                        isActive: true,
                        startsAt: { lte: now },
                        endsAt: { gte: now },
                    }
                    : undefined,
                include: saleInclude,
                orderBy: [{ priority: "desc" }, { startsAt: "desc" }],
            });
            return res.status(200).json((0, common_1.generateCommonResponse)(2040, true, {
                sales: sales.map(formatSale),
            }));
        }
        catch (e) {
            console.log("error occured while listing sales", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const getSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { saleId, slug } = req.query;
        try {
            const sale = yield prisma_1.default.sale.findFirst({
                where: Object.assign(Object.assign({}, (saleId ? { id: saleId } : {})), (slug ? { slug } : {})),
                include: saleInclude,
            });
            if (!sale) {
                return res.status(404).json((0, common_1.generateCommonResponse)(4040));
            }
            return res
                .status(200)
                .json((0, common_1.generateCommonResponse)(2040, true, formatSale(sale)));
        }
        catch (e) {
            console.log("error occured while getting sale", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const createSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, slug, discountType, discountValue, startsAt, endsAt, isActive, priority, productIds = [], } = req.body;
        try {
            if (!name ||
                !slug ||
                !discountType ||
                discountValue === undefined ||
                !startsAt ||
                !endsAt) {
                return res.status(400).json((0, common_1.generateCommonResponse)(4000));
            }
            if (!Object.values(client_1.DiscountType).includes(discountType) ||
                Number(discountValue) <= 0) {
                return res.status(400).json((0, common_1.generateCommonResponse)(4000));
            }
            if (discountType === client_1.DiscountType.PERCENT && discountValue > 100) {
                return res.status(400).json((0, common_1.generateCommonResponse)(4000));
            }
            const uniqueProductIds = [
                ...new Set(productIds),
            ];
            if (uniqueProductIds.length) {
                const products = yield prisma_1.default.product.findMany({
                    where: { productId: { in: uniqueProductIds } },
                    select: { productId: true },
                });
                if (products.length !== uniqueProductIds.length) {
                    return res.status(400).json((0, common_1.generateCommonResponse)(4008));
                }
            }
            const sale = yield prisma_1.default.sale.create({
                data: {
                    name,
                    slug: String(slug).toLowerCase(),
                    discountType,
                    discountValue: Number(discountValue),
                    startsAt: new Date(startsAt),
                    endsAt: new Date(endsAt),
                    isActive: isActive !== null && isActive !== void 0 ? isActive : true,
                    priority: priority !== null && priority !== void 0 ? priority : 0,
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
                .json((0, common_1.generateCommonResponse)(2041, true, formatSale(sale)));
        }
        catch (e) {
            console.log("error occured while creating sale", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const updateSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { saleId, name, slug, discountType, discountValue, startsAt, endsAt, isActive, priority, } = req.body;
        try {
            if (!saleId) {
                return res.status(400).json((0, common_1.generateCommonResponse)(4000));
            }
            const existing = yield prisma_1.default.sale.findUnique({
                where: { id: saleId },
            });
            if (!existing) {
                return res.status(404).json((0, common_1.generateCommonResponse)(4040));
            }
            if (discountType &&
                !Object.values(client_1.DiscountType).includes(discountType)) {
                return res.status(400).json((0, common_1.generateCommonResponse)(4000));
            }
            const sale = yield prisma_1.default.sale.update({
                where: { id: saleId },
                data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (name !== undefined && { name })), (slug !== undefined && {
                    slug: String(slug).toLowerCase(),
                })), (discountType !== undefined && { discountType })), (discountValue !== undefined && {
                    discountValue: Number(discountValue),
                })), (startsAt !== undefined && {
                    startsAt: new Date(startsAt),
                })), (endsAt !== undefined && { endsAt: new Date(endsAt) })), (isActive !== undefined && { isActive })), (priority !== undefined && { priority })),
                include: saleInclude,
            });
            return res
                .status(200)
                .json((0, common_1.generateCommonResponse)(2042, true, formatSale(sale)));
        }
        catch (e) {
            console.log("error occured while updating sale", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const addProductsToSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { saleId, productIds = [] } = req.body;
        try {
            if (!saleId || !productIds.length) {
                return res.status(400).json((0, common_1.generateCommonResponse)(4000));
            }
            const sale = yield prisma_1.default.sale.findUnique({
                where: { id: saleId },
            });
            if (!sale) {
                return res.status(404).json((0, common_1.generateCommonResponse)(4040));
            }
            const uniqueProductIds = [
                ...new Set(productIds),
            ];
            const products = yield prisma_1.default.product.findMany({
                where: { productId: { in: uniqueProductIds } },
                select: { productId: true },
            });
            if (products.length !== uniqueProductIds.length) {
                return res.status(400).json((0, common_1.generateCommonResponse)(4008));
            }
            yield prisma_1.default.saleProduct.createMany({
                data: uniqueProductIds.map((productId) => ({
                    saleId,
                    productId,
                })),
                skipDuplicates: true,
            });
            const updated = yield prisma_1.default.sale.findUnique({
                where: { id: saleId },
                include: saleInclude,
            });
            return res
                .status(200)
                .json((0, common_1.generateCommonResponse)(2043, true, formatSale(updated)));
        }
        catch (e) {
            console.log("error occured while adding products to sale", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const removeProductsFromSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { saleId, productIds = [] } = req.body;
        try {
            if (!saleId || !productIds.length) {
                return res.status(400).json((0, common_1.generateCommonResponse)(4000));
            }
            yield prisma_1.default.saleProduct.deleteMany({
                where: {
                    saleId,
                    productId: { in: productIds },
                },
            });
            const updated = yield prisma_1.default.sale.findUnique({
                where: { id: saleId },
                include: saleInclude,
            });
            if (!updated) {
                return res.status(404).json((0, common_1.generateCommonResponse)(4040));
            }
            return res
                .status(200)
                .json((0, common_1.generateCommonResponse)(2044, true, formatSale(updated)));
        }
        catch (e) {
            console.log("error occured while removing products from sale", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const deleteSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { saleId } = req.query;
        try {
            if (!saleId) {
                return res.status(400).json((0, common_1.generateCommonResponse)(4000));
            }
            const existing = yield prisma_1.default.sale.findUnique({
                where: { id: saleId },
            });
            if (!existing) {
                return res.status(404).json((0, common_1.generateCommonResponse)(4040));
            }
            yield prisma_1.default.sale.delete({ where: { id: saleId } });
            return res.status(200).json((0, common_1.generateCommonResponse)(2045, true));
        }
        catch (e) {
            console.log("error occured while deleting sale", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
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
exports.SaleControllers = SaleControllers;
//# sourceMappingURL=sale.controller.js.map