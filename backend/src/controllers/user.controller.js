const RESPONSE_MESSAGES = require("../constants/responseMessages");
const UserModel = require("../models/user.model");
const commonUtils = require("../utils/common");

const userControllers = () => {
    const getProfile = async (req, res) => {
        const { email } = req.body

        try {
            const found = await UserModel.findOne({ email });

            if (found) {
                console.log("updateProfile user found", found);
                return res
                    .status(200)
                    .json(commonUtils.generateCommonResponse(2005, true, found));
            } else {
                console.log("updateProfile user not found");
                return res
                    .status(400)
                    .json(commonUtils.generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while updating profile", e);
            return res.status(500).json(commonUtils.generateCommonResponse(5000));
        }
    }

    const updateProfile = async (req, res) => {
        const { email, ...rest } = req.body;

        try {
            const found = await UserModel.findOneAndUpdate({ email }, { $set: rest });

            if (found) {
                console.log("updateProfile user found", found);
                return res
                    .status(200)
                    .json(commonUtils.generateCommonResponse(2005, true));
            } else {
                console.log("updateProfile user not found");
                return res
                    .status(400)
                    .json(commonUtils.generateCommonResponse(4004));
            }
        } catch (e) {
            console.log("error occured while updating profile", e);
            return res.status(500).json(commonUtils.generateCommonResponse(5000));
        }
    };

    return { getProfile, updateProfile }
}

module.exports = userControllers;
