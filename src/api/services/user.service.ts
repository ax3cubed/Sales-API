import { ObjectId, Repository } from "typeorm";
import { User } from "../models/user.model";
import { GenericRepository } from "../repositories/GenericRepository";
import { UNABLE_TO_FIND_USER } from "@/common/utils/messages";

export class UserService extends GenericRepository<User> {

  constructor(protected readonly userRepository: Repository<User>) {
    super(userRepository);
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error: any) {
      throw new Error(`Unable to retrieve users: ${error.message}`);
    }
  }

  async getUserById(id: ObjectId): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { id },
      });
    } catch (error: any) {
      throw new Error(UNABLE_TO_FIND_USER(id, error));
    }
  }

  async createUser(user: User): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (error: any) {
      throw new Error(`Unable to create user: ${error.message}`);
    }
  }

  async updateUser(user: User): Promise<User | null> {
    if (!user.id) {
      throw new Error('User ID is required to update the user.');
    }

    try {
      await this.userRepository.update(user.id, user); // Now it's safe to pass `user.id`
      return await this.getUserById(user.id);
    } catch (error: any) {
      throw new Error(`Unable to update user with ID ${user.id}: ${error.message}`);
    }
  }

  async deleteUser(id: ObjectId): Promise<void> {
    if (!id) {
      throw new Error('User ID is required to delete the user.');
    }

    try {
      const deleteResult = await this.userRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new Error(`No user found with ID ${id} to delete.`);
      }
    } catch (error: any) {
      throw new Error(`Unable to delete user with ID ${id}: ${error.message}`);
    }
  }
}
