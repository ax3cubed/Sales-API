import { Router } from "express";
import { SalesService } from "../services/sales.service";
import { Sales } from "../models/sales.model";
import { SalesController } from "../controller/sales.controller";
import { getDataSource } from "@/common/datasources/MongoDbDataSource";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z, ZodTypeAny } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

extendZodWithOpenApi(z);

const SalesSchema = z.object({
  id: z.string().optional().openapi({ example: "60c72b2f9b1d4e4b7c8a4e4d" }),
  quantitySold: z.number().int().positive({ message: "Quantity sold must be a positive integer" }).openapi({ example: 10 }),
  totalPrice: z.number().positive({ message: "Total price must be a positive number" }).openapi({ example: 199.99 }),
  createdAt: z.string().optional().openapi({ example: "2023-01-01T00:00:00Z" }),
  updatedAt: z.string().optional().openapi({ example: "2023-01-02T00:00:00Z" }),
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
export const salesRouterRegistry = new OpenAPIRegistry();

salesRouterRegistry.registerPath({
  method: 'get',
  path: '/api/sales',
  description: 'Get a list of Sales',
  summary: 'List all Sales',
  tags: ["Sales"],
  responses: createApiResponse(SalesSchema.array(), 'List of Sales'),
});

salesRouterRegistry.registerPath({
  method: 'get',
  path: '/api/sales/{id}',
  description: 'Get sales data by its ID',
  summary: 'Get a single Sale',
  tags: ["Sales"],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string', example: '60c72b2f9b1d4e4b7c8a4e4d' },
    },
  ],
  responses: generateApiResponse(SalesSchema, 'Sales data retrieved successfully'),
});

salesRouterRegistry.registerPath({
  method: 'post',
  path: '/api/sales',
  description: 'Create a new sale',
  summary: 'Create Sale',
  tags: ["Sales"],
  requestBody: createRequestBody(SalesSchema),
  responses: {
    201: {
      description: 'Sale created successfully',
      content: {
        'application/json': {
          schema: SalesSchema.openapi({}),
        },
      },
    },
    400: { description: 'Bad Request - Invalid input' },
  },
});

salesRouterRegistry.registerPath({
  method: 'put',
  path: '/api/sales/{id}',
  description: 'Update an existing sale',
  summary: 'Update Sale',
  tags: ["Sales"],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string', example: '60c72b2f9b1d4e4b7c8a4e4d' },
    },
  ],
  requestBody: createRequestBody(SalesSchema),
  responses: generateApiResponse(SalesSchema, 'Sale updated successfully'),
});

salesRouterRegistry.registerPath({
  method: 'delete',
  path: '/api/sales/{id}',
  description: 'Delete a sale',
  summary: 'Delete Sale',
  tags: ["Sales"],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string', example: '60c72b2f9b1d4e4b7c8a4e4d' },
    },
  ],
  responses: {
    204: { description: 'Sale deleted successfully' },
    404: { description: 'Sale not found' },
  },
});

const salesRouter = Router();

const init = async () => {
    return await getDataSource();
  };

init().then((MongoDbDataSource) => {
  const salesService = new SalesService(MongoDbDataSource.getRepository(Sales));
  const salesController = new SalesController(salesService);

  salesRouter.get("/", (req, res) => salesController.getAllSales(req, res));
  salesRouter.get("/:id", (req, res) => salesController.getSalesById(req, res));
  salesRouter.post("/", (req, res) => salesController.createSales(req, res));
  salesRouter.put("/:id", (req, res) => salesController.updateSales(req, res));
  salesRouter.delete("/:id", (req, res) => salesController.deleteSales(req, res));
});

export default salesRouter;
