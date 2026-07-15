import { generateCommonResponse } from "../lib/utils/common";
import prisma from "../config/prisma";
import { findUserByEmail, resolveEmailId } from "../lib/utils/user";
import { findProductByProductId } from "../lib/utils/product";

export const WishlistControllers = () => {
    const addToWishlist = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.body);
        const { prodId } = req.body;

        try {
            if (!emailId || !prodId) {
                return res.status(401).json(generateCommonResponse(4000));
            }

            const foundProduct = await findProductByProductId(prodId);
            const foundUser = await findUserByEmail(emailId);

            if (!foundUser) {
                console.log(
                    "user not found while adding product to wishlist",
                );
                return res.status(400).json(generateCommonResponse(4004));
            }

            if (!foundProduct) {
                console.log("product not found");
                return res.status(400).json(generateCommonResponse(4008));
            }

            const existing = foundUser.wishlist.find(
                (item) => item.productId === prodId,
            );

            if (existing) {
                console.log("product already added in wishlist");
                return res.status(400).json(generateCommonResponse(4014));
            }

            console.log("adding product to wishlist");
            await prisma.wishlistItem.create({
                data: {
                    userId: foundUser.id,
                    productId: prodId,
                },
            });

            return res.status(200).json(generateCommonResponse(2013, true));
        } catch (e) {
            console.log("error occured while adding product to wishlist", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const deleteFromWishlist = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.query);
        const { prodId } = req.query;

        try {
            if (!emailId || !prodId) {
                return res.status(401).json(generateCommonResponse(4000));
            }

            const foundProduct = await findProductByProductId(prodId);
            const foundUser = await findUserByEmail(emailId);

            if (!foundUser) {
                console.log(
                    "user not found while deleting product from wishlist",
                );
                return res.status(400).json(generateCommonResponse(4004));
            }

            if (!foundProduct) {
                console.log("product not found");
                return res.status(400).json(generateCommonResponse(4008));
            }

            const wishlistItem = foundUser.wishlist.find(
                (item) => item.productId === prodId,
            );

            if (!wishlistItem) {
                console.log("product not found in wishlist");
                return res.status(400).json(generateCommonResponse(4015));
            }

            console.log("updating wishlist");
            await prisma.wishlistItem.delete({
                where: { id: wishlistItem.id },
            });

            return res.status(200).json(generateCommonResponse(2014, true));
        } catch (e) {
            console.log("error occured while deleting from wishlist", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    return { addToWishlist, deleteFromWishlist };
};
