import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { handleError, handleSuccess } from "@/common/utils/http-handlers";
import { ServiceResponse } from "@/common/dtos/service-response.dto";
import { CREATE_SUCCESS, DELETE_SUCCESS, FETCH_SUCCESS, NOT_FOUND, UPDATE_SUCCESS } from "@/common/utils/messages";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "typeorm";
import { Product } from "../models/product.model";

export class ProductController {
    constructor(private productService: ProductService) {}

    async createProduct(req: Request, res: Response): Promise<void> {
        const productData = req.body;
        try {
            const newProduct = await this.productService.createProduct(productData);
            handleSuccess(CREATE_SUCCESS(Product), newProduct, res);
        } catch (error) {
            handleError(res, error);
        }
    }

    async getProductById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
          const productId = new ObjectId(id);
          const product = await this.productService.getProductById(productId);
          if (!product) {
            return handleError(res, { message: NOT_FOUND(Product), statusCode: StatusCodes.NOT_FOUND });
          }
          return handleSuccess(FETCH_SUCCESS, product, res);
        } catch (error: any) {
          return handleError(res, error);
        }
      }

    async updateProduct(req: Request, res: Response): Promise<Response> {
        const productData = req.body;
        try {
            const productId = req.params.productId;
            const updatedProduct = await this.productService.updateProduct({...productData, id: productId });
            if (!updatedProduct) {
                return handleError(res, { message:  NOT_FOUND(Product), statusCode: StatusCodes.NOT_FOUND });
              }
              return handleSuccess(UPDATE_SUCCESS(Product), updatedProduct, res);
            } catch (error: any) {
              return handleError(res, error);
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
          const productId = String(id);  
          await this.productService.deleteProduct(productId);
          return handleSuccess(DELETE_SUCCESS(Product), null, res);
        } catch (error: any) {
          return handleError(res, error);
        }
    }

    async findProductsByOrder(req: Request, res: Response): Promise<Response> {
        try {
            const orderId = new ObjectId(req.params.orderId);
            const products = await this.productService.findProductsByOrder(orderId);
            
            if (products.length === 0) {
                return handleError(res, { message: NOT_FOUND('Order or products'), statusCode: StatusCodes.NOT_FOUND });
            }
            
            return handleSuccess(FETCH_SUCCESS, products, res);
        } catch (error: any) {
            return handleError(res, error);
        }
    }

    async findAvailableProducts(req: Request, res: Response): Promise<Response> {
        try {
            const products = await this.productService.findAvailableProducts();
            
            return handleSuccess(FETCH_SUCCESS, products, res);
        } catch (error: any) {
            return handleError(res, error);
        }
    }
}