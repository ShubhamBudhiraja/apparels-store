const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/database");
const AuthRoutes = require("./src/routes/auth.routes");
const ErrorHandler = require("./src/middlewares/errorHandler");
const UserRoutes = require("./src/routes/user.routes");

dotenv.config();
connectDB()

const app = express();

app.use(express.json())

app.use('/auth', AuthRoutes);
app.use('/user', UserRoutes);

app.use(ErrorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server is active on ${process.env.PORT}`);
});
