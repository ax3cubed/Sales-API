import { Router } from "express";
import { SalesService } from "../services/sales.service";
import { Sales } from "../models/sales.model";
import { SalesController } from "../controller/sales.controller";
import { getDataSource } from "@/common/datasources/MongoDbDataSource";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

extendZodWithOpenApi(z);
const salesRouter = Router();
const SalesSchema = z.object({
    id: z.string().optional().openapi({ example: "60c72b2f9b1d4e4b7c8a4e4d" }),
    quantitySold: z.number().int().positive({ message: "Quantity sold must be a positive integer" }).openapi({ example: 10 }),
    totalPrice: z.number().positive({ message: "Total price must be a positive number" }).openapi({ example: 199.99 }),
    createdAt: z.string().optional().openapi({ example: "2023-01-01T00:00:00Z" }),
    updatedAt: z.string().optional().openapi({ example: "2023-01-02T00:00:00Z" })
  });
  
const init = async () => {
    return await getDataSource();
};
export const salesRouterRegistry = new OpenAPIRegistry();
salesRouterRegistry.registerPath({
    method: 'get',
    path: '/api/sales',
    description: 'Get a list of Sales',
    summary: 'List all Sales',
    tags: ["Sales"],
    responses: createApiResponse(SalesSchema.array(), 'List of Sales'), 
});





init().then((MongoDbDataSource) => {

const salesService = new SalesService(MongoDbDataSource.getRepository(Sales));
const salesController = new SalesController(salesService);

salesRouter.get("/", (req, res) => salesController.getAllSales(req,res));
salesRouter.get("/:id", (req, res) => salesController.getSalesById(req, res));
salesRouter.post("/", (req, res) => salesController.createSales(req, res));
salesRouter.put("/", (req, res) => salesController.updateSales(req, res));
salesRouter.delete("/:id", (req, res) => salesController.deleteSales(req, res));
});



export default salesRouter;