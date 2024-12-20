import  { Product } from "@/api/models/product.model";
import { GenericRepository } from "@/api/repositories/GenericRepository";
import type { ObjectId } from "mongodb";
import { Messages } from "@/common/utils/messages";
import {   MoreThan, type Repository } from "typeorm";
import { ApiLogger } from "@/common/dtos/api-logger";
import { ApiError } from "@/common/dtos/api-error";
import { UnitOfWork } from "../repositories/UnitOfWork";

export class ProductService {
  private messages: Messages<ProductService>;

  private productRepository: Repository<Product>
  private logger: ApiLogger<ProductService>;
  constructor(unitOfWork: UnitOfWork) {
    this.productRepository = unitOfWork.getProductRepository();
    this.logger = new ApiLogger(this);
    this.messages = new Messages(this);
  }

  async createProduct(product: Product): Promise<Product> {
    // You can add extra business logic here before saving, e.g., validation or default settings.
    try{
      return await this.productRepository.save(product);
    } catch (error: any) {
      throw new ApiError<Product>(this.messages.UNABLE_TO_CREATE_ENTITY(error),new Product(), error);
    }
  }

  async getProductById(id: ObjectId): Promise<Product | null> {
    try {
      return await this.productRepository.findOne({
        where: { _id:id },
      });
    } catch (error: any) {
      throw new Error(this.messages.UNABLE_TO_FIND_ENTITY(id, error));
    }
  }

  async updateProduct(product: Product): Promise<Product | null> {
    if (!product._id) {
      throw new ApiError<Product>(this.messages.ENTITY_ID_REQUIRED_TO_UPDATE(),new Product(), null);
    }

    try {
      await this.productRepository.save( product);
      return await this.getProductById(product._id);
    } catch (error: any) {
      throw new ApiError<Product>(this.messages.UNABLE_TO_UPDATE_ENTITY(product._id, error),new Product(), error);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const deleteResult = await this.productRepository.delete(productId);

    if (deleteResult.affected === 0) {
      throw new ApiError<Product>(this.messages.UNABLE_TO_DELETE_ENTITY(productId, null),new Product(), null);
    }
  }



  async findAvailableProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      where: {
        stockQuantity: MoreThan(0),
      },
    });
  }

  async findAllProducts(): Promise<Product[]> {
    try {
      return await this.productRepository.find();
    } catch (error: any) {
      throw new Error(`unable to retrive products: ${error.message}`);
    }
   
  }
}
