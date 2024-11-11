const sendEmailOtp = require("../config/nodemailer");
const GLOBAL_CONSTANTS = require("../constants/common");
const RESPONSE_MESSAGES = require("../constants/responseMessages");
const AuthModel = require("../models/auth.model");
const UserModel = require("../models/user.model");
const authUtils = require("../utils/auth");
const commonUtils = require("../utils/common");

const AuthControllers = () => {
    const { genrateOtp } = authUtils();
    const { generateCommonResponse } = commonUtils();

    const removeTempUser = async (userId) => {
        const founduser = await AuthModel.findOne({ userId });

        if (!founduser.isVerified) {
            console.log("otp wasn't verified for ", userId);
            await AuthModel.deleteOne({ userId });
        }
    };

    const register = async (req, res) => {
        const { userId, password } = req.body;

        try {
            if (userId && password) {
                const otp = genrateOtp();
                const isExistingUser = await AuthModel.findOneAndUpdate(
                    { userId },
                    { $set: { otp } }
                );

                if (isExistingUser) {
                    console.log("user already exists in db", isExistingUser);

                    if (isExistingUser.isVerified) {
                        console.log("found user is already registered");
                        return res
                            .status(400)
                            .json(generateCommonResponse(4001));
                    } else {
                        await sendEmailOtp(userId, otp);
                        console.log("OTP sent to email");

                        return res
                            .status(200)
                            .json(generateCommonResponse(2001, true));
                    }
                } else {
                    console.log("registering new user");

                    await AuthModel.create({ userId, password, otp });
                    console.log("new user added in db");

                    await sendEmailOtp(userId, otp);
                    console.log("OTP sent to email");

                    setTimeout(() => {
                        removeTempUser(userId);
                    }, 60000);

                    return res
                        .status(200)
                        .json(generateCommonResponse(2001, true));
                }
            } else {
                return res.status(400).json(generateCommonResponse(4000));
            }
        } catch (e) {
            console.log("error occured while registering", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const login = async (req, res) => {
        const { userId, password } = req.body;

        try {
            const foundUser = await AuthModel.findOne({ userId });

            if (foundUser) {
                console.log("user found while logging in", foundUser);

                if (foundUser.password === password) {
                    console.log("correct password");
                    return res
                        .status(200)
                        .json(generateCommonResponse(2003, true));
                } else {
                    console.log("invalid password");
                    return res.status(400).json(generateCommonResponse(4003));
                }
            } else {
                console.log("invalid email");
                return res.status(400).json(generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while logging in");
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const validateOtp = async (req, res) => {
        const { userId, otp, screenType } = req.body;

        try {
            const foundUser = await AuthModel.findOneAndUpdate(
                { userId, otp },
                { $set: { isVerified: true } }
            );
            console.log("user found while validating otp", foundUser);

            if (foundUser) {
                if (screenType === GLOBAL_CONSTANTS.FLOW_TYPE.REGISTER) {
                    console.log("creating profile while registering");

                    await UserModel.create({ userId });
                    console.log("profile created");
                }
                return res.status(200).json(generateCommonResponse(2002, true));
            } else {
                console.log("invalid otp");
                return res.status(400).json(generateCommonResponse(4002));
            }
        } catch (e) {
            console.log("error occured while validating otp");
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const forgotPassword = async (req, res) => {
        const { userId } = req.body;

        try {
            const otp = genrateOtp();
            const isExistingUser = await AuthModel.findOneAndUpdate(
                { userId },
                { $set: { otp } }
            );

            if (isExistingUser) {
                console.log(
                    "existing user found during forgot password",
                    isExistingUser
                );

                await sendEmailOtp(userId, otp);
                console.log("OTP sent to email");

                return res.status(200).json(generateCommonResponse(2001, true));
            } else {
                return res.status(400).json(generateCommonResponse(4004));
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
        const { userId, password } = req.body;

        try {
            const foundUser = await AuthModel.findOneAndUpdate(
                { userId },
                { $set: { password } }
            );
            if (foundUser) {
                console.log("user found to update password", foundUser);
                return res.status(200).json(generateCommonResponse(2004, true));
            } else {
                console.log("invalid email");
                return res.status(400).json(generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while updating password");
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    return {
        register,
        login,
        validateOtp,
        forgotPassword,
        updatePassword,
    };
};

module.exports = AuthControllers;
