import { Router } from "express";
import { OrderService } from "../services/order.service";
import { Order } from "../models/order.model";
import { OrderController } from "../controller/order.controller";
import { getDataSource } from "@/common/datasources/MongoDbDataSource";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

const orderRouter = Router();

extendZodWithOpenApi(z);
const OrderSchema = z.object({
    id: z.string().optional().openapi({ example: "60c72b2f9b1d4e4b7c8a4e4d" }),
    orderNumber: z.string().min(1, { message: "Order number is required" }).openapi({ example: "ORD12345" }),
    products: z.array(z.string().min(1, { message: "Product id is required" })).openapi({
      example: ["60c72b2f9b1d4e4b7c8a4e4a", "60c72b2f9b1d4e4b7c8a4e4b"]
    }),
    quantity: z.number().int().positive({ message: "Quantity must be a positive integer" }).openapi({ example: 5 }),
    user: z.string().optional().openapi({ example: "60c72b2f9b1d4e4b7c8a4e4c" }),
    totalPrice: z.number().positive({ message: "Total price must be a positive number" }).openapi({ example: 99.99 }),
    createdAt: z.string().optional().openapi({ example: "2023-01-01T00:00:00Z" }),
    updatedAt: z.string().optional().openapi({ example: "2023-01-02T00:00:00Z" }),
    softDeleted: z.boolean().optional().openapi({ example: false })
  });

const init = async () => {
    return await getDataSource();
};
  
export const orderRouterRegistry = new OpenAPIRegistry();

orderRouterRegistry.registerPath({
    method: 'get',
    path: '/api/orders',
    description: 'Get a list of orders',
    summary: 'List all orders',
    tags: ["Orders"],
    responses: createApiResponse(OrderSchema.array(), 'List of users'), 
});

init().then((MongoDbDataSource) => {
    const orderService = new OrderService(MongoDbDataSource.getRepository(Order));
    const orderController = new OrderController(orderService);
    
    orderRouter.get("/:id", (req, res) => orderController.findOrderById(req, res));
    orderRouter.post("/", (req, res) => orderController.createOrder(req, res));
    orderRouter.put("/", (req, res) => orderController.updateOrder(req, res));
    orderRouter.delete("/:id", (req, res) => orderController.softDeleteOrder(req, res));
  });


export default orderRouter;