"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const CategoryRoutes = express_1.default.Router();
const { getCategoryTree, createCategory, updateCategory, deleteCategory, resolveLeaf, } = (0, category_controller_1.CategoryControllers)();
CategoryRoutes.get("/tree", getCategoryTree);
CategoryRoutes.get("/resolve", resolveLeaf);
CategoryRoutes.post("/", createCategory);
CategoryRoutes.patch("/", updateCategory);
CategoryRoutes.delete("/", deleteCategory);
exports.default = CategoryRoutes;
//# sourceMappingURL=category.routes.js.map