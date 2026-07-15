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
exports.ProductControllers = void 0;
const common_1 = require("../lib/utils/common");
const prisma_1 = __importDefault(require("../config/prisma"));
const product_1 = require("../lib/utils/product");
const category_1 = require("../lib/utils/category");
const ProductControllers = () => {
    const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const productData = req.body;
        console.log(productData, "productData");
        try {
            if (!productData.productId) {
                console.log("product id is missing");
                return res.status(200).json((0, common_1.generateCommonResponse)(4012));
            }
            const foundProduct = yield (0, product_1.findProductByProductId)(productData.productId);
            if (foundProduct) {
                console.log("product found");
                return res.status(200).json((0, common_1.generateCommonResponse)(4013));
            }
            const categoryId = yield (0, category_1.resolveCategoryId)({
                categoryId: productData.categoryId,
                segment: productData.segment,
                category: productData.category,
            });
            if (!categoryId) {
                console.log("category not found for product");
                return res.status(400).json((0, common_1.generateCommonResponse)(4032));
            }
            const variants = Array.isArray(productData.variants)
                ? productData.variants
                : [];
            yield prisma_1.default.product.create({
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
                        create: variants.map((variant) => ({
                            variantId: variant.id,
                            units: variant.units,
                        })),
                    },
                },
            });
            console.log("product added");
            return res.status(200).json((0, common_1.generateCommonResponse)(2011, true));
        }
        catch (e) {
            console.log("error occured while adding product", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const removeProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { prodId } = req.query;
        try {
            const foundProduct = yield (0, product_1.findProductByProductId)(prodId);
            if (!foundProduct) {
                console.log("product not found");
                return res.status(200).json((0, common_1.generateCommonResponse)(4008));
            }
            yield prisma_1.default.product.delete({
                where: { productId: prodId },
            });
            console.log("product found");
            return res.status(200).json((0, common_1.generateCommonResponse)(2010, true));
        }
        catch (e) {
            console.log("error occured while removing product", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const getProductDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { prodId, segment = "" } = req.query;
        try {
            const productDetails = yield prisma_1.default.product.findFirst({
                where: Object.assign({ productId: prodId }, (segment
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
                    : {})),
                include: Object.assign(Object.assign({}, category_1.productInclude), { reviews: true }),
            });
            if (!productDetails) {
                console.log("product not found");
                return res.status(200).json((0, common_1.generateCommonResponse)(4008));
            }
            console.log("product found", productDetails);
            const reviews = productDetails.reviews;
            const extras = reviews.length > 0
                ? {
                    ratings: Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) /
                        reviews.length) *
                        10) / 10,
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
                .json((0, common_1.generateCommonResponse)(2012, true, (0, product_1.formatProduct)(productDetails, extras)));
        }
        catch (e) {
            console.log("error occured while getting product details", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { segment, category, productId, categoryId } = req.query;
            const categoryFilter = yield (0, category_1.resolveProductCategoryFilter)({
                segment,
                category,
                categoryId,
            });
            if (categoryFilter.categoryId === "__none__" ||
                (typeof categoryFilter.categoryId === "object" &&
                    "in" in categoryFilter.categoryId &&
                    categoryFilter.categoryId.in.includes("__none__"))) {
                return res.status(200).json((0, common_1.generateCommonResponse)(2012, true, { products: [] }));
            }
            const products = yield prisma_1.default.product.findMany({
                where: Object.assign(Object.assign({}, categoryFilter), (productId ? { productId } : {})),
                include: category_1.productInclude,
            });
            return res.status(200).json((0, common_1.generateCommonResponse)(2012, true, {
                products: products.map((product) => (0, product_1.formatProduct)(product)),
            }));
        }
        catch (e) {
            console.log("error occured while getting all products", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const getRelatedProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { prodId, categoryId } = req.query;
            const found = yield prisma_1.default.product.findMany({
                where: {
                    productId: { not: prodId },
                    OR: [
                        { categoryId },
                        { category: { slug: categoryId } },
                    ],
                },
                include: category_1.productInclude,
            });
            const products = found.map((product) => (0, product_1.formatProduct)(product));
            console.log("related products found", products, found);
            return res
                .status(200)
                .json((0, common_1.generateCommonResponse)(2012, true, { products }));
        }
        catch (e) {
            console.log("error occured while getting related products", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    return {
        addProduct,
        removeProduct,
        getProductDetails,
        getAllProducts,
        getRelatedProducts,
    };
};
exports.ProductControllers = ProductControllers;
//# sourceMappingURL=product.controller.js.map