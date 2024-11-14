import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/routes/api-registry/health-check.router";
import userRouter from "./api/routes/user.router";
import orderRouter from "./api/routes/order.router";
import productRouter from "./api/routes/product.router";
import salesRouter from "./api/routes/sales.router";
import { runSeeder } from "./api/seeder/seed";


const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/sales", salesRouter);

// Swagger UI
app.use(openAPIRouter);



export { app };
