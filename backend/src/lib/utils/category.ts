import prisma from "../../config/prisma";

export const productInclude = {
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
} as const;

export const formatCategoryNode = (category: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    sortOrder: number;
    isActive: boolean;
    children?: {
        id: string;
        name: string;
        slug: string;
        parentId: string | null;
        sortOrder: number;
        isActive: boolean;
    }[];
}) => ({
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

export const resolveCategoryId = async ({
    categoryId,
    segment,
    category,
}: {
    categoryId?: string;
    segment?: string;
    category?: string;
}) => {
    if (categoryId) {
        const found = await prisma.category.findUnique({
            where: { id: categoryId },
        });
        return found?.id || null;
    }

    if (segment && category) {
        const parent = await prisma.category.findFirst({
            where: { slug: segment, parentId: null, isActive: true },
        });
        if (!parent) return null;

        const leaf = await prisma.category.findFirst({
            where: {
                slug: category,
                parentId: parent.id,
                isActive: true,
            },
        });
        return leaf?.id || null;
    }

    return null;
};

/** Returns category IDs to filter products for shop (root → all children). */
export const resolveProductCategoryFilter = async ({
    segment,
    category,
    categoryId,
}: {
    segment?: string;
    category?: string;
    categoryId?: string;
}) => {
    if (categoryId) {
        return { categoryId };
    }

    if (segment && category) {
        const leafId = await resolveCategoryId({ segment, category });
        return leafId ? { categoryId: leafId } : { categoryId: "__none__" };
    }

    if (segment) {
        const root = await prisma.category.findFirst({
            where: { slug: segment, parentId: null, isActive: true },
            include: { children: { where: { isActive: true } } },
        });

        if (!root) return { categoryId: "__none__" };

        const ids = [root.id, ...root.children.map((child) => child.id)];
        return { categoryId: { in: ids } };
    }

    if (category) {
        const leaves = await prisma.category.findMany({
            where: { slug: category, parentId: { not: null }, isActive: true },
        });
        if (!leaves.length) return { categoryId: "__none__" };
        return { categoryId: { in: leaves.map((leaf) => leaf.id) } };
    }

    return {};
};
