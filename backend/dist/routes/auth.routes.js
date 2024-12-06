"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
exports.AuthRoutes = express_1.default.Router();
const { register, validateOtp, login, updatePassword, forgotPassword } = (0, auth_controller_1.AuthControllers)();
exports.AuthRoutes.post("/register", register);
exports.AuthRoutes.post("/validate-otp", validateOtp);
exports.AuthRoutes.post("/login", login);
exports.AuthRoutes.patch("/update-password", updatePassword);
exports.AuthRoutes.post("/forgot-password", forgotPassword);
