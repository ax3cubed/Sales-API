import { ObjectId, UpdateResult } from "typeorm";
import { User } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { GenericRepository } from "../repositories/GenericRepository";
import { MongoDbDataSource } from "@/common/datasources";

export class UserService {
  private userRepository: GenericRepository<User>;

  /**
   *
   */
  constructor() {
    this.userRepository = new GenericRepository<User>(
      MongoDbDataSource.getRepository(User)
    );
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error: any) {
      throw new Error(`unable to ertriee users: ${error.message}`);
    }
  }

  async getUserById(id: ObjectId): Promise<User | null> {
    try {
      const user = new User();
      user.id = id;
      return await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
    } catch (error: any) {
      throw new Error(`Unable to find user with id ${id}: ${error.message}`);
    }
  }
  async createUser(user: User): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (error: any) {
      throw new Error(`Unable to create user: ${error.message}`);
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      return await this.userRepository.update(user);
    } catch (error: any) {
      throw new Error(`Unable to update user with id ${user.id}: ${error.message}`);
    }
  }
  async deleteUser(id: number): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error: any) {
      throw new Error(`Unable to delete user with id ${id}: ${error.message}`);
    }
  }
}
