import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { ServiceResponse } from "@/common/dtos/service-response.dto";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { Product } from "../models/product.model";
import { Messages } from "@/common/utils/messages";
import { ResponseHandler } from "@/common/utils/response-handler";

export class ProductController {
  
  messages : Messages<Product>;
  responseHandler: ResponseHandler<ProductController>;
    constructor(private productService: ProductService) {
        this.messages= new Messages(new Product);
        this.responseHandler = new ResponseHandler(this); 
    }

    async createProduct(req: Request, res: Response): Promise<void> {
        const productData = req.body;
        try {
            const newProduct = await this.productService.createProduct(productData);
            this.responseHandler.handleSuccess(this.messages.CREATE_SUCCESS(), newProduct, res);
        } catch (error) {
          this.responseHandler.handleError(res, error);
        }
    }

    async getProductById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
          const productId = new ObjectId(id);
          const product = await this.productService.getProductById(productId);
          if (!product) {
            return this.responseHandler.handleError(res, { message: this.messages.NOT_FOUND(), statusCode: StatusCodes.NOT_FOUND });
          }
          return this.responseHandler.handleSuccess(this.messages.FETCH_SUCCESS, product, res);
        } catch (error: any) {
          return this.responseHandler.handleError(res, error);
        }
      }

    async updateProduct(req: Request, res: Response): Promise<Response> {
        const productData = req.body;
        try {
            const productId = req.params.productId;
            const updatedProduct = await this.productService.updateProduct({...productData, id: productId });
            if (!updatedProduct) {
                return this.responseHandler.handleError(res, { message:  this.messages.NOT_FOUND(), statusCode: StatusCodes.NOT_FOUND });
              }
              return this.responseHandler.handleSuccess(this.messages.UPDATE_SUCCESS(), updatedProduct, res);
            } catch (error: any) {
              return this.responseHandler.handleError(res, error);
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
          const productId = String(id);  
          await this.productService.deleteProduct(productId);
          return this.responseHandler.handleSuccess(this.messages.DELETE_SUCCESS(), null, res);
        } catch (error: any) {
          return this.responseHandler.handleError(res, error);
        }
    }

    async findProductsByOrder(req: Request, res: Response): Promise<Response> {
        try {
            const orderId = new ObjectId(req.params.orderId);
            const products = await this.productService.findProductsByOrder(orderId);
            
            if (products.length === 0) {
                return this.responseHandler.handleError(res, { message: this.messages.NOT_FOUND(), statusCode: StatusCodes.NOT_FOUND });
            }
            
            return this.responseHandler.handleSuccess(this.messages.FETCH_SUCCESS, products, res);
        } catch (error: any) {
            return this.responseHandler.handleError(res, error);
        }
    }

    async findAvailableProducts(req: Request, res: Response): Promise<Response> {
        try {
            const products = await this.productService.findAvailableProducts();
            
            return this.responseHandler.handleSuccess(this.messages.FETCH_SUCCESS, products, res);
        } catch (error: any) {
            return this.responseHandler.handleError(res, error);
        }
    }
}