const express = require("express");
const UserControllers = require("../controllers/user.controller");

const UserRoutes = express.Router();
const { getProfile, updateProfile, addAddress, updateAddress, deleteAddress } =
    UserControllers();

UserRoutes.get("/get-profile", getProfile);
UserRoutes.patch("/update-profile", updateProfile);
UserRoutes.post("/add-address", addAddress);
UserRoutes.patch("/update-address", updateAddress);
UserRoutes.delete("/delete-address", deleteAddress);

module.exports = UserRoutes;
