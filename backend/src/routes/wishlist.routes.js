const express = require("express");
const WishlistControllers = require("../controllers/wishlist.controller");

const WishlistRoutes = express.Router();
const { add, remove } = WishlistControllers();

WishlistRoutes.post("/add-product", add);
WishlistRoutes.delete("/delete-product", remove);

module.exports = WishlistRoutes;
