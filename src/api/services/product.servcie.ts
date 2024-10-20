import type { Product } from "@/api/models/product.model";
import { GenericRepository } from "@/api/repositories/GenericRepository";
import type { ObjectId } from "mongodb";
import { DeleteResult, FindOneOptions, MoreThan, type Repository } from "typeorm";

export class ProductService extends GenericRepository<Product> {
  constructor(protected readonly productRepository: Repository<Product>) {
    super(productRepository);
  }

  async createProduct(product: Product): Promise<Product> {
    // You can add extra business logic here before saving, e.g., validation or default settings.
    return await this.save(product);
  }

  async updateProduct(product: Product): Promise<Product | null> {
    const existingProduct = await this.findOne({ where: { id: product.id } });

    if (!existingProduct) {
      throw new Error(`Product with ID ${product.id} not found.`);
    }

    // Update the product and return the result
    return await this.update(product);
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
        stockQuantity: MoreThan(0),
      },
    });
  }
}
