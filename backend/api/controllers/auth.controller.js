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
exports.AuthControllers = void 0;
const nodemailer_1 = require("../config/nodemailer");
const common_1 = require("../constants/common");
const responseMessages_1 = require("../constants/responseMessages");
const auth_1 = require("../lib/utils/auth");
const common_2 = require("../lib/utils/common");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_1 = require("../lib/utils/token");
const prisma_1 = __importDefault(require("../config/prisma"));
const user_1 = require("../lib/utils/user");
const OTP_TTL_MS = 1000 * 60 * 5;
const SALT_ROUNDS = 10;
const AuthControllers = () => {
    const { genrateOtp } = (0, auth_1.authUtils)();
    const removeTempUser = (emailId) => __awaiter(void 0, void 0, void 0, function* () {
        const foundUser = yield prisma_1.default.user.findUnique({
            where: { emailId },
        });
        if (foundUser && !foundUser.isVerified) {
            console.log("otp wasn't verified for ", emailId);
            yield prisma_1.default.user.delete({ where: { id: foundUser.id } });
        }
    });
    const cleanupExpiredOtp = (emailId, otpId) => __awaiter(void 0, void 0, void 0, function* () {
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const otpRecord = yield prisma_1.default.verificationOtp.findUnique({
                    where: { id: otpId },
                });
                if (!otpRecord)
                    return;
                if (otpRecord.expiresAt <= new Date()) {
                    yield prisma_1.default.verificationOtp.delete({
                        where: { id: otpId },
                    });
                    yield removeTempUser(emailId);
                }
            }
            catch (error) {
                console.log("error cleaning up expired otp", error);
            }
        }), OTP_TTL_MS);
    });
    const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.body);
        const { password } = req.body;
        try {
            if (emailId && password) {
                const otp = genrateOtp(6);
                const isExistingUser = yield prisma_1.default.user.findUnique({
                    where: { emailId },
                });
                if (isExistingUser === null || isExistingUser === void 0 ? void 0 : isExistingUser.isVerified) {
                    console.log("user already exists in db", isExistingUser);
                    return res.status(400).json((0, common_2.generateCommonResponse)(4001));
                }
                if (isExistingUser && !isExistingUser.isVerified) {
                    yield prisma_1.default.user.delete({
                        where: { id: isExistingUser.id },
                    });
                }
                console.log("registering new user");
                const hashedPassword = yield bcryptjs_1.default.hash(password, SALT_ROUNDS);
                const expiresAt = new Date(Date.now() + OTP_TTL_MS);
                const verificationOtp = yield prisma_1.default.verificationOtp.upsert({
                    where: { emailId },
                    update: { otp, expiresAt },
                    create: { emailId, otp, expiresAt },
                });
                yield prisma_1.default.user.create({
                    data: {
                        emailId,
                        password: hashedPassword,
                    },
                });
                console.log("new user added in db");
                yield (0, nodemailer_1.sendEmailOtp)(emailId, otp);
                console.log("OTP sent to email");
                cleanupExpiredOtp(emailId, verificationOtp.id);
                return res.status(200).json((0, common_2.generateCommonResponse)(2001, true));
            }
            return res.status(401).json((0, common_2.generateCommonResponse)(4000));
        }
        catch (e) {
            console.log("error occured while registering", e);
            return res.status(500).json((0, common_2.generateCommonResponse)(5000));
        }
    });
    const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.body);
        const { password } = req.body;
        try {
            if (!emailId || !password) {
                return res.status(401).json((0, common_2.generateCommonResponse)(4000));
            }
            const foundUser = yield prisma_1.default.user.findUnique({
                where: { emailId },
            });
            if (!foundUser) {
                console.log("invalid userId");
                return res.status(200).json((0, common_2.generateCommonResponse)(4004));
            }
            if (!foundUser.isVerified) {
                console.log("unverified user attempted login");
                return res.status(200).json((0, common_2.generateCommonResponse)(4004));
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, foundUser.password);
            if (!isPasswordValid) {
                console.log("invalid password");
                return res.status(200).json((0, common_2.generateCommonResponse)(4003));
            }
            console.log("correct password");
            const token = (0, token_1.generateAccessToken)(foundUser.id);
            return res
                .status(200)
                .json((0, common_2.generateCommonResponse)(2003, true, { token }));
        }
        catch (e) {
            console.log("error occured while logging in", e);
            return res.status(500).json((0, common_2.generateCommonResponse)(5000));
        }
    });
    const validateOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const emailId = (0, user_1.resolveEmailId)(req.body);
        const { otp, screenType } = req.body;
        try {
            if (!emailId || !otp) {
                return res.status(401).json((0, common_2.generateCommonResponse)(4000));
            }
            const foundOtp = yield prisma_1.default.verificationOtp.findUnique({
                where: { emailId },
            });
            if (!foundOtp) {
                console.log("invalid userId");
                return res.status(200).json((0, common_2.generateCommonResponse)(4004));
            }
            if (foundOtp.expiresAt <= new Date()) {
                yield prisma_1.default.verificationOtp.delete({
                    where: { id: foundOtp.id },
                });
                console.log("otp expired");
                return res.status(200).json((0, common_2.generateCommonResponse)(4002));
            }
            if (foundOtp.otp !== otp) {
                console.log("invalid otp");
                return res.status(200).json((0, common_2.generateCommonResponse)(4002));
            }
            if (screenType === common_1.FLOW_TYPE.REGISTER) {
                console.log("creating profile while registering");
                yield prisma_1.default.user.update({
                    where: { emailId },
                    data: { isVerified: true },
                });
                console.log("user verified");
            }
            yield prisma_1.default.verificationOtp.delete({
                where: { id: foundOtp.id },
            });
            return res.status(200).json((0, common_2.generateCommonResponse)(2002, true));
        }
        catch (e) {
            console.log("error occured while validating otp", e);
            return res.status(500).json((0, common_2.generateCommonResponse)(5000));
        }
    });
    const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const emailId = (0, user_1.resolveEmailId)(req.body);
        try {
            if (!emailId) {
                return res.status(401).json((0, common_2.generateCommonResponse)(4000));
            }
            const user = yield prisma_1.default.user.findUnique({
                where: { emailId },
            });
            if (!user || !user.isVerified) {
                console.log("user not found during forgot password");
                return res.status(200).json((0, common_2.generateCommonResponse)(4004));
            }
            const otp = genrateOtp(6);
            const expiresAt = new Date(Date.now() + OTP_TTL_MS);
            const verificationOtp = yield prisma_1.default.verificationOtp.upsert({
                where: { emailId },
                update: { otp, expiresAt },
                create: { emailId, otp, expiresAt },
            });
            console.log("verification otp upserted during forgot password", verificationOtp);
            yield (0, nodemailer_1.sendEmailOtp)(emailId, otp);
            console.log("OTP sent to email");
            cleanupExpiredOtp(emailId, verificationOtp.id);
            return res.status(200).json((0, common_2.generateCommonResponse)(2001, true));
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
        const emailId = (0, user_1.resolveEmailId)(req.body);
        const { password } = req.body;
        try {
            if (!emailId || !password) {
                return res.status(401).json((0, common_2.generateCommonResponse)(4000));
            }
            const existingUser = yield prisma_1.default.user.findUnique({
                where: { emailId },
            });
            if (!existingUser) {
                console.log("invalid email");
                return res.status(200).json((0, common_2.generateCommonResponse)(4004));
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, SALT_ROUNDS);
            yield prisma_1.default.user.update({
                where: { emailId },
                data: { password: hashedPassword },
            });
            console.log("password updated for user", emailId);
            return res.status(200).json((0, common_2.generateCommonResponse)(2004, true));
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