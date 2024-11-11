const express = require("express");
const AuthControllers = require("../controllers/auth.controller");

const AuthRoutes = express.Router();
const { register, validateOtp, login, updatePassword, forgotPassword } =
    AuthControllers();

AuthRoutes.post("/register", register);
AuthRoutes.post("/validate-otp", validateOtp);
AuthRoutes.post("/login", login);
AuthRoutes.patch("/update-password", updatePassword);
AuthRoutes.post("/forgot-password", forgotPassword);

module.exports = AuthRoutes;
