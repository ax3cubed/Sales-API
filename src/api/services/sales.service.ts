import { ObjectId, Repository, UpdateResult } from "typeorm";
import { Sales } from "../models/sales.model";
import { GenericRepository } from "../repositories/GenericRepository";
import { MongoDbDataSource } from "@/common/datasources";

export class SalesService extends GenericRepository<Sales> {
 
  /**
   *
   */
  constructor(protected readonly salesRepository: Repository<Sales>) {
    super(salesRepository);
  }

  async getAllSales(): Promise<Sales[]> {
    try {
      return await this.salesRepository.find();
    } catch (error: any) {
      throw new Error(`unable to ertriee saless: ${error.message}`);
    }
  }

  async getSalesById(id: ObjectId): Promise<Sales | null> {
    try {
      const sales = new Sales();
      sales.id = id;
      return await this.salesRepository.findOne({
        where: {
          id: id,
        },
      });
    } catch (error: any) {
      throw new Error(`Unable to find sales with id ${id}: ${error.message}`);
    }
  }
  async createSales(sales: Sales): Promise<Sales> {
    try {
      return await this.salesRepository.save(sales);
    } catch (error: any) {
      throw new Error(`Unable to create sales: ${error.message}`);
    }
  }

  async updateSales(sales: Sales): Promise<Sales | null> {
    if (!sales.id) {
      throw new Error('User ID is required to update the user.');
    }
    try {
       await this.salesRepository.update(sales.id, sales);

       return await this.getSalesById(sales.id);
    } catch (error: any) {
      throw new Error(`Unable to update sales with id ${sales.id}: ${error.message}`);
    }
  }
  async deleteSales(id: number): Promise<void> {
    try {
      await this.salesRepository.delete(id);
    } catch (error: any) {
      throw new Error(`Unable to delete sales with id ${id}: ${error.message}`);
    }
  }
}
