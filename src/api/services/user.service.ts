
import type { ObjectId, Repository } from "typeorm";
import { User } from "../models/user.model";
import { GenericRepository } from "../repositories/GenericRepository";
import { ApiError } from "@/common/dtos/api-error";
import { ApiLogger } from "@/common/dtos/api-logger";
import { Messages } from "@/common/utils/messages";

export class UserService extends GenericRepository<User> {
  private logger: ApiLogger<UserService>;
  private messages: Messages<UserService>;

 
  constructor(protected readonly userRepository: Repository<User>) {
    super(userRepository);
    this.logger = new ApiLogger(this);
    this.messages = new Messages(this);
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error: any) {
     
      throw new ApiError<User>(this.messages.UNABLE_TO_RETRIEVE_ENTITY(error),new User(), error);
    }
  }

  async getUserById(id: ObjectId): Promise<User | null> {
    try {
      return await this.userRepository.findOneBy({
         id: id,
      });
    } catch (error: any) {
      throw new ApiError<User>(this.messages.UNABLE_TO_FIND_ENTITY(id, error),new User(), error);
    }
  }

  async createUser(user: User): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (error: any) {
      throw new ApiError<User>(this.messages.UNABLE_TO_CREATE_ENTITY(error),new User(), error);
    }
  }

  async updateUser(user: User): Promise<User | null> {
    if (!user.id) {
      throw new ApiError<User>(this.messages.ENTITY_ID_REQUIRED_TO_UPDATE(), new User(),null);
    }

    try {
      await this.userRepository.update(user.id, user); // Now it's safe to pass `user.id`
      return await this.getUserById(user.id);
    } catch (error: any) {
      throw new ApiError<User>(this.messages.UNABLE_TO_UPDATE_ENTITY(user.id,error),error);
    }
  }

  async deleteUser(id: ObjectId): Promise<void> {
    if (!id) {
      throw new ApiError<User>(this.messages.ENTITY_ID_REQUIRED_TO_DELETE(),new User(),null)
       
    }

    try {
      const deleteResult = await this.userRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new ApiError<User>(this.messages.NO_ENTITY_FOUND_TO_DELETE(id),new User(),null);
      }
    } catch (error: any) {
      throw new ApiError<User>(this.messages.UNABLE_TO_DELETE_ENTITY(id,error), new User(),error)
    }
  }
}
