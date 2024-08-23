import { MongoDbDataSource } from "@/common/datasources";
import { User } from "../models/user.model";
import { UpdateResult } from "typeorm";

export class UserRepository {
  async find(): Promise<User[]> {
    return await MongoDbDataSource.manager.find(User, {
        order:{
            age:"ASC"
        }
    });
  }

  async findById(user: User): Promise<User | null> {
    return await MongoDbDataSource.manager.findOneBy(User, {
        id: user.id
    })
  }
  
  async save(user:User): Promise<User>{
    return await MongoDbDataSource.manager.create(User,user);
  }

  async update(user:User, id:number): Promise<UpdateResult>{
    
    return await  MongoDbDataSource.manager.update(User, id, user);
  }

  async delete(id:number): Promise<void>{
    
     await  MongoDbDataSource.manager.delete(User, id);
  }
  //TODO

  //findById /api/v1/users/{id}  --- get Req
  //save  /api/v1/users --- POST Req
  //update /api/v1/users/{id}   --- PUT Req
  //delete /api/v1/users --- delete REQ
}
