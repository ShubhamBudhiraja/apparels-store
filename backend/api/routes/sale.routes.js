"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sale_controller_1 = require("../controllers/sale.controller");
const SaleRoutes = express_1.default.Router();
const { listSales, getSale, createSale, updateSale, addProductsToSale, removeProductsFromSale, deleteSale, } = (0, sale_controller_1.SaleControllers)();
SaleRoutes.get("/", listSales);
SaleRoutes.get("/details", getSale);
SaleRoutes.post("/", createSale);
SaleRoutes.patch("/", updateSale);
SaleRoutes.post("/products", addProductsToSale);
SaleRoutes.post("/products/remove", removeProductsFromSale);
SaleRoutes.delete("/", deleteSale);
exports.default = SaleRoutes;
//# sourceMappingURL=sale.routes.js.map