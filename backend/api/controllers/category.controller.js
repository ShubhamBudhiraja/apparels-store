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
exports.CategoryControllers = void 0;
const common_1 = require("../lib/utils/common");
const prisma_1 = __importDefault(require("../config/prisma"));
const category_1 = require("../lib/utils/category");
const CategoryControllers = () => {
    const getCategoryTree = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const roots = yield prisma_1.default.category.findMany({
                where: { parentId: null, isActive: true },
                include: {
                    children: {
                        where: { isActive: true },
                        orderBy: { sortOrder: "asc" },
                    },
                },
                orderBy: { sortOrder: "asc" },
            });
            return res.status(200).json((0, common_1.generateCommonResponse)(2030, true, {
                categories: roots.map(category_1.formatCategoryNode),
            }));
        }
        catch (e) {
            console.log("error occured while fetching categories", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, slug, parentId, sortOrder, isActive } = req.body;
        try {
            if (!name || !slug) {
                return res.status(400).json((0, common_1.generateCommonResponse)(4000));
            }
            if (parentId) {
                const parent = yield prisma_1.default.category.findUnique({
                    where: { id: parentId },
                });
                if (!parent || parent.parentId) {
                    return res.status(400).json((0, common_1.generateCommonResponse)(4031));
                }
            }
            else {
                const existingRoot = yield prisma_1.default.category.findFirst({
                    where: { slug, parentId: null },
                });
                if (existingRoot) {
                    return res.status(400).json((0, common_1.generateCommonResponse)(4030));
                }
            }
            const category = yield prisma_1.default.category.create({
                data: {
                    name,
                    slug: String(slug).toLowerCase(),
                    parentId: parentId || null,
                    sortOrder: sortOrder !== null && sortOrder !== void 0 ? sortOrder : 0,
                    isActive: isActive !== null && isActive !== void 0 ? isActive : true,
                },
            });
            return res
                .status(200)
                .json((0, common_1.generateCommonResponse)(2031, true, category));
        }
        catch (e) {
            console.log("error occured while creating category", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryId, name, slug, sortOrder, isActive } = req.body;
        try {
            if (!categoryId) {
                return res.status(400).json((0, common_1.generateCommonResponse)(4000));
            }
            const existing = yield prisma_1.default.category.findUnique({
                where: { id: categoryId },
            });
            if (!existing) {
                return res.status(404).json((0, common_1.generateCommonResponse)(4032));
            }
            const category = yield prisma_1.default.category.update({
                where: { id: categoryId },
                data: Object.assign(Object.assign(Object.assign(Object.assign({}, (name !== undefined && { name })), (slug !== undefined && {
                    slug: String(slug).toLowerCase(),
                })), (sortOrder !== undefined && { sortOrder })), (isActive !== undefined && { isActive })),
            });
            return res
                .status(200)
                .json((0, common_1.generateCommonResponse)(2032, true, category));
        }
        catch (e) {
            console.log("error occured while updating category", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryId } = req.query;
        try {
            if (!categoryId) {
                return res.status(400).json((0, common_1.generateCommonResponse)(4000));
            }
            const existing = yield prisma_1.default.category.findUnique({
                where: { id: categoryId },
                include: {
                    children: true,
                    products: { select: { id: true }, take: 1 },
                },
            });
            if (!existing) {
                return res.status(404).json((0, common_1.generateCommonResponse)(4032));
            }
            if (existing.children.length || existing.products.length) {
                return res.status(400).json((0, common_1.generateCommonResponse)(4033));
            }
            yield prisma_1.default.category.delete({ where: { id: categoryId } });
            return res.status(200).json((0, common_1.generateCommonResponse)(2033, true));
        }
        catch (e) {
            console.log("error occured while deleting category", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    /** Helper for product create when only slugs are provided. */
    const resolveLeaf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { segment, category, categoryId } = req.query;
        const id = yield (0, category_1.resolveCategoryId)({
            segment,
            category,
            categoryId,
        });
        if (!id) {
            return res.status(404).json((0, common_1.generateCommonResponse)(4032));
        }
        return res.status(200).json((0, common_1.generateCommonResponse)(2030, true, { id }));
    });
    return {
        getCategoryTree,
        createCategory,
        updateCategory,
        deleteCategory,
        resolveLeaf,
    };
};
exports.CategoryControllers = CategoryControllers;
//# sourceMappingURL=category.controller.js.map