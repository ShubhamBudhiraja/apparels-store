"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const UserRoutes = express_1.default.Router();
const { getProfile, updateProfile, addAddress, updateAddress, deleteAddress } = (0, user_controller_1.UserControllers)();
UserRoutes.get("/get-profile", getProfile);
UserRoutes.patch("/update-profile", updateProfile);
UserRoutes.post("/add-address", addAddress);
UserRoutes.patch("/update-address", updateAddress);
UserRoutes.delete("/delete-address", deleteAddress);
exports.default = UserRoutes;
//# sourceMappingURL=user.routes.js.map