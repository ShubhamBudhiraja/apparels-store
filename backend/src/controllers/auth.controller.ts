import { sendEmailOtp } from "../config/nodemailer";
import { FLOW_TYPE } from "../constants/common";
import { RESPONSE_MESSAGES } from "../constants/responseMessages";
import { authUtils } from "../lib/utils/auth";
import { generateCommonResponse } from "../lib/utils/common";
import { AuthModel } from "../models/auth.model";
import { UserModel } from "../models/user.model";

export const AuthControllers = () => {
    const { genrateOtp } = authUtils();

    const removeTempUser = async (userId: string) => {
        const founduser = await AuthModel.findOne({ userId });

        if (!founduser?.isVerified) {
            console.log("otp wasn't verified for ", userId);
            await AuthModel.deleteOne({ userId });
        }
    };

    const register = async (req: any, res: any) => {
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
                return res.status(200).json(generateCommonResponse(4000));
            }
        } catch (e: any) {
            console.log("error occured while registering", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const login = async (req: any, res: any) => {
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
                    return res.status(200).json(generateCommonResponse(4003));
                }
            } else {
                console.log("invalid email");
                return res.status(200).json(generateCommonResponse(4004));
            }
        } catch (e: any) {
            console.log("error occured while logging in", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const validateOtp = async (req: any, res: any) => {
        const { userId, otp, screenType } = req.body;

        try {
            const foundUser = await AuthModel.findOneAndUpdate(
                { userId, otp },
                { $set: { isVerified: true } }
            );
            console.log("user found while validating otp", foundUser);

            if (foundUser) {
                if (screenType === FLOW_TYPE.REGISTER) {
                    console.log("creating profile while registering");

                    await UserModel.create({ userId });
                    console.log("profile created");
                }
                return res.status(200).json(generateCommonResponse(2002, true));
            } else {
                console.log("invalid otp");
                return res.status(200).json(generateCommonResponse(4002));
            }
        } catch (e: any) {
            console.log("error occured while validating otp", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const forgotPassword = async (req: any, res: any) => {
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
                return res.status(200).json(generateCommonResponse(4004));
            }
        } catch (e: any) {
            console.log("error occured during forgot otp", e);
            return res.status(500).json({
                status: false,
                message: e?.errorResponse?.errmsg || RESPONSE_MESSAGES[5001],
            });
        }
    };

    const updatePassword = async (req: any, res: any) => {
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
                return res.status(200).json(generateCommonResponse(4004));
            }
        } catch (e: any) {
            console.log("error occured while updating password", e);
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
