const paymentUtils = () => {
    const updateProduct = (productId, variants) => {
        return ProductModel.findOneAndUpdate(
            { productId },
            { $set: { variants } }
        );
    };

    const updateProductInventory = async (allProducts, cartProducts) => {
        const record = {};

        allProducts.forEach((product) => {
            const prod = product;
            cartProducts.forEach((cartProduct) => {
                const variantIndex = prod.variants.findIndex(
                    (variant) => variant.id === cartProduct.selectedVariant
                );
                if (variantIndex !== -1) {
                    prod.variants[variantIndex].units -= cartProduct.quantity;
                    record[cartProduct.productId] = prod.variants;
                }
            });
        });

        console.log("updating product inventory");

        const productPromise = Object.entries(record).map(([key, value]) =>
            updateProduct(key, value)
        );
        await Promise.allSettled(productPromise);

        console.log("product inventory updated");
    };

    const checkProductsAvailability = (allProducts, cartProducts) => {
        let allProductsAvailable = true;
        for (
            let productIndex = 0;
            productIndex < allProducts.length;
            productIndex++
        ) {
            for (
                let cartProductIndex = 0;
                cartProductIndex < cartProducts.length;
                cartProductIndex++
            ) {
                const addedVariant = allProducts[productIndex].variants.find(
                    (variant) =>
                        variant.id ===
                        cartProducts[cartProductIndex].selectedVariant
                );
                if (
                    addedVariant &&
                    addedVariant.units < cartProducts[cartProductIndex].quantity
                ) {
                    allProductsAvailable = false;
                    break;
                }
            }
            if (!allProductsAvailable) break;
        }

        return allProductsAvailable;
    };

    const generateOrderDetails = ({ orderId, addressId, userDetails }) => ({
        orderId,
        orderTimeStamp: new Date(),
        cartTotal: userDetails.cart.cartTotal,
        total: userDetails.cart.total,
        isDeliveryFeeIncluded: userDetails.cart.isDeliveryFeeIncluded,
        couponDiscount: userDetails.cart.couponDiscount,
        products: userDetails.cart.products.map((product) => ({
            productId: product.productId,
            title: product.title,
            price: product.price,
            offerPrice: product.offerPrice,
            quantity: product.quantity,
            thumbnail: product.thumbnail,
            selectedVariant: product.selectedVariant,
        })),
        address: userDetails.addresses.find(
            (address) => address.id === addressId
        ),
    });

    return {
        updateProduct,
        updateProductInventory,
        checkProductsAvailability,
        generateOrderDetails,
    };
};

module.exports = paymentUtils;
