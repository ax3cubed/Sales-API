import { MongoDbDataSource } from "@/common/datasources";
import { Product } from "../models/product.model";

export class ProductService {
  async createProduct(product: Product): Promise<Product> {
    return await MongoDbDataSource.manager.save(Product, product);
  }

  async updateProduct(product: Product): Promise<Product | null> {
    const existingProduct = await this.findProductById(product.id);
    if (!existingProduct) {
      throw new Error(`Product with ID ${product.id} not found`);
    }

    return await MongoDbDataSource.manager.save(Product, product);
  }

  async deleteProduct(id: number): Promise<void> {
    await MongoDbDataSource.manager.delete(Product, id);
  }

  async findProductById(id: number): Promise<Product | null> {
    return await MongoDbDataSource.manager.findOneBy(Product, { id });
  }

  async findAllProducts(): Promise<Product[]> {
    return await MongoDbDataSource.manager.find(Product);
  }
}
