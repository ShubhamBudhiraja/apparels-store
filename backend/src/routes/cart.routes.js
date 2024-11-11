const express = require("express");
const CartControllers = require("../controllers/cart.controller");

const CartRoutes = express.Router();
const { add, update, remove } = CartControllers();

CartRoutes.post("/add-product", add);
CartRoutes.patch("/update-product-quantity", update);
CartRoutes.delete("/delete-product", remove);

module.exports = CartRoutes;
