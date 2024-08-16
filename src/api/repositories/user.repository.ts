import { MongoDbDataSource } from "@/common/datasources";
import { User } from "../models/user.model";


export class UserRepository {
    async getAllUsers(): Promise<User[]> {
        return await MongoDbDataSource.manager.find(User);
        
    }
}
