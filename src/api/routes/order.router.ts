import { Router } from "express";
import { OrderService } from "../services/order.service";
import { Order } from "../models/order.model";
import { OrderController } from "../controller/order.controller";
import { getDataSource } from "@/common/datasources/MongoDbDataSource";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z, ZodTypeAny } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

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

// Utility functions for generating request and response objects
const createRequestBody = (schema: ZodTypeAny) => ({
  required: true,
  content: {
    'application/json': {
      schema: schema.openapi({}),
    },
  },
});

const generateApiResponse = (schema: ZodTypeAny, description: string) => ({
  200: {
    description,
    content: {
      'application/json': {
        schema: schema.openapi({}),
      },
    },
  },
  400: { description: 'Bad request' },
  404: { description: 'Not found' },
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
  path: '/api/orders/{id}',
  description: 'Get order data by its ID',
  summary: 'Get a single order',
  tags: ["Orders"],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string', example: '60c72b2f9b1d4e4b7c8a4e4d' },
    },
  ],
  responses: generateApiResponse(OrderSchema, 'Order data retrieved successfully'),
});

orderRouterRegistry.registerPath({
  method: 'post',
  path: '/api/orders',
  description: 'Create a new order',
  summary: 'Create Order',
  tags: ["Orders"],
  requestBody: createRequestBody(OrderSchema),
  responses: {
    201: {
      description: 'Order created successfully',
      content: {
        'application/json': {
          schema: OrderSchema.openapi({}),
        },
      },
    },
    400: { description: 'Bad Request - Invalid input' },
  },
});

orderRouterRegistry.registerPath({
  method: 'put',
  path: '/api/orders',
  description: 'Update an existing order',
  summary: 'Update Order',
  tags: ["Orders"],
  requestBody: createRequestBody(OrderSchema),
  responses: generateApiResponse(OrderSchema, 'Order updated successfully'),
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
  responses: {
    204: { description: 'Order deleted successfully' },
    404: { description: 'Order not found' },
  },
});

const orderRouter = Router();

const init = async () => {
  return await getDataSource();
};

init().then((MongoDbDataSource) => {
  const orderService = new OrderService(MongoDbDataSource.getRepository(Order));
  const orderController = new OrderController(orderService);
  
  orderRouter.get("/", (req, res) => orderController.findOrderById(req, res));
  orderRouter.get("/:id", (req, res) => orderController.findOrderById(req, res));
  orderRouter.post("/", (req, res) => orderController.createOrder(req, res));
  orderRouter.put("/", (req, res) => orderController.updateOrder(req, res));
  orderRouter.delete("/:id", (req, res) => orderController.softDeleteOrder(req, res));
});

export default orderRouter;
