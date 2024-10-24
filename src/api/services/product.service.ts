import { DeleteResult, FindOneOptions, Repository, ObjectId, MoreThan } from "typeorm";
import { Product } from "@/api/models/product.model";
import { GenericRepository } from "@/api/repositories/GenericRepository";
import { UNABLE_TO_FIND_PRODUCT, UNABLE_TO_FIND_USER } from "@/common/utils/messages";

export class ProductService extends GenericRepository<Product> {
  constructor(protected readonly productRepository: Repository<Product>) {
    super(productRepository);
  }

  async createProduct(product: Product): Promise<Product> {
    // You can add extra business logic here before saving, e.g., validation or default settings.
    try{
      return await this.save(product);
    } catch (error: any) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  async getProductById(id: ObjectId): Promise<Product | null> {
    try {
      return await this.productRepository.findOne({
        where: { id },
      });
    } catch (error: any) {
      throw new Error(UNABLE_TO_FIND_PRODUCT(id, error));
    }
  }

  async updateProduct(product: Product): Promise<Product | null> {
    if (!product.id) {
      throw new Error('Product ID is required to update the product.');
    }

    try {
      await this.productRepository.update(product.id, product);
      return await this.getProductById(product.id);
    } catch (error: any) {
      throw new Error(`Unable to update user with ID ${product.id}: ${error.message}`);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const deleteResult = await this.delete(productId);

    if (deleteResult.affected === 0) {
      throw new Error(`Product with ID ${productId} could not be deleted.`);
    }
  }

  // Example of finding products by order
  async findProductsByOrder(orderId: ObjectId): Promise<Product[]> {
    return await this.repository.find({ where: { order: { id: orderId } } });
  }
  
  async findAvailableProducts(): Promise<Product[]> {
    return await this.repository.find({
      where: {
        stockQuantity: MoreThan(0)
      },
    });
  }
}
