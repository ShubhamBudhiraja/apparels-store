const express = require('express')
const authControllers = require('../controllers/auth')

const AuthRoutes = express.Router()

AuthRoutes.post('/register', authControllers.register)
AuthRoutes.post('/validate-otp', authControllers.validateOtp)
AuthRoutes.post('/login', authControllers.login)

module.exports = AuthRoutes