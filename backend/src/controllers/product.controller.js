const ProductModel = require("../models/product.model");
const commonUtils = require("../utils/common");

const ProductControllers = () => {
    const { generateCommonResponse } = commonUtils();

    const add = async (req, res) => {
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

    const remove = async (req, res) => {
        const { productId } = req.query;

        try {
            const foundProduct = await ProductModel.findOneAndDelete({
                productId,
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

    const get = async (req, res) => {
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

    return { add, remove, get };
};

module.exports = ProductControllers;
