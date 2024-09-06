import { MongoDbDataSource } from "@/common/datasources";
import { Order } from "../models/order.model";
import { UpdateResult } from "typeorm";


export class OrderRepository{
    async find(): Promise<Order[]>{
        return await MongoDbDataSource.manager.find(Order, {
            order: {
                createdAt:"ASC"
            }
        })
    }


    async findById(order: Order): Promise<Order | null> {
        return await MongoDbDataSource.manager.findOneBy(Order, {
            id: order.id
        })
      }
      async save(order: Order): Promise<Order>{
        return await MongoDbDataSource.manager.create(Order,order);
      }
      async update(order: Order, id:number): Promise<UpdateResult>{
    
        return await  MongoDbDataSource.manager.update(Order, id, order);
      }
    
      async delete(id:number): Promise<void>{
        
         await  MongoDbDataSource.manager.delete(Order, id);
      }
    
}