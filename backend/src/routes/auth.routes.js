const express = require('express')
const authControllers = require('../controllers/auth.controller')

const AuthRoutes = express.Router()
const { register, validateOtp, login, updatePassword, forgotPassword } = authControllers();

AuthRoutes.post('/register', register)
AuthRoutes.post('/validate-otp', validateOtp)
AuthRoutes.post('/login', login)
AuthRoutes.post('/update-password', updatePassword)
AuthRoutes.post('/forgot-password', forgotPassword)

module.exports = AuthRoutes