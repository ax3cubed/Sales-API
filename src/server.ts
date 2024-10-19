import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/routes/health-check.router";
import userRouter from "./api/routes/user.router";


const logger = pino({ name: "server start" });
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


// Swagger UI
app.use(openAPIRouter);


export { app, logger };