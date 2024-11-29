import { Router } from "express";
import { OrderService } from "../services/order.service";
import { Order } from "../models/order.model";
import { OrderController } from "../controller/order.controller";
import { getDataSource } from "@/common/datasources/MongoDbDataSource";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z, ZodTypeAny } from "zod";
import { createApiRequest, createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { mergeRecordObjects } from "@/common/utils/utils";
import { StatusCodes } from "http-status-codes";

extendZodWithOpenApi(z);

const OrderSchema = z.object({
  id: z.string().optional().openapi({ example: "60c72b2f9b1d4e4b7c8a4e4d" }),
  orderNumber: z.string().min(1, { message: "Order number is required" }).openapi({ example: "ORD12345" }),
  product_id:  z.string().min(1, { message: "Product id is required" }).openapi({ example: "60c72b2f9b1d4e4b7c8a4e4b" }),
  quantity: z.number().int().positive({ message: "Quantity must be a positive integer" }).openapi({ example: 5 }),
  user_id: z.string().optional().openapi({ example: "60c72b2f9b1d4e4b7c8a4e4c" }),
  totalPrice: z.number().positive({ message: "Total price must be a positive number" }).openapi({ example: 99.99 }),
  createdAt: z.string().optional().openapi({ example: "2023-01-01T00:00:00Z" }),
  updatedAt: z.string().optional().openapi({ example: "2023-01-02T00:00:00Z" }),
  softDeleted: z.boolean().optional().openapi({ example: false })
});

 
// Initialize the OpenAPI registry and register routes
export const orderRouterRegistry = new OpenAPIRegistry();

orderRouterRegistry.registerPath({
  method: 'get',
  path: '/api/orders',
  description: 'Get a list of orders',
  summary: 'List all orders',
  tags: ["Orders"],
  responses: createApiResponse(OrderSchema.array(), 'List of orders'),
});

orderRouterRegistry.registerPath({
  method: 'get',
  path: '/api/orders',
  description: 'Get order data by its ID',
  summary: 'Get a single order',
  tags: ["Orders"],
  parameters: [
    {
      name: 'id',
      in: 'query',
      required: true,
      schema: { type: 'string', example: '60c72b2f9b1d4e4b7c8a4e4d' },
    },
  ],
  responses: createApiResponse(OrderSchema, 'Order data retrieved successfully'),
});
orderRouterRegistry.registerPath({
  method: 'get',
  path: '/api/orders/getByOrderNumber/{orderNumber}',
  description: 'Get order data by Order Number',
  summary: 'Get orders by order number',
  tags: ["Orders"],
  parameters: [
    {
      name: 'orderNumber',
      in: 'query',
      required: true,
      schema: { type: 'string', example: '60c72b2f9b1d4e4b7c8a4e4d' },
    },
  ],
  responses: createApiResponse(OrderSchema, 'Order data retrieved successfully'),
});
orderRouterRegistry.registerPath({
  method: 'post',
  path: '/api/orders',
  description: 'Create a new order',
  summary: 'Create Order',
  tags: ["Orders"],
  request: {
    body:  createApiRequest(OrderSchema, "Order Create Request")
  },
  responses: mergeRecordObjects(
    createApiResponse(OrderSchema, 'Order created successfully',StatusCodes.CREATED),
    createApiResponse(OrderSchema, 'Bad Request - Invalid input',StatusCodes.BAD_REQUEST)
  )
});

orderRouterRegistry.registerPath({
  method: 'put',
  path: '/api/orders',
  description: 'Update an existing order',
  summary: 'Update Order',
  tags: ["Orders"],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '60c72b2f9b1d4e4b7c8a4e4d' }),
    }),
    body:  createApiRequest(OrderSchema, "User Update Request"),
    
  },
 
 
  responses: mergeRecordObjects(
    createApiResponse(OrderSchema, 'Order updated successfully',StatusCodes.OK),
    createApiResponse(OrderSchema, 'Order not found',StatusCodes.NOT_FOUND)
  )
});

orderRouterRegistry.registerPath({
  method: 'delete',
  path: '/api/orders/{id}',
  description: 'Soft delete an order',
  summary: 'Soft Delete Order',
  tags: ["Orders"],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string', example: '60c72b2f9b1d4e4b7c8a4e4d' },
    },
  ],
  responses: mergeRecordObjects(
    createApiResponse(OrderSchema, 'Order deleted successfully',StatusCodes.NO_CONTENT),
    createApiResponse(OrderSchema, 'Order not found',StatusCodes.NOT_FOUND)
  )
});

const orderRouter = Router();

const init = async () => {
  return await getDataSource();
};

init().then((MongoDbDataSource) => {
  const orderService = new OrderService(MongoDbDataSource.getRepository(Order));
  const orderController = new OrderController(orderService);
  
  orderRouter.get("/", (req, res) => orderController.findAllOrders(req, res));
  orderRouter.get("/:id", (req, res) => orderController.findOrderById(req, res));
  orderRouter.get("/getbyOrderNumber/:orderNumber", (req, res) => orderController.findOrdersByOrderNumber(req, res));
  orderRouter.post("/", (req, res) => orderController.createOrder(req, res));
  orderRouter.put("/", (req, res) => orderController.updateOrder(req, res));
  orderRouter.delete("/:id", (req, res) => orderController.softDeleteOrder(req, res));
});

export default orderRouter;