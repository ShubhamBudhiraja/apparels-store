"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const cart_controller_1 = require("../controllers/cart.controller");
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const ProductRoutes = express_1.default.Router();
const { addProduct, removeProduct, getAllProducts, getProductDetails, getRelatedProducts, } = (0, product_controller_1.ProductControllers)();
const { addToCart, deleteFromCart, updateCart } = (0, cart_controller_1.CartControllers)();
const { addToWishlist, deleteFromWishlist } = (0, wishlist_controller_1.WishlistControllers)();
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
exports.default = ProductRoutes;
//# sourceMappingURL=product.routes.js.map