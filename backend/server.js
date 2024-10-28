const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/database");
const AuthRoutes = require("./src/routes/auth.routes");

dotenv.config();
connectDB()

const app = express();

app.use(express.json())
app.use('/auth', AuthRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is active on ${process.env.PORT}`);
});
