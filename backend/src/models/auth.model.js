const { default: mongoose } = require('mongoose');

const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: String,
    isVerified: { type: Boolean, default: false }
}, { timestamps: true })

const AuthModel = mongoose.model('authModel', authSchema)
module.exports = AuthModel