const express = require('express')
const authControllers = require('../controllers/auth')

const AuthRoutes = express.Router()

AuthRoutes.post('/register', authControllers.register)
AuthRoutes.post('/validate-otp', authControllers.validateOtp)
AuthRoutes.post('/login', authControllers.login)
AuthRoutes.post('/update-password', authControllers.updatePassword)
AuthRoutes.post('/forgot-password', authControllers.forgotPassword)

module.exports = AuthRoutes