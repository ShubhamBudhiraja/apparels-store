const GlobalProductSchema = {
    id: String,
    name: String,
    description: String,
    shortDescription: String,
    price: Number,
    offerPrice: Number,
    discountPercentage: Number,
    discountAmount: Number,
    units: Number,
    images: [String],
    thumbnail: String,
    ratings: Number,
    ratingsCount: Number
}

module.exports = GlobalProductSchema