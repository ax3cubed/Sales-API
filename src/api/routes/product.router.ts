import { Router } from "express";
import { ProductService } from "../services/product.service";
import { Product } from "../models/product.model";
import { ProductController } from "../controller/product.controller";
import { getDataSource } from "@/common/datasources/MongoDbDataSource";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z, ZodTypeAny } from "zod";
import { OpenAPIV3 } from 'openapi-types';
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

extendZodWithOpenApi(z);

type OpenAPISchemaType = ZodTypeAny;

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

  interface RouteConfig {
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    path: string;
    summary: string;
    description: string;
    schema: z.ZodTypeAny;
    tags: string[];
  }


export const productRouterRegistry = new OpenAPIRegistry();

function generateApiResponse(
    schema: OpenAPISchemaType,
    description: string = 'Successful operation'
  ): Record<number, OpenAPIV3.ResponseObject> {
    return {
      200: {
        description,
        content: {
          'application/json': {
            schema: schema.openapi({}) as unknown as OpenAPIV3.SchemaObject,
        },
      },
    },
    400: { description: 'Bad request' },
    404: { description: 'Not found' },
  };
}
  
  // Define the type for the request body structure
  function createRequestBody(
    schema: OpenAPISchemaType
  ): OpenAPIV3.RequestBodyObject {
    return {
      required: true,
      content: {
        'application/json': {
            schema: schema.openapi({}) as unknown as OpenAPIV3.SchemaObject,
        },
      },
    };
  }
  
  // Abstract route configuration function
  function createRouteConfig(config: RouteConfig) {
    return {
      method: config.method,
      path: config.path,
      summary: config.summary,
      description: config.description,
      tags: config.tags,
      responses: createApiResponse(config.schema, config.summary),
    };
  }
  
  // Registering routes in the OpenAPI registry
  productRouterRegistry.registerPath(createRouteConfig({
    method: 'get',
    path: '/api/products',
    summary: 'Get all products',
    description: 'Fetch a list of all available products',
    schema: ProductSchema.array(),
    tags: ['Products'],
  }));
  
  productRouterRegistry.registerPath(createRouteConfig({
    method: 'get',
    path: '/api/products/{id}',
    summary: 'Get product by ID',
    description: 'Fetch a single product by its unique ID',
    schema: ProductSchema,
    tags: ['Products'],
  }));
  
  productRouterRegistry.registerPath({
    method: 'post',
    path: '/api/products',
    summary: 'Create a new product',
    description: 'Add a new product to the store',
    tags: ['Products'],
    requestBody: createRequestBody(ProductSchema),
    responses: createApiResponse(ProductSchema, 'Product created successfully'),
  });
  
  productRouterRegistry.registerPath({
    method: 'put',
    path: '/api/products/{id}',
    summary: 'Update a product',
    description: 'Update product details by ID',
    tags: ['Products'],
    requestBody: createRequestBody(ProductSchema),
    responses: createApiResponse(ProductSchema, 'Product updated successfully'),
  });
  
  productRouterRegistry.registerPath(createRouteConfig({
    method: 'delete',
    path: '/api/products/{id}',
    summary: 'Delete a product',
    description: 'Remove a product by its ID',
    schema: z.object({ message: z.string().openapi({ example: "Product deleted successfully" }) }),
    tags: ['Products'],
  }));
  

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