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
                console.log("get profile - user details found", found);
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
        delete rest.addresses;

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

    const addAddress = async (req, res) => {
        const { userId, address } = req.body;

        try {
            const found = await UserModel.findOne({ userId });

            if (found) {
                console.log("user details found", found);
                const userDetails = found;

                userDetails.addresses.push(address);

                const result = await UserModel.findOneAndUpdate(
                    { userId },
                    { $set: { addresses: userDetails.addresses } },
                    { returnDocument: "after" }
                );

                const newAddressId =
                    result.addresses[result.addresses.length - 1].id;
                console.log("address added", address);

                return res.status(200).json(
                    generateCommonResponse(2015, true, {
                        addressId: newAddressId,
                    })
                );
            }
        } catch (e) {
            console.log("error occured while adding address", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const updateAddress = async (req, res) => {
        const { userId, addressId, ...rest } = req.body;

        try {
            const found = await UserModel.findOne({ userId });

            if (found) {
                console.log("user details found", found);
                const userDetails = found;

                const addressIndex = userDetails.addresses.findIndex(
                    (address) => address.id === addressId
                );

                if (addressIndex === -1) {
                    console.log("address not found while deleting");
                    return res.status(400).json(generateCommonResponse(4017));
                } else {
                    Object.entries(rest).forEach(([key, value]) => {
                        userDetails.addresses[addressIndex][key] = value;
                    });
                }

                await UserModel.findOneAndUpdate(
                    { userId },
                    { $set: { addresses: userDetails.addresses } }
                );

                console.log("address updated");
                return res.status(200).json(generateCommonResponse(2016, true));
            }
        } catch (e) {
            console.log("error occured while adding address", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const deleteAddress = async (req, res) => {
        const { userId, addressId } = req.query;

        try {
            const found = await UserModel.findOne({ userId });

            if (found) {
                console.log("user details found", found);
                const userDetails = found;

                const addressIndex = userDetails.addresses.findIndex(
                    (address) => address.id === addressId
                );

                if (addressIndex === -1) {
                    console.log("address not found while deleting");
                    return res.status(400).json(generateCommonResponse(4017));
                } else {
                    const addresses = userDetails.addresses;
                    addresses.splice(addressIndex, 1);

                    await UserModel.findOneAndUpdate(
                        { userId },
                        { $set: { addresses } }
                    );

                    console.log("address deleted for addressId -> ", addressId);
                    return res
                        .status(200)
                        .json(generateCommonResponse(2017, true));
                }
            }
        } catch (e) {
            console.log("error occured while deleting address", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    return {
        getProfile,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
    };
};

module.exports = UserControllers;
