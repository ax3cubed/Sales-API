import { Router } from "express";
import { SalesService } from "../services/sales.service";
import { Sales } from "../models/sales.model";
import { SalesController } from "../controller/sales.controller";
import { getDataSource } from "@/common/datasources/MongoDbDataSource";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z, ZodTypeAny } from "zod";
import { createApiRequest, createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { mergeRecordObjects } from "@/common/utils/utils";
import { StatusCodes } from "http-status-codes";

extendZodWithOpenApi(z);

const SalesSchema = z.object({
  id: z.string().optional().openapi({ example: "60c72b2f9b1d4e4b7c8a4e4d" }),
  quantitySold: z.number().int().positive({ message: "Quantity sold must be a positive integer" }).openapi({ example: 10 }),
  totalPrice: z.number().positive({ message: "Total price must be a positive number" }).openapi({ example: 199.99 }),
  createdAt: z.string().optional().openapi({ example: "2023-01-01T00:00:00Z" }),
  updatedAt: z.string().optional().openapi({ example: "2023-01-02T00:00:00Z" }),
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
  responses: createApiResponse(SalesSchema, 'Sales data retrieved successfully'),
});

salesRouterRegistry.registerPath({
  method: 'post',
  path: '/api/sales',
  description: 'Create a new sale',
  summary: 'Create Sale',
  tags: ["Sales"],
  request: {
    body: createApiRequest(SalesSchema, "Create Sales Request"),
  },
  responses: mergeRecordObjects(
    createApiResponse(SalesSchema, 'Sales created successfully',StatusCodes.CREATED),
    createApiResponse(SalesSchema, 'Bad Request - Invalid input',StatusCodes.BAD_REQUEST)
  )
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
  request:{
    body: createApiRequest(SalesSchema, "Sales Update Request")
  } ,
  responses: mergeRecordObjects(
      createApiResponse(SalesSchema, 'Sales updated successfully',StatusCodes.OK),
      createApiResponse(SalesSchema, 'Sales not found',StatusCodes.NOT_FOUND)
  ),
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
  responses: mergeRecordObjects(
    createApiResponse(SalesSchema, 'Sale deleted successfully',StatusCodes.NO_CONTENT),
    createApiResponse(SalesSchema, 'Sale not found',StatusCodes.NOT_FOUND)
  )
 
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