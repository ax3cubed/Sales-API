import type { Repository } from "typeorm";
import { User } from "../models/user.model";
import { GenericRepository } from "../repositories/GenericRepository";
import { ApiError } from "@/common/dtos/api-error";
import { Messages } from "@/common/utils/messages";
import { ObjectId } from "mongodb";
import { UnitOfWork } from "../repositories/UnitOfWork";

export class UserService   {
  private messages: Messages<User>;
  private  userRepository: Repository<User>

  constructor(unitOfWork: UnitOfWork) {
    this.userRepository = unitOfWork.getUserRepository();

    this.messages = new Messages(new User());
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error: any) {
      throw new ApiError<User>(
        this.messages.UNABLE_TO_RETRIEVE_ENTITY(error),
        new User(),
        error
      );
    }
  }

  async getUserById(id: ObjectId): Promise<User | null> {
    try {
      console.log("Searching for user with id:", id);
      const user = await this.userRepository.findOneBy({ _id:id });
      console.log("User found:", user);
      return user;
    } catch (error: any) {
      throw new ApiError<User>(
        this.messages.UNABLE_TO_FIND_ENTITY(id, error),
        new User(),
        error
      );
    }
  }

  async createUser(user: User): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (error: any) {
      throw new ApiError<User>(
        this.messages.UNABLE_TO_CREATE_ENTITY(error),
        new User(),
        error
      );
    }
  }

  async updateUser(user: User): Promise<User | null> {
    if (!user._id) {
      throw new ApiError<User>(
        this.messages.ENTITY_ID_REQUIRED_TO_UPDATE(),
        new User(),
        null
      );
    }

    try {
      await this.userRepository.save(user); // Now it's safe to pass `user._id`
      if (!user._id) {
        throw new ApiError<User>(
          this.messages.ENTITY_ID_REQUIRED_TO_UPDATE(),
          new User(),
          null
        );
      }
      return await this.getUserById(user._id);
    } catch (error: any) {
      throw new ApiError<User>(
        this.messages.UNABLE_TO_UPDATE_ENTITY(user._id, error),
        error
      );
    }
  }

  async deleteUser(id: ObjectId): Promise<void> {
    if (!id) {
      throw new ApiError<User>(
        this.messages.ENTITY_ID_REQUIRED_TO_DELETE(),
        new User(),
        null
      );
    }

    try {
      const deleteResult = await this.userRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new ApiError<User>(
          this.messages.NO_ENTITY_FOUND_TO_DELETE(id),
          new User(),
          null
        );
      }
    } catch (error: any) {
      throw new ApiError<User>(
        this.messages.UNABLE_TO_DELETE_ENTITY(id, error),
        new User(),
        error
      );
    }
  }
}
