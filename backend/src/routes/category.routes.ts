import express from "express";
import { CategoryControllers } from "../controllers/category.controller";

const CategoryRoutes = express.Router();
const {
    getCategoryTree,
    createCategory,
    updateCategory,
    deleteCategory,
    resolveLeaf,
} = CategoryControllers();

CategoryRoutes.get("/tree", getCategoryTree);
CategoryRoutes.get("/resolve", resolveLeaf);
CategoryRoutes.post("/", createCategory);
CategoryRoutes.patch("/", updateCategory);
CategoryRoutes.delete("/", deleteCategory);

export default CategoryRoutes;
