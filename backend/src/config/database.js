const { default: mongoose } = require('mongoose');
require("dotenv").config();

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected");
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = connectDB