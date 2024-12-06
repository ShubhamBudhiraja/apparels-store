import express from "express";
import { ProductControllers } from "../controllers/product.controller";
import { CartControllers } from "../controllers/cart.controller";
import { WishlistControllers } from "../controllers/wishlist.controller";

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

export default ProductRoutes;
