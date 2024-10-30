const { default: mongoose } = require('mongoose')
const GlobalProductSchema = require('../interface/product')

const prouctSchema = new mongoose.Schema(GlobalProductSchema)

const ProductModel = mongoose.model('productsModel', prouctSchema)
module.exports = ProductModel