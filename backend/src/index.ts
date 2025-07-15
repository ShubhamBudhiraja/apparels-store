import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database";
import UserRoutes from "./routes/user.routes";
import ProductRoutes from "./routes/product.routes";
import { AuthRoutes } from "./routes/auth.routes";
import { ErrorHandler } from "./middlewares/errorHandler";
import { customCorsOptions } from "./middlewares/corsHandler";
import PaymentRoutes from "./routes/payment.routes";
import { handleAppAccess } from "./middlewares/accessHandler";
import { OrdersRoutes } from "./routes/orders.routes";

config();
connectDB();

const app = express();

app.use(cors(customCorsOptions));
app.use(handleAppAccess);
app.use(express.json());

app.get("/", (_req: any, res: Response) => {
    res.send("Welcome to Apparel Store Backend");
});
app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);
app.use("/product", ProductRoutes);
app.use("/payment", PaymentRoutes);
app.use("/orders", OrdersRoutes);

app.use(ErrorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server is active on ${process.env.PORT}`);
});
