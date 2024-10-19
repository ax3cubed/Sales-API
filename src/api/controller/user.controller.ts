import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { handleError, handleSuccess } from "@/common/utils/http-handlers";
import { ServiceResponse } from "@/common/dtos/service-response.dto";
import { CREATE_SUCCESS, DELETE_SUCCESS, FETCH_SUCCESS, NOT_FOUND, UPDATE_SUCCESS } from "@/common/utils/messages";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "typeorm";
import { User } from "../models/user.model";

export class UserController {
  constructor(private userService: UserService) {}

  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userService.getAllUsers();    
       return handleSuccess(FETCH_SUCCESS,users,res)
    } catch (error: any) {
     return handleError(res, error)
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const userId = new ObjectId(id);
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return handleError(res, { message: NOT_FOUND(User), statusCode: StatusCodes.NOT_FOUND });
      }
      return handleSuccess(FETCH_SUCCESS, user, res);
    } catch (error: any) {
      return handleError(res, error);
    }
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    const userData = req.body;
    try {
      const newUser = await this.userService.createUser(userData);
      return handleSuccess(CREATE_SUCCESS(User), newUser, res);
    } catch (error: any) {
      return handleError(res, error);
    }
  }
  async updateUser(req: Request, res: Response): Promise<Response> {
    const userData = req.body;  
    try {
      const userId = new ObjectId(userData.id);  
      const updatedUser = await this.userService.updateUser({ ...userData, id: userId });  
      if (!updatedUser) {
        return handleError(res, { message:  NOT_FOUND(User), statusCode: StatusCodes.NOT_FOUND });
      }
      return handleSuccess(UPDATE_SUCCESS(User), updatedUser, res);
    } catch (error: any) {
      return handleError(res, error);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const userId = new ObjectId(id);  
      await this.userService.deleteUser(userId);
      return handleSuccess(DELETE_SUCCESS(User), null, res);
    } catch (error: any) {
      return handleError(res, error);
    }
  }
}
