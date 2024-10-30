const express = require('express')
const userControllers = require('../controllers/user')

const UserRoutes = express.Router()

UserRoutes.post('/update-profile', userControllers.updateProfile)

module.exports = UserRoutes