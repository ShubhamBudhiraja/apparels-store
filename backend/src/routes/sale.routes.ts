import express from "express";
import { SaleControllers } from "../controllers/sale.controller";

const SaleRoutes = express.Router();
const {
    listSales,
    getSale,
    createSale,
    updateSale,
    addProductsToSale,
    removeProductsFromSale,
    deleteSale,
} = SaleControllers();

SaleRoutes.get("/", listSales);
SaleRoutes.get("/details", getSale);
SaleRoutes.post("/", createSale);
SaleRoutes.patch("/", updateSale);
SaleRoutes.post("/products", addProductsToSale);
SaleRoutes.post("/products/remove", removeProductsFromSale);
SaleRoutes.delete("/", deleteSale);

export default SaleRoutes;
