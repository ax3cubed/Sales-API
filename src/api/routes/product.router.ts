import { Router } from "express";
import { ProductService } from "../services/product.service";
import { MongoDbDataSource } from "@/common/datasources";
import { Product } from "../models/product.model";
import { ProductController } from "../controller/product.controller";


const productRouter = Router();
const productService = new ProductService(MongoDbDataSource.getRepository(Product));
const productController = new ProductController(productService);

productRouter.get("/:id", (req, res) => productController.getProductById(req, res));
productRouter.post("/", (req, res) => productController.createProduct(req, res));
productRouter.put("/", (req, res) => productController.updateProduct(req, res));
productRouter.delete("/:id", (req, res) => productController.deleteProduct(req, res));
productRouter.get("/orders/:orderId/products", productController.findProductsByOrder.bind(productController));
productRouter.get("/products/available", productController.findAvailableProducts.bind(productController));

export default productRouter;