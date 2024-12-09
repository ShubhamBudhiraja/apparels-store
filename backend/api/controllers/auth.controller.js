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
exports.AuthControllers = void 0;
const nodemailer_1 = require("../config/nodemailer");
const common_1 = require("../constants/common");
const responseMessages_1 = require("../constants/responseMessages");
const auth_1 = require("../lib/utils/auth");
const common_2 = require("../lib/utils/common");
const auth_model_1 = require("../models/auth.model");
const user_model_1 = require("../models/user.model");
const AuthControllers = () => {
    const { genrateOtp } = (0, auth_1.authUtils)();
    const removeTempUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const founduser = yield auth_model_1.AuthModel.findOne({ userId });
        if (!(founduser === null || founduser === void 0 ? void 0 : founduser.isVerified)) {
            console.log("otp wasn't verified for ", userId);
            yield auth_model_1.AuthModel.deleteOne({ userId });
        }
    });
    const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, password } = req.body;
        try {
            if (userId && password) {
                const otp = genrateOtp();
                const isExistingUser = yield auth_model_1.AuthModel.findOneAndUpdate({ userId }, { $set: { otp } });
                if (isExistingUser) {
                    console.log("user already exists in db", isExistingUser);
                    if (isExistingUser.isVerified) {
                        console.log("found user is already registered");
                        return res
                            .status(400)
                            .json((0, common_2.generateCommonResponse)(4001));
                    }
                    else {
                        yield (0, nodemailer_1.sendEmailOtp)(userId, otp);
                        console.log("OTP sent to email");
                        return res
                            .status(200)
                            .json((0, common_2.generateCommonResponse)(2001, true));
                    }
                }
                else {
                    console.log("registering new user");
                    yield auth_model_1.AuthModel.create({ userId, password, otp });
                    console.log("new user added in db");
                    yield (0, nodemailer_1.sendEmailOtp)(userId, otp);
                    console.log("OTP sent to email");
                    setTimeout(() => {
                        removeTempUser(userId);
                    }, 60000);
                    return res
                        .status(200)
                        .json((0, common_2.generateCommonResponse)(2001, true));
                }
            }
            else {
                return res.status(400).json((0, common_2.generateCommonResponse)(4000));
            }
        }
        catch (e) {
            console.log("error occured while registering", e);
            return res.status(500).json((0, common_2.generateCommonResponse)(5000));
        }
    });
    const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, password } = req.body;
        try {
            const foundUser = yield auth_model_1.AuthModel.findOne({ userId });
            if (foundUser) {
                console.log("user found while logging in", foundUser);
                if (foundUser.password === password) {
                    console.log("correct password");
                    return res
                        .status(200)
                        .json((0, common_2.generateCommonResponse)(2003, true));
                }
                else {
                    console.log("invalid password");
                    return res.status(400).json((0, common_2.generateCommonResponse)(4003));
                }
            }
            else {
                console.log("invalid email");
                return res.status(400).json((0, common_2.generateCommonResponse)(4004));
            }
        }
        catch (e) {
            console.log("error occured while logging in", e);
            return res.status(500).json((0, common_2.generateCommonResponse)(5000));
        }
    });
    const validateOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, otp, screenType } = req.body;
        try {
            const foundUser = yield auth_model_1.AuthModel.findOneAndUpdate({ userId, otp }, { $set: { isVerified: true } });
            console.log("user found while validating otp", foundUser);
            if (foundUser) {
                if (screenType === common_1.FLOW_TYPE.REGISTER) {
                    console.log("creating profile while registering");
                    yield user_model_1.UserModel.create({ userId });
                    console.log("profile created");
                }
                return res.status(200).json((0, common_2.generateCommonResponse)(2002, true));
            }
            else {
                console.log("invalid otp");
                return res.status(400).json((0, common_2.generateCommonResponse)(4002));
            }
        }
        catch (e) {
            console.log("error occured while validating otp", e);
            return res.status(500).json((0, common_2.generateCommonResponse)(5000));
        }
    });
    const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { userId } = req.body;
        try {
            const otp = genrateOtp();
            const isExistingUser = yield auth_model_1.AuthModel.findOneAndUpdate({ userId }, { $set: { otp } });
            if (isExistingUser) {
                console.log("existing user found during forgot password", isExistingUser);
                yield (0, nodemailer_1.sendEmailOtp)(userId, otp);
                console.log("OTP sent to email");
                return res.status(200).json((0, common_2.generateCommonResponse)(2001, true));
            }
            else {
                return res.status(400).json((0, common_2.generateCommonResponse)(4004));
            }
        }
        catch (e) {
            console.log("error occured during forgot otp", e);
            return res.status(500).json({
                status: false,
                message: ((_a = e === null || e === void 0 ? void 0 : e.errorResponse) === null || _a === void 0 ? void 0 : _a.errmsg) || responseMessages_1.RESPONSE_MESSAGES[5001],
            });
        }
    });
    const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, password } = req.body;
        try {
            const foundUser = yield auth_model_1.AuthModel.findOneAndUpdate({ userId }, { $set: { password } });
            if (foundUser) {
                console.log("user found to update password", foundUser);
                return res.status(200).json((0, common_2.generateCommonResponse)(2004, true));
            }
            else {
                console.log("invalid email");
                return res.status(400).json((0, common_2.generateCommonResponse)(4004));
            }
        }
        catch (e) {
            console.log("error occured while updating password", e);
            return res.status(500).json((0, common_2.generateCommonResponse)(5000));
        }
    });
    return {
        register,
        login,
        validateOtp,
        forgotPassword,
        updatePassword,
    };
};
exports.AuthControllers = AuthControllers;
//# sourceMappingURL=auth.controller.js.map