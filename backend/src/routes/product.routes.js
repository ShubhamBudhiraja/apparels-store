const express = require("express");
const ProductControllers = require("../controllers/product.controller");

const ProductRoutes = express.Router();
const { add, remove, get } = ProductControllers();

ProductRoutes.post("/add-to-inventory", add);
ProductRoutes.delete("/remove-from-inventory", remove);
ProductRoutes.get("/get-all-products", get);

module.exports = ProductRoutes;
