const express = require("express");
const ProductControllers = require("../controllers/product.controller");
const CartControllers = require("../controllers/cart.controller");
const WishlistControllers = require("../controllers/wishlist.controller");

const ProductRoutes = express.Router();
const {
    addProduct,
    removeProduct,
    getAllProducts,
    getProductDetails,
    getRelatedProducts,
} = ProductControllers();
const { addToCart, deleteFromCart, updateCart } = CartControllers();
const { addToWishlist, deleteFromWishlist } = WishlistControllers();

// inventory
ProductRoutes.post("/add-to-inventory", addProduct);
ProductRoutes.delete("/remove-from-inventory", removeProduct);
ProductRoutes.get("/get-all-products", getAllProducts);
ProductRoutes.get("/get-product-details", getProductDetails);
ProductRoutes.get("/get-related-products", getRelatedProducts);

// cart
ProductRoutes.post("/add-to-cart", addToCart);
ProductRoutes.patch("/update-product-quantity", updateCart);
ProductRoutes.delete("/delete-from-cart", deleteFromCart);

// wishlist
ProductRoutes.post("/add-to-wishlist", addToWishlist);
ProductRoutes.delete("/delete-from-wishlist", deleteFromWishlist);

module.exports = ProductRoutes;
