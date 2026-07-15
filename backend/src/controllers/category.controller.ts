import { generateCommonResponse } from "../lib/utils/common";
import prisma from "../config/prisma";
import {
    formatCategoryNode,
    resolveCategoryId,
} from "../lib/utils/category";

export const CategoryControllers = () => {
    const getCategoryTree = async (_req: any, res: any) => {
        try {
            const roots = await prisma.category.findMany({
                where: { parentId: null, isActive: true },
                include: {
                    children: {
                        where: { isActive: true },
                        orderBy: { sortOrder: "asc" },
                    },
                },
                orderBy: { sortOrder: "asc" },
            });

            return res.status(200).json(
                generateCommonResponse(2030, true, {
                    categories: roots.map(formatCategoryNode),
                }),
            );
        } catch (e) {
            console.log("error occured while fetching categories", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const createCategory = async (req: any, res: any) => {
        const { name, slug, parentId, sortOrder, isActive } = req.body;

        try {
            if (!name || !slug) {
                return res.status(400).json(generateCommonResponse(4000));
            }

            if (parentId) {
                const parent = await prisma.category.findUnique({
                    where: { id: parentId },
                });
                if (!parent || parent.parentId) {
                    return res.status(400).json(generateCommonResponse(4031));
                }
            } else {
                const existingRoot = await prisma.category.findFirst({
                    where: { slug, parentId: null },
                });
                if (existingRoot) {
                    return res.status(400).json(generateCommonResponse(4030));
                }
            }

            const category = await prisma.category.create({
                data: {
                    name,
                    slug: String(slug).toLowerCase(),
                    parentId: parentId || null,
                    sortOrder: sortOrder ?? 0,
                    isActive: isActive ?? true,
                },
            });

            return res
                .status(200)
                .json(generateCommonResponse(2031, true, category));
        } catch (e) {
            console.log("error occured while creating category", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const updateCategory = async (req: any, res: any) => {
        const { categoryId, name, slug, sortOrder, isActive } = req.body;

        try {
            if (!categoryId) {
                return res.status(400).json(generateCommonResponse(4000));
            }

            const existing = await prisma.category.findUnique({
                where: { id: categoryId },
            });

            if (!existing) {
                return res.status(404).json(generateCommonResponse(4032));
            }

            const category = await prisma.category.update({
                where: { id: categoryId },
                data: {
                    ...(name !== undefined && { name }),
                    ...(slug !== undefined && {
                        slug: String(slug).toLowerCase(),
                    }),
                    ...(sortOrder !== undefined && { sortOrder }),
                    ...(isActive !== undefined && { isActive }),
                },
            });

            return res
                .status(200)
                .json(generateCommonResponse(2032, true, category));
        } catch (e) {
            console.log("error occured while updating category", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const deleteCategory = async (req: any, res: any) => {
        const { categoryId } = req.query;

        try {
            if (!categoryId) {
                return res.status(400).json(generateCommonResponse(4000));
            }

            const existing = await prisma.category.findUnique({
                where: { id: categoryId },
                include: {
                    children: true,
                    products: { select: { id: true }, take: 1 },
                },
            });

            if (!existing) {
                return res.status(404).json(generateCommonResponse(4032));
            }

            if (existing.children.length || existing.products.length) {
                return res.status(400).json(generateCommonResponse(4033));
            }

            await prisma.category.delete({ where: { id: categoryId } });
            return res.status(200).json(generateCommonResponse(2033, true));
        } catch (e) {
            console.log("error occured while deleting category", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    /** Helper for product create when only slugs are provided. */
    const resolveLeaf = async (req: any, res: any) => {
        const { segment, category, categoryId } = req.query;
        const id = await resolveCategoryId({
            segment,
            category,
            categoryId,
        });

        if (!id) {
            return res.status(404).json(generateCommonResponse(4032));
        }

        return res.status(200).json(generateCommonResponse(2030, true, { id }));
    };

    return {
        getCategoryTree,
        createCategory,
        updateCategory,
        deleteCategory,
        resolveLeaf,
    };
};
