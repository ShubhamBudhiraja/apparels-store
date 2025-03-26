import { generateCommonResponse } from "../lib/utils/common";
import { ProductModel } from "../models/product.model";
import { RatingsModel } from "../models/ratings.model";

export const ProductControllers = () => {
    const addProduct = async (req: any, res: any) => {
        const productData = req.body;
        console.log(productData, "productData");

        try {
            const foundProduct = await ProductModel.findOne({
                productId: productData.productId,
            });

            if (foundProduct) {
                console.log("product found");
                return res.status(200).json(generateCommonResponse(4013));
            } else {
                if (productData.productId) {
                    await ProductModel.create(productData);
                    console.log("product added");
                    return res
                        .status(200)
                        .json(generateCommonResponse(2011, true));
                } else {
                    console.log("product id is missing");
                    return res.status(200).json(generateCommonResponse(4012));
                }
            }
        } catch (e) {
            console.log("error occured while adding product", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const removeProduct = async (req: any, res: any) => {
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
                return res.status(200).json(generateCommonResponse(4008));
            }
        } catch (e) {
            console.log("error occured while removing product", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const getProductDetails = async (req: any, res: any) => {
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
                    const reviews = productRatings.get("reviews");
                    const total = reviews.reduce(
                        (a, b) => a + b.get("rating"),
                        0
                    );
                    productDetails.set(
                        "ratings",
                        Math.round(
                            (total / productRatings.reviews.length) * 10
                        ) / 10
                    );
                    productDetails.set(
                        "reviewsCount",
                        productRatings.reviews.length
                    );
                    productDetails.set("reviews", productRatings.reviews);
                }

                return res
                    .status(200)
                    .json(generateCommonResponse(2012, true, productDetails));
            } else {
                console.log("product not found");
                return res.status(200).json(generateCommonResponse(4008));
            }
        } catch (e) {
            console.log("error occured while getting product details", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const getAllProducts = async (req: any, res: any) => {
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

    const getRelatedProducts = async (req: any, res: any) => {
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
