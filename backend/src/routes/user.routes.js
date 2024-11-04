const express = require("express");
const userControllers = require("../controllers/user.controller");

const UserRoutes = express.Router();
const { getProfile, updateProfile } = userControllers();

UserRoutes.get("/get-profile", getProfile);
UserRoutes.patch("/update-profile", updateProfile);

module.exports = UserRoutes;
