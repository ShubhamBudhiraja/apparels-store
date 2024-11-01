const express = require("express");
const productControllers = require("../controllers/product.controller");

const ProductRoutes = express.Router();
const { addToCart } = productControllers();

ProductRoutes.post("/add-to-cart", addToCart);

module.exports = ProductRoutes;
