import { generateCommonResponse } from "../lib/utils/common";
import {
    buildProfileResponse,
    findUserByEmail,
    formatAddress,
    resolveEmailId,
} from "../lib/utils/user";
import prisma from "../config/prisma";

export const UserControllers = () => {
    const getProfile = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.query);

        try {
            if (!emailId) {
                return res.status(401).json(generateCommonResponse(4000));
            }

            const found = await findUserByEmail(emailId);

            if (found) {
                console.log("get profile - user details found");
                const profile = await buildProfileResponse(found);
                return res
                    .status(200)
                    .json(generateCommonResponse(2006, true, profile));
            }

            console.log("get profile - user not found");
            return res.status(200).json(generateCommonResponse(4004));
        } catch (e) {
            console.log("error occured while getting profile", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const updateProfile = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.body);
        const { firstName, lastName, mobileNo, dob, dateOfBirth } = req.body;

        try {
            if (!emailId) {
                return res.status(401).json(generateCommonResponse(4000));
            }

            const existingUser = await prisma.user.findUnique({
                where: { emailId },
            });

            if (!existingUser) {
                console.log("updateProfile user not found");
                return res.status(200).json(generateCommonResponse(4004));
            }

            await prisma.user.update({
                where: { emailId },
                data: {
                    ...(firstName !== undefined && { firstName }),
                    ...(lastName !== undefined && { lastName }),
                    ...(mobileNo !== undefined && { mobileNo }),
                    ...((dob || dateOfBirth) !== undefined && {
                        dateOfBirth: dob || dateOfBirth,
                    }),
                },
            });

            console.log("updateProfile user found");
            return res.status(200).json(generateCommonResponse(2005, true));
        } catch (e) {
            console.log("error occured while updating profile", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const addAddress = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.body);
        const { address } = req.body;

        try {
            if (!emailId || !address) {
                return res.status(401).json(generateCommonResponse(4000));
            }

            const found = await prisma.user.findUnique({
                where: { emailId },
            });

            if (!found) {
                console.log("user not found while adding address");
                return res.status(200).json(generateCommonResponse(4004));
            }

            const createdAddress = await prisma.address.create({
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

            console.log("address added", formatAddress(createdAddress));

            return res.status(200).json(
                generateCommonResponse(2015, true, {
                    addressId: createdAddress.id,
                }),
            );
        } catch (e) {
            console.log("error occured while adding address", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const updateAddress = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.body);
        const { addressId, ...rest } = req.body;

        try {
            if (!emailId || !addressId) {
                return res.status(401).json(generateCommonResponse(4000));
            }

            const found = await prisma.user.findUnique({
                where: { emailId },
            });

            if (!found) {
                console.log("user not found while updating address");
                return res.status(200).json(generateCommonResponse(4004));
            }

            const existingAddress = await prisma.address.findFirst({
                where: { id: addressId, userId: found.id },
            });

            if (!existingAddress) {
                console.log("address not found while updating");
                return res.status(200).json(generateCommonResponse(4017));
            }

            const {
                firstName,
                lastName,
                mobileNo,
                houseNo,
                streetAddress,
                city,
                pincode,
                state,
                isDefault,
            } = rest;

            await prisma.address.update({
                where: { id: addressId },
                data: {
                    ...(firstName !== undefined && { firstName }),
                    ...(lastName !== undefined && { lastName }),
                    ...(mobileNo !== undefined && { mobileNo }),
                    ...(houseNo !== undefined && { houseNo }),
                    ...(streetAddress !== undefined && { streetAddress }),
                    ...(city !== undefined && { city }),
                    ...(pincode !== undefined && { pincode }),
                    ...(state !== undefined && { state }),
                    ...(isDefault !== undefined && { isDefault }),
                },
            });

            console.log("address updated");
            return res.status(200).json(generateCommonResponse(2016, true));
        } catch (e) {
            console.log("error occured while updating address", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const deleteAddress = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.query);
        const { addressId } = req.query;

        try {
            if (!emailId || !addressId) {
                return res.status(401).json(generateCommonResponse(4000));
            }

            const found = await prisma.user.findUnique({
                where: { emailId },
            });

            if (!found) {
                console.log("user not found while deleting address");
                return res.status(200).json(generateCommonResponse(4004));
            }

            const existingAddress = await prisma.address.findFirst({
                where: { id: addressId, userId: found.id },
            });

            if (!existingAddress) {
                console.log("address not found while deleting");
                return res.status(200).json(generateCommonResponse(4017));
            }

            await prisma.address.delete({ where: { id: addressId } });

            console.log("address deleted for addressId -> ", addressId);
            return res.status(200).json(generateCommonResponse(2017, true));
        } catch (e) {
            console.log("error occured while deleting address", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    return {
        getProfile,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
    };
};
