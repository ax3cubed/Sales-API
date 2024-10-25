import { Router } from "express";
import { ProductService } from "../services/product.service";
import { Product } from "../models/product.model";
import { ProductController } from "../controller/product.controller";
import { getDataSource } from "@/common/datasources/MongoDbDataSource";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

extendZodWithOpenApi(z);

const init = async () => {
    return await getDataSource();
};
const productRouter = Router();



const ProductSchema = z.object({
    id: z.string().optional().openapi({ example: "60c72b2f9b1d4e4b7c8a4e4d" }),
    name: z.string().min(1, { message: "Product name is required" }).openapi({ example: "Sample Product" }),
    description: z.string().min(1, { message: "Product description is required" }).openapi({ example: "A high-quality product." }),
    price: z.number().positive({ message: "Price must be a positive number" }).openapi({ example: 19.99 }),
    stockQuantity: z.number().int().positive({ message: "Stock quantity must be a positive integer" }).openapi({ example: 100 }),
    order: z.string().optional().openapi({ example: "60c72b2f9b1d4e4b7c8a4e4c" }), // Refers to associated Order ID
    createdAt: z.string().optional().openapi({ example: "2023-01-01T00:00:00Z" }),
    updatedAt: z.string().optional().openapi({ example: "2023-01-02T00:00:00Z" })
  });




export const productRouterRegistry = new OpenAPIRegistry();

productRouterRegistry.registerPath({
    method: 'get',
    path: '/api/products',
    description: 'Get a list of products',
    summary: 'List all products',
    tags: ["Products"],
    responses: createApiResponse(ProductSchema.array(), 'List of products'), 
});



init().then((MongoDbDataSource) => {
const productService = new ProductService(MongoDbDataSource.getRepository(Product));
const productController = new ProductController(productService);
productRouter.get("/:id", (req, res) => productController.getProductById(req, res));
productRouter.post("/", (req, res) => productController.createProduct(req, res));
productRouter.put("/", (req, res) => productController.updateProduct(req, res));
productRouter.delete("/:id", (req, res) => productController.deleteProduct(req, res));
productRouter.get("/orders/:orderId/products", productController.findProductsByOrder.bind(productController));
productRouter.get("/products/available", productController.findAvailableProducts.bind(productController));
});



export default productRouter;