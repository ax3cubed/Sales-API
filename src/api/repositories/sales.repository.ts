import { MongoDbDataSource } from "@/common/datasources";
import { Sales } from "../models/sales.model";
import { UpdateResult, ObjectId } from "typeorm";

export class SalesRepository {

  async find(): Promise<Sales[]> {
    return await MongoDbDataSource.manager.find(Sales, {
      order: {
        createdAt: "DESC", 
      },
    });
  }


  async findById(id: ObjectId): Promise<Sales | null> {
    return await MongoDbDataSource.manager.findOneBy(Sales, {
      id: id, 
    });
  }


  async save(sales: Sales): Promise<Sales> {
    sales.createdAt = new Date(); 
    return await MongoDbDataSource.manager.save(Sales, sales);
  }

  async update(sales: Sales, id: ObjectId): Promise<UpdateResult> {
    sales.updatedAt = new Date();
    return await MongoDbDataSource.manager.update(Sales, id, sales);
  }

  async delete(id: ObjectId): Promise<void> {
    await MongoDbDataSource.manager.delete(Sales, id);
  }
}
