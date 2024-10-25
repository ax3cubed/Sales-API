import  { Product } from "@/api/models/product.model";
import { GenericRepository } from "@/api/repositories/GenericRepository";
import type { ObjectId } from "mongodb";
import { Messages } from "@/common/utils/messages";
import { DeleteResult, FindOneOptions, MoreThan, type Repository } from "typeorm";
import { ApiLogger } from "@/common/dtos/api-logger";
import { ApiError } from "@/common/dtos/api-error";

export class ProductService extends GenericRepository<Product> {
  private messages: Messages<ProductService>;
  private logger: ApiLogger<ProductService>;
  constructor(protected readonly productRepository: Repository<Product>) {
   
    super(productRepository);
    this.logger = new ApiLogger(this);
    this.messages = new Messages(this);
  }

  async createProduct(product: Product): Promise<Product> {
    // You can add extra business logic here before saving, e.g., validation or default settings.
    try{
      return await this.save(product);
    } catch (error: any) {
      throw new ApiError<Product>(this.messages.UNABLE_TO_CREATE_ENTITY(error),new Product(), error);
    }
  }

  async getProductById(id: ObjectId): Promise<Product | null> {
    try {
      return await this.productRepository.findOne({
        where: { id },
      });
    } catch (error: any) {
      throw new Error(this.messages.UNABLE_TO_FIND_ENTITY(id, error));
    }
  }

  async updateProduct(product: Product): Promise<Product | null> {
    if (!product.id) {
      throw new ApiError<Product>(this.messages.ENTITY_ID_REQUIRED_TO_UPDATE(),new Product(), null);
    }

    try {
      await this.productRepository.update(product.id, product);
      return await this.getProductById(product.id);
    } catch (error: any) {
      throw new ApiError<Product>(this.messages.UNABLE_TO_UPDATE_ENTITY(product.id, error),new Product(), error);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const deleteResult = await this.delete(productId);

    if (deleteResult.affected === 0) {
      throw new ApiError<Product>(this.messages.UNABLE_TO_DELETE_ENTITY(productId, null),new Product(), null);
    }
  }

  // Example of finding products by order
  async findProductsByOrder(orderId: ObjectId): Promise<Product[]> {
    return await this.repository.find({ where: { order: { id: orderId } } });
  }

  async findAvailableProducts(): Promise<Product[]> {
    return await this.repository.find({
      where: {
        stockQuantity: MoreThan(0),
      },
    });
  }
}
