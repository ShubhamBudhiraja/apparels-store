const ProductModel = require("../models/product.model");
const UserModel = require("../models/user.model");
const commonUtils = require("../utils/common");

const UserControllers = () => {
    const { generateCommonResponse } = commonUtils();

    const getProfile = async (req, res) => {
        const { userId } = req.query;

        try {
            const found = await UserModel.findOne({ userId });

            if (found) {
                console.log("get profile - user details sent", found);
                const userDetails = found;
                if (found.cart.products.length) {
                    const products = await ProductModel.find();
                    if (found.cart.products.length)
                        userDetails.cart.products = found.cart.products.map(
                            (prod) => {
                                const temp = prod;
                                const foundProduct = products.find(
                                    (item) => item.productId === prod.productId
                                );
                                const availableUnits =
                                    foundProduct.variants.find(
                                        (item) =>
                                            item.id === prod.selectedVariant
                                    ).units;
                                temp.isAvailable = availableUnits > 0;

                                return temp;
                            }
                        );
                }
                return res
                    .status(200)
                    .json(generateCommonResponse(2006, true, userDetails));
            } else {
                console.log("get profile - user not found");
                return res.status(400).json(generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while getting profile", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const updateProfile = async (req, res) => {
        const { userId, ...rest } = req.body;
        delete rest.cart;
        delete rest.wishlist;

        try {
            const found = await UserModel.findOneAndUpdate(
                { userId },
                { $set: rest }
            );

            if (found) {
                console.log("updateProfile user found", found);
                return res.status(200).json(generateCommonResponse(2005, true));
            } else {
                console.log("updateProfile user not found");
                return res.status(400).json(generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while updating profile", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    return { getProfile, updateProfile };
};

module.exports = UserControllers;
