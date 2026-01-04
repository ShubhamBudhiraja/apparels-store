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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductControllers = void 0;
const common_1 = require("../lib/utils/common");
const product_model_1 = require("../models/product.model");
const ratings_model_1 = require("../models/ratings.model");
const ProductControllers = () => {
    const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const productData = req.body;
        console.log(productData, "productData");
        try {
            const foundProduct = yield product_model_1.ProductModel.findOne({
                productId: productData.productId,
            });
            if (foundProduct) {
                console.log("product found");
                return res.status(200).json((0, common_1.generateCommonResponse)(4013));
            }
            else {
                if (productData.productId) {
                    yield product_model_1.ProductModel.create(productData);
                    console.log("product added");
                    return res
                        .status(200)
                        .json((0, common_1.generateCommonResponse)(2011, true));
                }
                else {
                    console.log("product id is missing");
                    return res.status(200).json((0, common_1.generateCommonResponse)(4012));
                }
            }
        }
        catch (e) {
            console.log("error occured while adding product", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const removeProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { prodId } = req.query;
        try {
            const foundProduct = yield product_model_1.ProductModel.findOneAndDelete({
                productId: prodId,
            });
            if (foundProduct) {
                console.log("product found");
                return res.status(200).json((0, common_1.generateCommonResponse)(2010, true));
            }
            else {
                console.log("product not found");
                return res.status(200).json((0, common_1.generateCommonResponse)(4008));
            }
        }
        catch (e) {
            console.log("error occured while removing product", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const getProductDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { prodId, segment = "" } = req.query;
        try {
            const productDetails = yield product_model_1.ProductModel.findOne({
                productId: prodId,
                segment,
            });
            if (productDetails) {
                console.log("product found", productDetails);
                const productRatings = yield ratings_model_1.RatingsModel.findOne({
                    productId: prodId,
                });
                if (productRatings) {
                    const reviews = productRatings.get("reviews");
                    const total = reviews.reduce((a, b) => a + b.get("rating"), 0);
                    productDetails.set("ratings", Math.round((total / productRatings.reviews.length) * 10) / 10);
                    productDetails.set("reviewsCount", productRatings.reviews.length);
                    productDetails.set("reviews", productRatings.reviews);
                }
                return res
                    .status(200)
                    .json((0, common_1.generateCommonResponse)(2012, true, productDetails));
            }
            else {
                console.log("product not found");
                return res.status(200).json((0, common_1.generateCommonResponse)(4008));
            }
        }
        catch (e) {
            console.log("error occured while getting product details", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const requestParams = req.query;
            const products = yield product_model_1.ProductModel.find(requestParams);
            return res
                .status(200)
                .json((0, common_1.generateCommonResponse)(2012, true, { products }));
        }
        catch (e) {
            console.log("error occured while getting all products", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const getRelatedProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { prodId, categoryId } = req.query;
            const found = yield product_model_1.ProductModel.find({ category: categoryId });
            const products = found.filter((prod) => prod.productId !== prodId);
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