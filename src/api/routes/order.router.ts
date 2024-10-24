import { Router } from "express";
import { OrderService } from "../services/order.service";
import { MongoDbDataSource } from "@/common/datasources";
import { Order } from "../models/order.model";
import { OrderController } from "../controller/order.controller";

const orderRouter = Router();
const orderService = new OrderService(MongoDbDataSource.getRepository(Order));
const orderController = new OrderController(orderService);

// Below's from orderController
orderRouter.get("/:id", (req, res) => orderController.findOrderById(req, res));
orderRouter.post("/", (req, res) => orderController.createOrder(req, res));
orderRouter.put("/", (req, res) => orderController.updateOrder(req, res));
orderRouter.delete("/:id", (req, res) => orderController.softDeleteOrder(req, res));

export default orderRouter;