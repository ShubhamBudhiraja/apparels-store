const { default: mongoose } = require('mongoose')
const GlobalProductSchema = require('../interface/product')

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    dob: Date,
    address: {
        houseNo: String,
        city: String,
        pincode: String,
        state: String
    },
    mobileNo: String,
    wishlist: [GlobalProductSchema],
    cart: [GlobalProductSchema],
})

const UserModel = mongoose.model('userModel', userSchema)
module.exports = UserModel