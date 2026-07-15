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
exports.resolveProductCategoryFilter = exports.resolveCategoryId = exports.formatCategoryNode = exports.productInclude = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
exports.productInclude = {
    variants: true,
    category: {
        include: {
            parent: true,
        },
    },
    sales: {
        include: {
            sale: true,
        },
    },
};
const formatCategoryNode = (category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    parentId: category.parentId,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    children: (category.children || [])
        .filter((child) => child.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((child) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        parentId: child.parentId,
        sortOrder: child.sortOrder,
        isActive: child.isActive,
    })),
});
exports.formatCategoryNode = formatCategoryNode;
const resolveCategoryId = (_a) => __awaiter(void 0, [_a], void 0, function* ({ categoryId, segment, category, }) {
    if (categoryId) {
        const found = yield prisma_1.default.category.findUnique({
            where: { id: categoryId },
        });
        return (found === null || found === void 0 ? void 0 : found.id) || null;
    }
    if (segment && category) {
        const parent = yield prisma_1.default.category.findFirst({
            where: { slug: segment, parentId: null, isActive: true },
        });
        if (!parent)
            return null;
        const leaf = yield prisma_1.default.category.findFirst({
            where: {
                slug: category,
                parentId: parent.id,
                isActive: true,
            },
        });
        return (leaf === null || leaf === void 0 ? void 0 : leaf.id) || null;
    }
    return null;
});
exports.resolveCategoryId = resolveCategoryId;
/** Returns category IDs to filter products for shop (root → all children). */
const resolveProductCategoryFilter = (_a) => __awaiter(void 0, [_a], void 0, function* ({ segment, category, categoryId, }) {
    if (categoryId) {
        return { categoryId };
    }
    if (segment && category) {
        const leafId = yield (0, exports.resolveCategoryId)({ segment, category });
        return leafId ? { categoryId: leafId } : { categoryId: "__none__" };
    }
    if (segment) {
        const root = yield prisma_1.default.category.findFirst({
            where: { slug: segment, parentId: null, isActive: true },
            include: { children: { where: { isActive: true } } },
        });
        if (!root)
            return { categoryId: "__none__" };
        const ids = [root.id, ...root.children.map((child) => child.id)];
        return { categoryId: { in: ids } };
    }
    if (category) {
        const leaves = yield prisma_1.default.category.findMany({
            where: { slug: category, parentId: { not: null }, isActive: true },
        });
        if (!leaves.length)
            return { categoryId: "__none__" };
        return { categoryId: { in: leaves.map((leaf) => leaf.id) } };
    }
    return {};
});
exports.resolveProductCategoryFilter = resolveProductCategoryFilter;
//# sourceMappingURL=category.js.map