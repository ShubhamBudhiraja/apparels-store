const sendEmailOtp = require("../config/nodemailer");
const ResponseMessages = require("../constants/responseMessages");
const AuthModel = require("../models/auth.model");
const authUtils = require("../utils/auth");

const sendOTP = async (email, res) => {
    const otp = authUtils.getOtp();
    await AuthModel.findOneAndUpdate({ email }, { $set: { otp } });
    console.log("OTP updated in DB");

    await sendEmailOtp(email, otp)
    console.log("OTP sent to email");

    return res.status(200).json({
        status: true,
        responseCode: 2001,
        message: ResponseMessages[2001],
        responseBody: { otp },
    });
}

const register = async (req, res) => {
    try {
        const { email, password, forgotPassword } = req.body;

        const isExistingUser = await AuthModel.findOne({ email });

        if (isExistingUser) {
            if (isExistingUser.isVerified) {
                if (forgotPassword) {
                    return await sendOTP(email, res);
                }
                else return res.status(200).json({
                    status: false,
                    responseCode: 4001,
                    message: ResponseMessages[4001],
                    responseBody: null,
                });
            }
            else {
                return await sendOTP(email, res);
            }
        } else {
            if (email && password) {
                const otp = authUtils.getOtp();
                await AuthModel.create({ email, password, otp });
                await sendEmailOtp(email, otp)
                return res.status(200).json({
                    status: true,
                    responseCode: 2001,
                    message: ResponseMessages[2001],
                    responseBody: { otp },
                });
            } else return res.status(200).json({
                status: true,
                responseCode: 4000,
                message: ResponseMessages[4000],
                responseBody: null,
            });
        }
    } catch (e) {
        console.log(e, "error");
        res.status(200).json({ status: false, message: e?.errorResponse?.errmsg || ResponseMessages[5001] });
    }
};

const validateOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const foundUser = await AuthModel.findOne({ email });
        if (foundUser.otp === otp) {
            await AuthModel.findOneAndUpdate(
                { email },
                { $set: { isVerified: true } }
            );
            return res.status(200).json({
                status: true,
                responseCode: 2002,
                message: ResponseMessages[2002],
                responseBody: null,
            });
        } else
            return res.status(200).json({
                status: false,
                responseCode: 4002,
                message: ResponseMessages[4002],
                responseBody: null,
            });
    } catch (e) {
        res.status(200).json({ status: false, message: e?.errorResponse?.errmsg || ResponseMessages[5001] });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await AuthModel.findOne({ email });

        if (foundUser && foundUser.password === password)
            return res.status(200).json({
                status: true,
                responseCode: 2003,
                message: ResponseMessages[2003],
                responseBody: null,
            });
        else return res.status(200).json({
            status: false,
            responseCode: 4003,
            message: ResponseMessages[4003],
            responseBody: null,
        });
    } catch (e) {
        res.status(200).json({ status: false, message: e?.errorResponse?.errmsg || ResponseMessages[5001] });
    }
};

const updatePassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await AuthModel.findOneAndUpdate({ email }, { $set: { password } });
        if (foundUser)
            return res.status(200).json({
                status: true,
                responseCode: 2004,
                message: ResponseMessages[2004],
                responseBody: null,
            }); else return res.status(200).json({
                status: false,
                responseCode: 4004,
                message: ResponseMessages[4004],
                responseBody: null,
            });
    } catch (e) {
        res.status(200).json({ status: false, message: e?.errorResponse?.errmsg || ResponseMessages[5001] });
    }
}

const authControllers = { register, validateOtp, login, updatePassword };

module.exports = authControllers;
