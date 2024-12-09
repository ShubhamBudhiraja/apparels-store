"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const database_1 = require("./config/database");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const auth_routes_1 = require("./routes/auth.routes");
const errorHandler_1 = require("./middlewares/errorHandler");
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
(0, dotenv_1.config)();
(0, database_1.connectDB)();
const app = (0, express_1.default)();
// app.use(
//     cors({
//         origin: (params1, params2) => {
//             console.log(params1, "params1");
//             fun(params1, params2);
//         },
//     })
// );
app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express_1.default.json());
app.get("/", (_req, res) => {
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