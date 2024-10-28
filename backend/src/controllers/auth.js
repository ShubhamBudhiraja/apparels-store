const ResponseMessages = require("../constants/responseMessages");
const AuthModel = require("../models/auth.model");
const authUtils = require("../utils/auth");

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const isExistingUser = await AuthModel.findOne({ email });

        if (isExistingUser) {
            if (isExistingUser.isVerified)
                return res.status(200).json({
                    status: false,
                    responseCode: 4001,
                    message: ResponseMessages[4001],
                    responseBody: null,
                });
            else {
                const otp = authUtils.getOtp();
                await AuthModel.findOneAndUpdate({ email }, { $set: { otp } });
                return res.status(200).json({
                    status: true,
                    responseCode: 2001,
                    message: ResponseMessages[2001],
                    responseBody: { otp },
                });
            }
        } else {
            const otp = authUtils.getOtp();
            await AuthModel.create({ email, password, otp });
            return res.status(200).json({
                status: true,
                responseCode: 2001,
                message: ResponseMessages[2001],
                responseBody: { otp },
            });
        }
    } catch (e) {
        res.status(200).json({ status: false, message: e?.errorResponse?.errmsg });
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
        res.status(200).json({ status: false, message: e?.errorResponse?.errmsg });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await AuthModel.findOne({ email });

        if (foundUser.password === password)
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
        res.status(200).json({ status: false, message: e?.errorResponse?.errmsg });
    }
};

const authControllers = { register, validateOtp, login };

module.exports = authControllers;
