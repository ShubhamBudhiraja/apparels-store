const express = require('express')
const userControllers = require('../controllers/user.controller')

const UserRoutes = express.Router()
const { getProfile, updateProfile } = userControllers()

UserRoutes.post('/update-profile', updateProfile)
UserRoutes.get('/get-profile-data', getProfile)

module.exports = UserRoutes