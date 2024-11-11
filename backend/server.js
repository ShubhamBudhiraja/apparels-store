const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/database");
const AuthRoutes = require("./src/routes/auth.routes");
const ErrorHandler = require("./src/middlewares/errorHandler");
const UserRoutes = require("./src/routes/user.routes");
const ProductRoutes = require("./src/routes/product.routes");
const cors = require("cors");
const customCorsOptions = require("./src/middlewares/corsHandler");
const CartRoutes = require("./src/routes/cart.routes");
const WishlistRoutes = require("./src/routes/wishlist.routes");

dotenv.config();
connectDB();

const app = express();
app.use(cors(customCorsOptions));

app.use(express.json());

app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);
app.use("/product", ProductRoutes);
app.use("/cart", CartRoutes);
app.use("/wishlist", WishlistRoutes);

app.use(ErrorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server is active on ${process.env.PORT}`);
});
