const express = require("express");
const UserControllers = require("../controllers/user.controller");

const UserRoutes = express.Router();
const { getProfile, updateProfile } = UserControllers();

UserRoutes.get("/get-profile", getProfile);
UserRoutes.patch("/update-profile", updateProfile);

module.exports = UserRoutes;
