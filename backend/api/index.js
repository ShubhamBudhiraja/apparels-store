"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const auth_routes_1 = require("./routes/auth.routes");
const errorHandler_1 = require("./middlewares/errorHandler");
const corsHandler_1 = require("./middlewares/corsHandler");
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const accessHandler_1 = require("./middlewares/accessHandler");
(0, dotenv_1.config)();
(0, database_1.connectDB)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsHandler_1.customCorsOptions));
app.use(accessHandler_1.handleAppAccess);
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    throw new Error("error checking");
    res.send("Welcome to Apparel Store Backend");
});
app.use("/auth", auth_routes_1.AuthRoutes);
app.use("/user", user_routes_1.default);
app.use("/product", product_routes_1.default);
app.use("/payment", payment_routes_1.default);
app.use(errorHandler_1.ErrorHandler);
app.listen(process.env.PORT, () => {
    console.log(`Server is active on ${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map