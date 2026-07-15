import { generateCommonResponse } from "../lib/utils/common";
import prisma from "../config/prisma";
import {
    findProductByProductId,
    formatProduct,
} from "../lib/utils/product";
import {
    productInclude,
    resolveCategoryId,
    resolveProductCategoryFilter,
} from "../lib/utils/category";

export const ProductControllers = () => {
    const addProduct = async (req: any, res: any) => {
        const productData = req.body;
        console.log(productData, "productData");

        try {
            if (!productData.productId) {
                console.log("product id is missing");
                return res.status(200).json(generateCommonResponse(4012));
            }

            const foundProduct = await findProductByProductId(
                productData.productId,
            );

            if (foundProduct) {
                console.log("product found");
                return res.status(200).json(generateCommonResponse(4013));
            }

            const categoryId = await resolveCategoryId({
                categoryId: productData.categoryId,
                segment: productData.segment,
                category: productData.category,
            });

            if (!categoryId) {
                console.log("category not found for product");
                return res.status(400).json(generateCommonResponse(4032));
            }

            const variants = Array.isArray(productData.variants)
                ? productData.variants
                : [];

            await prisma.product.create({
                data: {
                    productId: productData.productId,
                    title: productData.title,
                    price: productData.price,
                    offerPrice: productData.offerPrice,
                    categoryId,
                    description: productData.description,
                    shortDescription: productData.shortDescription,
                    discountPercentage: productData.discountPercentage,
                    discountAmount: productData.discountAmount,
                    images: productData.images || [],
                    thumbnail: productData.thumbnail,
                    variants: {
                        create: variants.map(
                            (variant: { id: string; units: number }) => ({
                                variantId: variant.id,
                                units: variant.units,
                            }),
                        ),
                    },
                },
            });

            console.log("product added");
            return res.status(200).json(generateCommonResponse(2011, true));
        } catch (e) {
            console.log("error occured while adding product", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const removeProduct = async (req: any, res: any) => {
        const { prodId } = req.query;

        try {
            const foundProduct = await findProductByProductId(prodId);

            if (!foundProduct) {
                console.log("product not found");
                return res.status(200).json(generateCommonResponse(4008));
            }

            await prisma.product.delete({
                where: { productId: prodId },
            });

            console.log("product found");
            return res.status(200).json(generateCommonResponse(2010, true));
        } catch (e) {
            console.log("error occured while removing product", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const getProductDetails = async (req: any, res: any) => {
        const { prodId, segment = "" } = req.query;

        try {
            const productDetails = await prisma.product.findFirst({
                where: {
                    productId: prodId,
                    ...(segment
                        ? {
                              OR: [
                                  {
                                      category: {
                                          slug: segment,
                                          parentId: null,
                                      },
                                  },
                                  {
                                      category: {
                                          parent: { slug: segment },
                                      },
                                  },
                              ],
                          }
                        : {}),
                },
                include: {
                    ...productInclude,
                    reviews: true,
                },
            });

            if (!productDetails) {
                console.log("product not found");
                return res.status(200).json(generateCommonResponse(4008));
            }

            console.log("product found", productDetails);

            const reviews = productDetails.reviews;
            const extras =
                reviews.length > 0
                    ? {
                          ratings:
                              Math.round(
                                  (reviews.reduce(
                                      (sum, review) => sum + review.rating,
                                      0,
                                  ) /
                                      reviews.length) *
                                      10,
                              ) / 10,
                          reviewsCount: reviews.length,
                          reviews: reviews.map((review) => ({
                              userId: review.userId,
                              rating: review.rating,
                              feedback: review.feedback,
                          })),
                      }
                    : undefined;

            return res
                .status(200)
                .json(
                    generateCommonResponse(
                        2012,
                        true,
                        formatProduct(productDetails, extras),
                    ),
                );
        } catch (e) {
            console.log("error occured while getting product details", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const getAllProducts = async (req: any, res: any) => {
        try {
            const { segment, category, productId, categoryId } = req.query;
            const categoryFilter = await resolveProductCategoryFilter({
                segment,
                category,
                categoryId,
            });

            if (
                categoryFilter.categoryId === "__none__" ||
                (typeof categoryFilter.categoryId === "object" &&
                    "in" in categoryFilter.categoryId &&
                    categoryFilter.categoryId.in.includes("__none__"))
            ) {
                return res.status(200).json(
                    generateCommonResponse(2012, true, { products: [] }),
                );
            }

            const products = await prisma.product.findMany({
                where: {
                    ...categoryFilter,
                    ...(productId ? { productId } : {}),
                },
                include: productInclude,
            });

            return res.status(200).json(
                generateCommonResponse(2012, true, {
                    products: products.map((product) => formatProduct(product)),
                }),
            );
        } catch (e) {
            console.log("error occured while getting all products", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const getRelatedProducts = async (req: any, res: any) => {
        try {
            const { prodId, categoryId } = req.query;

            const found = await prisma.product.findMany({
                where: {
                    productId: { not: prodId },
                    OR: [
                        { categoryId },
                        { category: { slug: categoryId } },
                    ],
                },
                include: productInclude,
            });

            const products = found.map((product) => formatProduct(product));

            console.log("related products found", products, found);

            return res
                .status(200)
                .json(generateCommonResponse(2012, true, { products }));
        } catch (e) {
            console.log("error occured while getting related products", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    return {
        addProduct,
        removeProduct,
        getProductDetails,
        getAllProducts,
        getRelatedProducts,
    };
};
