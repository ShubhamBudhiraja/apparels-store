import { CART_OPERATION } from "../constants/common";
import { generateCommonResponse } from "../lib/utils/common";
import prisma from "../config/prisma";
import {
    ensureUserCart,
    findUserByEmail,
    resolveEmailId,
} from "../lib/utils/user";
import { findProductByProductId, formatProduct } from "../lib/utils/product";

export const CartControllers = () => {
    const addToCart = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.body);
        const { prodId, variant } = req.body;

        try {
            if (!emailId || !prodId || !variant) {
                return res.status(401).json(generateCommonResponse(4000));
            }

            const foundProductRecord = await findProductByProductId(prodId);
            const foundUser = await findUserByEmail(emailId);

            if (!foundUser) {
                console.log("user not found while adding product to cart");
                return res.status(200).json(generateCommonResponse(4004));
            }

            if (!foundProductRecord) {
                console.log("product not found");
                return res.status(200).json(generateCommonResponse(4008));
            }

            const foundProduct = formatProduct(foundProductRecord);
            console.log(foundProduct, "product found");

            const foundVariant = foundProduct.variants.find(
                (item) => item.id === variant,
            );

            if (!foundVariant) {
                console.log("variant not found");
                return res.status(200).json(generateCommonResponse(4016));
            }

            if (foundVariant.units === 0) {
                console.log("product is out of stock");
                return res.status(200).json(generateCommonResponse(4007));
            }

            const cart = await ensureUserCart(foundUser.id);
            const existingItem = cart.items.find(
                (item) =>
                    item.productId === prodId &&
                    item.selectedVariant === variant,
            );

            if (existingItem) {
                console.log("product already added in cart");
                return res.status(200).json(generateCommonResponse(4005));
            }

            console.log("adding product to cart");
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: prodId,
                    selectedVariant: variant,
                    quantity: 1,
                },
            });

            return res.status(200).json(generateCommonResponse(2007, true));
        } catch (e) {
            console.log("error occured while adding product to cart", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const updateCart = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.body);
        const { prodId, variant, operation } = req.body;

        try {
            if (!emailId || !prodId || !variant || !operation) {
                return res.status(401).json(generateCommonResponse(4000));
            }

            const foundProductRecord = await findProductByProductId(prodId);
            const foundUser = await findUserByEmail(emailId);

            if (!foundUser) {
                console.log("user not found while updating cart");
                return res.status(200).json(generateCommonResponse(4004));
            }

            if (!foundProductRecord) {
                console.log("product not found");
                return res.status(200).json(generateCommonResponse(4008));
            }

            const foundProduct = formatProduct(foundProductRecord);
            const variantData = foundProduct.variants.find(
                (item) => item.id === variant,
            );

            if (variantData?.units === 0) {
                console.log("product is out of stock");
                return res.status(200).json(generateCommonResponse(4007));
            }

            const cart = await ensureUserCart(foundUser.id);
            const cartItem = cart.items.find(
                (item) =>
                    item.productId === prodId &&
                    item.selectedVariant === variant,
            );

            if (!cartItem) {
                console.log("product not found in cart");
                return res.status(200).json(generateCommonResponse(4006));
            }

            console.log("updating cart");

            switch (operation) {
                case CART_OPERATION.INCREASE:
                    if (cartItem.quantity === variantData?.units) {
                        console.log("maximum inventory reached");
                        return res
                            .status(200)
                            .json(generateCommonResponse(4009));
                    }

                    await prisma.cartItem.update({
                        where: { id: cartItem.id },
                        data: { quantity: cartItem.quantity + 1 },
                    });

                    return res
                        .status(200)
                        .json(generateCommonResponse(2008, true));

                case CART_OPERATION.DECREASE:
                    if (cartItem.quantity === 1) {
                        await prisma.cartItem.delete({
                            where: { id: cartItem.id },
                        });
                        return res
                            .status(200)
                            .json(generateCommonResponse(2009, true));
                    }

                    await prisma.cartItem.update({
                        where: { id: cartItem.id },
                        data: { quantity: cartItem.quantity - 1 },
                    });

                    return res
                        .status(200)
                        .json(generateCommonResponse(2008, true));

                default:
                    console.log("invalid operation");
                    return res.status(200).json(generateCommonResponse(4010));
            }
        } catch (e) {
            console.log("error occured while updating cart", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    const deleteFromCart = async (req: any, res: any) => {
        const emailId = resolveEmailId(req.query);
        const { prodId, variant } = req.query;

        try {
            if (!emailId || !prodId || !variant) {
                return res.status(401).json(generateCommonResponse(4000));
            }

            const foundProductRecord = await findProductByProductId(prodId);
            const foundUser = await findUserByEmail(emailId);

            if (!foundUser) {
                console.log("user not found while deleting product from cart");
                return res.status(200).json(generateCommonResponse(4004));
            }

            if (!foundProductRecord) {
                console.log("product not found");
                return res.status(200).json(generateCommonResponse(4008));
            }

            const cart = await ensureUserCart(foundUser.id);
            const cartItem = cart.items.find(
                (item) =>
                    item.productId === prodId &&
                    item.selectedVariant === variant,
            );

            if (!cartItem) {
                console.log("product not found in cart");
                return res.status(200).json(generateCommonResponse(4006));
            }

            console.log("updating cart");
            await prisma.cartItem.delete({ where: { id: cartItem.id } });
            console.log("deleted");

            return res.status(200).json(generateCommonResponse(2009, true));
        } catch (e) {
            console.log("error occured while deleting product from cart", e);
            return res.status(500).json(generateCommonResponse(5000));
        }
    };

    return { addToCart, updateCart, deleteFromCart };
};
