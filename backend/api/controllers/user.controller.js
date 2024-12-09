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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const common_1 = require("../lib/utils/common");
const product_model_1 = require("../models/product.model");
const user_model_1 = require("../models/user.model");
const UserControllers = () => {
    const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.query;
        try {
            const found = yield user_model_1.UserModel.findOne({ userId });
            console.log(found, "jhvgh", userId);
            if (found) {
                console.log("get profile - user details found", found);
                const cart = found.get("cart");
                if (found.cart.products.length) {
                    const products = yield product_model_1.ProductModel.find();
                    if (found.cart.products.length)
                        cart.products = cart.products.map((prod) => {
                            const temp = prod;
                            const foundProduct = products.find((item) => item.productId === prod.productId);
                            const vars = foundProduct === null || foundProduct === void 0 ? void 0 : foundProduct.get("variants");
                            const availableUnits = (vars === null || vars === void 0 ? void 0 : vars.find((item) => item.id === prod.selectedVariant).units) || 0;
                            temp.isAvailable = availableUnits > 0;
                            return temp;
                        });
                }
                found.set("cart", cart);
                return res
                    .status(200)
                    .json((0, common_1.generateCommonResponse)(2006, true, found));
            }
            else {
                console.log("get profile - user not found");
                return res.status(400).json((0, common_1.generateCommonResponse)(4004));
            }
        }
        catch (e) {
            console.log("error occured while getting profile", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const _a = req.body, { userId } = _a, rest = __rest(_a, ["userId"]);
        delete rest.cart;
        delete rest.wishlist;
        delete rest.addresses;
        try {
            const found = yield user_model_1.UserModel.findOneAndUpdate({ userId }, { $set: rest });
            if (found) {
                console.log("updateProfile user found", found);
                return res.status(200).json((0, common_1.generateCommonResponse)(2005, true));
            }
            else {
                console.log("updateProfile user not found");
                return res.status(400).json((0, common_1.generateCommonResponse)(4004));
            }
        }
        catch (e) {
            console.log("error occured while updating profile", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, address } = req.body;
        try {
            const found = yield user_model_1.UserModel.findOne({ userId });
            if (found) {
                console.log("user details found", found);
                const userDetails = found;
                userDetails.addresses.push(address);
                const result = yield user_model_1.UserModel.findOneAndUpdate({ userId }, { $set: { addresses: userDetails.addresses } }, { returnDocument: "after" });
                const newAddressId = result === null || result === void 0 ? void 0 : result.addresses[result.addresses.length - 1].id;
                console.log("address added", address);
                return res.status(200).json((0, common_1.generateCommonResponse)(2015, true, {
                    addressId: newAddressId,
                }));
            }
        }
        catch (e) {
            console.log("error occured while adding address", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const updateAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const _a = req.body, { userId, addressId } = _a, rest = __rest(_a, ["userId", "addressId"]);
        try {
            const found = yield user_model_1.UserModel.findOne({ userId });
            if (found) {
                console.log("user details found", found);
                const addresses = found.get("addresses");
                const addressIndex = found.addresses.findIndex((address) => address.id === addressId);
                if (addressIndex === -1) {
                    console.log("address not found while deleting");
                    return res.status(400).json((0, common_1.generateCommonResponse)(4017));
                }
                else {
                    Object.entries(rest).forEach(([key, value]) => {
                        addresses[addressIndex][key] = value;
                    });
                }
                yield user_model_1.UserModel.findOneAndUpdate({ userId }, { $set: { addresses } });
                console.log("address updated");
                return res.status(200).json((0, common_1.generateCommonResponse)(2016, true));
            }
        }
        catch (e) {
            console.log("error occured while adding address", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, addressId } = req.query;
        try {
            const found = yield user_model_1.UserModel.findOne({ userId });
            if (found) {
                console.log("user details found", found);
                const userDetails = found;
                const addressIndex = userDetails.addresses.findIndex((address) => address.id === addressId);
                if (addressIndex === -1) {
                    console.log("address not found while deleting");
                    return res.status(400).json((0, common_1.generateCommonResponse)(4017));
                }
                else {
                    const addresses = userDetails.addresses;
                    addresses.splice(addressIndex, 1);
                    yield user_model_1.UserModel.findOneAndUpdate({ userId }, { $set: { addresses } });
                    console.log("address deleted for addressId -> ", addressId);
                    return res
                        .status(200)
                        .json((0, common_1.generateCommonResponse)(2017, true));
                }
            }
        }
        catch (e) {
            console.log("error occured while deleting address", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    return {
        getProfile,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
    };
};
exports.UserControllers = UserControllers;
//# sourceMappingURL=user.controller.js.map