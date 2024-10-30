const sendEmailOtp = require("../config/nodemailer");
const GLOBAL_CONSTANTS = require("../constants/common");
const RESPONSE_MESSAGES = require("../constants/responseMessages");
const AuthModel = require("../models/auth.model");
const UserModel = require("../models/user.model");
const authUtils = require("../utils/auth");
const commonUtils = require("../utils/common");

const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (email && password) {
            const otp = authUtils.getOtp();
            const isExistingUser = await AuthModel.findOneAndUpdate(
                { email },
                { $set: { otp } }
            );

            if (isExistingUser) {
                console.log("user already exists in db", isExistingUser);

                if (isExistingUser.isVerified) {
                    console.log("found user is already registered");
                    return res
                        .status(400)
                        .json(commonUtils.generateCommonResponse(4001));
                } else {
                    await sendEmailOtp(email, otp);
                    console.log("OTP sent to email");

                    return res
                        .status(200)
                        .json(commonUtils.generateCommonResponse(true, 2001, { otp }));
                }
            } else {
                console.log("registering new user");

                await AuthModel.create({ email, password, otp });
                console.log("new user added in db");

                await sendEmailOtp(email, otp);
                console.log("OTP sent to email");

                return res
                    .status(200)
                    .json(commonUtils.generateCommonResponse(2001, true, { otp }));
            }
        } else {
            return res
                .status(400)
                .json(commonUtils.generateCommonResponse(true, 4000));
        }
    } catch (e) {
        console.log("error occured while registering", e);
        return res.status(500).json(commonUtils.generateCommonResponse(5000));
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const foundUser = await AuthModel.findOne({ email, password });

        if (foundUser) {
            console.log("user found while logging in", foundUser);
            return res
                .status(200)
                .json(commonUtils.generateCommonResponse(2003, true));
        } else {
            console.log("invalid email or password");
            return res.status(400).json(commonUtils.generateCommonResponse(4003));
        }
    } catch (e) {
        console.log("error occured while logging in");
        return res.status(500).json(commonUtils.generateCommonResponse(5000));
    }
};

const validateOtp = async (req, res) => {
    const { email, otp, screenType } = req.body;

    try {
        const foundUser = await AuthModel.findOneAndUpdate(
            { email, otp },
            { $set: { isVerified: true } }
        );
        console.log("user found while validating otp", foundUser);

        if (foundUser) {
            if (screenType === GLOBAL_CONSTANTS.FLOW_TYPE.REGISTER) {
                console.log("creating profile while registering");

                await UserModel.create({ email });
                console.log("profile created");
            }
            return res
                .status(200)
                .json(commonUtils.generateCommonResponse(2002, true));
        } else {
            console.log("invalid otp");
            return res.status(400).json(commonUtils.generateCommonResponse(4002));
        }
    } catch (e) {
        console.log("error occured while validating otp");
        return res.status(500).json(commonUtils.generateCommonResponse(5000));
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const otp = authUtils.getOtp();
        const isExistingUser = await AuthModel.findOneAndUpdate(
            { email },
            { $set: { otp } }
        );

        if (isExistingUser) {
            console.log("existing user found during forgot password", isExistingUser);

            await sendEmailOtp(email, otp);
            console.log("OTP sent to email");

            return res
                .status(200)
                .json(commonUtils.generateCommonResponse(2001, true, { otp }));
        } else {
            return res.status(400).json(commonUtils.generateCommonResponse(4000));
        }
    } catch (e) {
        console.log(e, "error");
        return res.status(500).json({
            status: false,
            message: e?.errorResponse?.errmsg || RESPONSE_MESSAGES[5001],
        });
    }
};

const updatePassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const foundUser = await AuthModel.findOneAndUpdate(
            { email },
            { $set: { password } }
        );
        if (foundUser) {
            console.log("user found to update password", foundUser);
            return res
                .status(200)
                .json(commonUtils.generateCommonResponse(2004, true));
        } else {
            console.log("invalid email");
            return res.status(400).json(commonUtils.generateCommonResponse(4004));
        }
    } catch (e) {
        console.log("error occured while updating password");
        return res.status(500).json(commonUtils.generateCommonResponse(5000));
    }
};

const authControllers = {
    register,
    login,
    validateOtp,
    forgotPassword,
    updatePassword,
};

module.exports = authControllers;
