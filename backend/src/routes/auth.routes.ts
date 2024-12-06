import express from "express";
import { AuthControllers } from "../controllers/auth.controller";

export const AuthRoutes = express.Router();
const { register, validateOtp, login, updatePassword, forgotPassword } =
    AuthControllers();

AuthRoutes.post("/register", register);
AuthRoutes.post("/validate-otp", validateOtp);
AuthRoutes.post("/login", login);
AuthRoutes.patch("/update-password", updatePassword);
AuthRoutes.post("/forgot-password", forgotPassword);
