import { sendEmailOtp } from "../config/nodemailer";
import { FLOW_TYPE } from "../constants/common";
import { RESPONSE_MESSAGES } from "../constants/responseMessages";
import { authUtils } from "../lib/utils/auth";
import { generateCommonResponse } from "../lib/utils/common";
import bcrypt from "bcryptjs";
import { IValidateOtp } from "../types/auth";
import { Request } from "express";
import { generateAccessToken } from "../lib/utils/token";
import prisma from "../config/prisma";
import { resolveEmailId } from "../lib/utils/user";

const OTP_TTL_MS = 1000 * 60 * 5;
const SALT_ROUNDS = 10;

export const AuthControllers = () => {
    const { genrateOtp } = authUtils();

    const removeTempUser = async (emailId: string) => {
        const foundUser = await prisma.user.findUnique({
            where: { emailId },
        });

        if (foundUser && !foundUser.isVerified) {
            console.log("otp wasn't verified for ", emailId);
            await prisma.user.delete({ where: { id: foundUser.id } });
        }
    };

    const cleanupExpiredOtp = async (emailId: string, otpId: string) => {
        setTimeout(async () => {
            try {
                const otpRecord = await prisma.verificationOtp.findUnique({
                    where: { id: otpId },
                });

                if (!otpRecord) return;

                if (otpRecord.expiresAt <= new Date()) {
                    await prisma.verificationOtp.delete({
                        where: { id: otpId },
                    });
                    await removeTempUser(emailId);
                }
            } catch (error) {
                console.log("error cleaning up expired otp", error);
            }
        }, OTP_TTL_MS);
    };

    const register = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.body);
        const { password } = req.body;

        try {
            if (emailId && password) {
                const otp = genrateOtp(6);
                const isExistingUser = await prisma.user.findUnique({
                    where: { emailId },
                });

                if (isExistingUser?.isVerified) {
                    console.log("user already exists in db", isExistingUser);
                    return res.status(400).json(generateCommonResponse(4001));
                }

                if (isExistingUser && !isExistingUser.isVerified) {
                    await prisma.user.delete({
                        where: { id: isExistingUser.id },
                    });
                }

                console.log("registering new user");
                const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
                const expiresAt = new Date(Date.now() + OTP_TTL_MS);

                const verificationOtp = await prisma.verificationOtp.upsert({
                    where: { emailId },
                    update: { otp, expiresAt },
                    create: { emailId, otp, expiresAt },
                });

                await prisma.user.create({
                    data: {
                        emailId,
                        password: hashedPassword,
                    },
                });
                console.log("new user added in db");

                await sendEmailOtp(emailId, otp);
                console.log("OTP sent to email");

                cleanupExpiredOtp(emailId, verificationOtp.id);

                return res.status(200).json(generateCommonResponse(2001, true));
            }

            return res.status(401).json(generateCommonResponse(4000));
        } catch (e: any) {
            console.log("error occured while registering", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const login = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.body);
        const { password } = req.body;

        try {
            if (!emailId || !password) {
                return res.status(401).json(generateCommonResponse(4000));
            }

            const foundUser = await prisma.user.findUnique({
                where: { emailId },
            });

            if (!foundUser) {
                console.log("invalid userId");
                return res.status(200).json(generateCommonResponse(4004));
            }

            if (!foundUser.isVerified) {
                console.log("unverified user attempted login");
                return res.status(200).json(generateCommonResponse(4004));
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                foundUser.password,
            );

            if (!isPasswordValid) {
                console.log("invalid password");
                return res.status(200).json(generateCommonResponse(4003));
            }

            console.log("correct password");
            const token = generateAccessToken(foundUser.id);

            return res
                .status(200)
                .json(generateCommonResponse(2003, true, { token }));
        } catch (e: any) {
            console.log("error occured while logging in", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const validateOtp = async (req: Request<IValidateOtp>, res: any) => {
        const emailId = resolveEmailId(req.body);
        const { otp, screenType } = req.body;

        try {
            if (!emailId || !otp) {
                return res.status(401).json(generateCommonResponse(4000));
            }

            const foundOtp = await prisma.verificationOtp.findUnique({
                where: { emailId },
            });

            if (!foundOtp) {
                console.log("invalid userId");
                return res.status(200).json(generateCommonResponse(4004));
            }

            if (foundOtp.expiresAt <= new Date()) {
                await prisma.verificationOtp.delete({
                    where: { id: foundOtp.id },
                });
                console.log("otp expired");
                return res.status(200).json(generateCommonResponse(4002));
            }

            if (foundOtp.otp !== otp) {
                console.log("invalid otp");
                return res.status(200).json(generateCommonResponse(4002));
            }

            if (screenType === FLOW_TYPE.REGISTER) {
                console.log("creating profile while registering");
                await prisma.user.update({
                    where: { emailId },
                    data: { isVerified: true },
                });
                console.log("user verified");
            }

            await prisma.verificationOtp.delete({
                where: { id: foundOtp.id },
            });

            return res.status(200).json(generateCommonResponse(2002, true));
        } catch (e: any) {
            console.log("error occured while validating otp", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const forgotPassword = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.body);

        try {
            if (!emailId) {
                return res.status(401).json(generateCommonResponse(4000));
            }

            const user = await prisma.user.findUnique({
                where: { emailId },
            });

            if (!user || !user.isVerified) {
                console.log("user not found during forgot password");
                return res.status(200).json(generateCommonResponse(4004));
            }

            const otp = genrateOtp(6);
            const expiresAt = new Date(Date.now() + OTP_TTL_MS);

            const verificationOtp = await prisma.verificationOtp.upsert({
                where: { emailId },
                update: { otp, expiresAt },
                create: { emailId, otp, expiresAt },
            });

            console.log(
                "verification otp upserted during forgot password",
                verificationOtp,
            );

            await sendEmailOtp(emailId, otp);
            console.log("OTP sent to email");

            cleanupExpiredOtp(emailId, verificationOtp.id);

            return res.status(200).json(generateCommonResponse(2001, true));
        } catch (e: any) {
            console.log("error occured during forgot otp", e);
            return res.status(500).json({
                status: false,
                message: e?.errorResponse?.errmsg || RESPONSE_MESSAGES[5001],
            });
        }
    };

    const updatePassword = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.body);
        const { password } = req.body;

        try {
            if (!emailId || !password) {
                return res.status(401).json(generateCommonResponse(4000));
            }

            const existingUser = await prisma.user.findUnique({
                where: { emailId },
            });

            if (!existingUser) {
                console.log("invalid email");
                return res.status(200).json(generateCommonResponse(4004));
            }

            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            await prisma.user.update({
                where: { emailId },
                data: { password: hashedPassword },
            });

            console.log("password updated for user", emailId);
            return res.status(200).json(generateCommonResponse(2004, true));
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
