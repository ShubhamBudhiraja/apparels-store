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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const common_1 = require("../lib/utils/common");
const user_1 = require("../lib/utils/user");
const prisma_1 = __importDefault(require("../config/prisma"));
const UserControllers = () => {
    const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.query);
        try {
            if (!emailId) {
                return res.status(401).json((0, common_1.generateCommonResponse)(4000));
            }
            const found = yield (0, user_1.findUserByEmail)(emailId);
            if (found) {
                console.log("get profile - user details found");
                const profile = yield (0, user_1.buildProfileResponse)(found);
                return res
                    .status(200)
                    .json((0, common_1.generateCommonResponse)(2006, true, profile));
            }
            console.log("get profile - user not found");
            return res.status(200).json((0, common_1.generateCommonResponse)(4004));
        }
        catch (e) {
            console.log("error occured while getting profile", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.body);
        const { firstName, lastName, mobileNo, dob, dateOfBirth } = req.body;
        try {
            if (!emailId) {
                return res.status(401).json((0, common_1.generateCommonResponse)(4000));
            }
            const existingUser = yield prisma_1.default.user.findUnique({
                where: { emailId },
            });
            if (!existingUser) {
                console.log("updateProfile user not found");
                return res.status(200).json((0, common_1.generateCommonResponse)(4004));
            }
            yield prisma_1.default.user.update({
                where: { emailId },
                data: Object.assign(Object.assign(Object.assign(Object.assign({}, (firstName !== undefined && { firstName })), (lastName !== undefined && { lastName })), (mobileNo !== undefined && { mobileNo })), ((dob || dateOfBirth) !== undefined && {
                    dateOfBirth: dob || dateOfBirth,
                })),
            });
            console.log("updateProfile user found");
            return res.status(200).json((0, common_1.generateCommonResponse)(2005, true));
        }
        catch (e) {
            console.log("error occured while updating profile", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.body);
        const { address } = req.body;
        try {
            if (!emailId || !address) {
                return res.status(401).json((0, common_1.generateCommonResponse)(4000));
            }
            const found = yield prisma_1.default.user.findUnique({
                where: { emailId },
            });
            if (!found) {
                console.log("user not found while adding address");
                return res.status(200).json((0, common_1.generateCommonResponse)(4004));
            }
            const createdAddress = yield prisma_1.default.address.create({
                data: {
                    userId: found.id,
                    firstName: address.firstName,
                    lastName: address.lastName,
                    mobileNo: address.mobileNo,
                    houseNo: address.houseNo,
                    streetAddress: address.streetAddress,
                    city: address.city,
                    pincode: address.pincode,
                    state: address.state,
                    isDefault: Boolean(address.isDefault),
                },
            });
            console.log("address added", (0, user_1.formatAddress)(createdAddress));
            return res.status(200).json((0, common_1.generateCommonResponse)(2015, true, {
                addressId: createdAddress.id,
            }));
        }
        catch (e) {
            console.log("error occured while adding address", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const updateAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.body);
        const _a = req.body, { addressId } = _a, rest = __rest(_a, ["addressId"]);
        try {
            if (!emailId || !addressId) {
                return res.status(401).json((0, common_1.generateCommonResponse)(4000));
            }
            const found = yield prisma_1.default.user.findUnique({
                where: { emailId },
            });
            if (!found) {
                console.log("user not found while updating address");
                return res.status(200).json((0, common_1.generateCommonResponse)(4004));
            }
            const existingAddress = yield prisma_1.default.address.findFirst({
                where: { id: addressId, userId: found.id },
            });
            if (!existingAddress) {
                console.log("address not found while updating");
                return res.status(200).json((0, common_1.generateCommonResponse)(4017));
            }
            const { firstName, lastName, mobileNo, houseNo, streetAddress, city, pincode, state, isDefault, } = rest;
            yield prisma_1.default.address.update({
                where: { id: addressId },
                data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (firstName !== undefined && { firstName })), (lastName !== undefined && { lastName })), (mobileNo !== undefined && { mobileNo })), (houseNo !== undefined && { houseNo })), (streetAddress !== undefined && { streetAddress })), (city !== undefined && { city })), (pincode !== undefined && { pincode })), (state !== undefined && { state })), (isDefault !== undefined && { isDefault })),
            });
            console.log("address updated");
            return res.status(200).json((0, common_1.generateCommonResponse)(2016, true));
        }
        catch (e) {
            console.log("error occured while updating address", e);
            return res.status(500).json((0, common_1.generateCommonResponse)(5000));
        }
    });
    const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.query);
        const { addressId } = req.query;
        try {
            if (!emailId || !addressId) {
                return res.status(401).json((0, common_1.generateCommonResponse)(4000));
            }
            const found = yield prisma_1.default.user.findUnique({
                where: { emailId },
            });
            if (!found) {
                console.log("user not found while deleting address");
                return res.status(200).json((0, common_1.generateCommonResponse)(4004));
            }
            const existingAddress = yield prisma_1.default.address.findFirst({
                where: { id: addressId, userId: found.id },
            });
            if (!existingAddress) {
                console.log("address not found while deleting");
                return res.status(200).json((0, common_1.generateCommonResponse)(4017));
            }
            yield prisma_1.default.address.delete({ where: { id: addressId } });
            console.log("address deleted for addressId -> ", addressId);
            return res.status(200).json((0, common_1.generateCommonResponse)(2017, true));
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