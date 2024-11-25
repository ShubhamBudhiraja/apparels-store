const ProductModel = require("../models/product.model");
const RatingsModel = require("../models/ratings.model");
const commonUtils = require("../utils/common");

const ProductControllers = () => {
    const { generateCommonResponse } = commonUtils();

    const addProduct = async (req, res) => {
        const productData = req.body;
        console.log(productData, "productData");

        try {
            const foundProduct = await ProductModel.findOne({
                productId: productData.productId,
            });

            if (foundProduct) {
                console.log("product found");
                return res.status(400).json(generateCommonResponse(4013));
            } else {
                if (productData.productId) {
                    await ProductModel.create(productData);
                    console.log("product added");
                    return res
                        .status(200)
                        .json(generateCommonResponse(2011, true));
                } else {
                    console.log("product id is missing");
                    return res.status(400).json(generateCommonResponse(4012));
                }
            }
        } catch (e) {
            console.log("error occured while adding product", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const removeProduct = async (req, res) => {
        const { prodId } = req.query;

        try {
            const foundProduct = await ProductModel.findOneAndDelete({
                productId: prodId,
            });

            if (foundProduct) {
                console.log("product found");
                return res.status(200).json(generateCommonResponse(2010, true));
            } else {
                console.log("product not found");
                return res.status(400).json(generateCommonResponse(4008));
            }
        } catch (e) {
            console.log("error occured while removing product", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const getProductDetails = async (req, res) => {
        const { prodId, segment = "" } = req.query;

        try {
            const productDetails = await ProductModel.findOne({
                productId: prodId,
                segment,
            });

            if (productDetails) {
                console.log("product found", productDetails);
                const productRatings = await RatingsModel.findOne({
                    productId: prodId,
                });

                if (productRatings) {
                    const total = productRatings.reviews.reduce(
                        (a, b) => a.rating + b.rating
                    );
                    productDetails.ratings =
                        Math.round(
                            (total / productRatings.reviews.length) * 10
                        ) / 10;
                    productDetails.reviewsCount = productRatings.reviews.length;
                    productDetails.reviews = productRatings.reviews;
                }

                return res
                    .status(200)
                    .json(generateCommonResponse(2012, true, productDetails));
            } else {
                console.log("product not found");
                return res.status(400).json(generateCommonResponse(4008));
            }
        } catch (e) {
            console.log("error occured while getting product details", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const getAllProducts = async (req, res) => {
        try {
            const requestParams = req.query;
            const products = await ProductModel.find(requestParams);
            return res
                .status(200)
                .json(generateCommonResponse(2012, true, { products }));
        } catch (e) {
            console.log("error occured while getting all products", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const getRelatedProducts = async (req, res) => {
        try {
            const { prodId, categoryId } = req.query;

            const found = await ProductModel.find({ category: categoryId });
            const products = found.filter((prod) => prod.productId !== prodId);

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

module.exports = ProductControllers;
