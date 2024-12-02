import { Router } from "express";
import { ProductService } from "../services/product.service";
import { Product } from "../models/product.model";
import { ProductController } from "../controller/product.controller";
import { getDataSource } from "@/common/datasources/MongoDbDataSource";
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z, ZodTypeAny } from "zod";
import { createApiRequest, createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { mergeRecordObjects } from "@/common/utils/utils";
import { StatusCodes } from "http-status-codes";

extendZodWithOpenApi(z);

type OpenAPISchemaType = ZodTypeAny;

const init = async () => {
  return await getDataSource();
};
const productRouter = Router();

const ProductSchema = z.object({
  id: z.string().optional().openapi({ example: "60c72b2f9b1d4e4b7c8a4e4d" }),
  name: z
    .string()
    .min(1, { message: "Product name is required" })
    .openapi({ example: "Sample Product" }),
  description: z
    .string()
    .min(1, { message: "Product description is required" })
    .openapi({ example: "A high-quality product." }),
  price: z
    .number()
    .positive({ message: "Price must be a positive number" })
    .openapi({ example: 19.99 }),
  stockQuantity: z
    .number()
    .int()
    .positive({ message: "Stock quantity must be a positive integer" })
    .openapi({ example: 100 }),
  createdAt: z.string().optional().openapi({ example: "2023-01-01T00:00:00Z" }),
  updatedAt: z.string().optional().openapi({ example: "2023-01-02T00:00:00Z" }),
});

export const productRouterRegistry = new OpenAPIRegistry();

// Registering routes in the OpenAPI registry
productRouterRegistry.registerPath({
  method: "get",
  path: "/api/products",
  summary: "Get all products",
  description: "Fetch a list of all available products",
  responses: createApiResponse(ProductSchema.array(), "List of products"),
  tags: ["Products"],
});

productRouterRegistry.registerPath({
  method: "get",
  path: "/api/products/{id}",
  summary: "Get product by ID",
  description: "Fetch a single product by its unique ID",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string",
        example: "60c72b2f9b1d4e4b7c8a4e4d",
      },
    },
  ],
  responses: mergeRecordObjects(
    createApiResponse(ProductSchema, "Object with Products data.", StatusCodes.OK),
    createApiResponse(
      ProductSchema,
      "No content - successful operation",
      StatusCodes.NO_CONTENT
    )
  ),

  tags: ["Products"],
});

productRouterRegistry.registerPath({
  method: "post",
  path: "/api/products",
  summary: "Create a new product",
  description: "Add a new product to the store",
  tags: ["Products"],
  request: {
    body:  createApiRequest(ProductSchema, "Product Create Request")
  },
  responses: mergeRecordObjects(
    createApiResponse(ProductSchema, 'Product created successfully',StatusCodes.CREATED),
    createApiResponse(ProductSchema, 'Bad Request - Invalid input',StatusCodes.BAD_REQUEST)
  )
});

productRouterRegistry.registerPath({
  method: "put",
  path: "/api/products/{id}",
  summary: "Update a product",
  description: "Update product details by ID",
  tags: ["Products"],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '60c72b2f9b1d4e4b7c8a4e4d' }),
    }),
    body:  createApiRequest(ProductSchema, "Product Update Request"),
    
  },
  responses: mergeRecordObjects(
    createApiResponse(ProductSchema, 'Product updated successfully',StatusCodes.OK),
    createApiResponse(ProductSchema, 'Product not found',StatusCodes.NOT_FOUND)
  )
});

productRouterRegistry.registerPath(
   {
    method: "delete",
    path: "/api/products/{id}",
    summary: "Delete a product",
    description: "Remove a product by its ID",
    request: {
        params: z.object({
          id: z.string().openapi({ example: '60c72b2f9b1d4e4b7c8a4e4d' }),
        }),
      },
      responses: mergeRecordObjects(
        createApiResponse(ProductSchema, 'Product deleted successfully',StatusCodes.NO_CONTENT),
        createApiResponse(ProductSchema, 'Product not found',StatusCodes.NOT_FOUND)
      ),
    tags: ["Products"],
  }
);

init().then((MongoDbDataSource) => {
  const productService = new ProductService(
    MongoDbDataSource.getMongoRepository(Product)
  );
  const productController = new ProductController(productService);
  productRouter.get("/:id", (req, res) =>
    productController.getProductById(req, res)
  );
  productRouter.post("/", (req, res) =>
    productController.createProduct(req, res)
  );
  productRouter.put("/", (req, res) =>
    productController.updateProduct(req, res)
  );
  productRouter.delete("/:id", (req, res) =>
    productController.deleteProduct(req, res)
  );

  productRouter.get(
    "/products/available",
    productController.findAvailableProducts.bind(productController)
  
  );
  productRouter.get("/",(req,res) => productController.findAll(req,res))
});

export default productRouter;
