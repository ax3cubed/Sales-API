

import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model";
import type { UserService } from "../services/user.service";
import { Messages } from "@/common/utils/messages";
import { ResponseHandler } from "@/common/utils/response-handler";
import { ObjectId } from "mongodb";

export class UserController {
   messages : Messages<User>;
   responseHandler: ResponseHandler<UserController>;
  constructor(private userService: UserService) {
    this.messages= new Messages(new User);
    this.responseHandler = new ResponseHandler(this);
  }

  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userService.getAllUsers();
      return this.responseHandler.handleSuccess(this.messages.FETCH_SUCCESS, users, res);
    } catch (error: any) {
      return this.responseHandler.handleError(res, error);
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const userId = new ObjectId(id);
      const user = await this.userService.getUserById(userId);
      if (!user) {
      return this.responseHandler.handleError(res, { message: this.messages.NOT_FOUND(), statusCode: StatusCodes.NOT_FOUND } );
      }
      return this.responseHandler.handleSuccess(this.messages.FETCH_SUCCESS, user, res);
    } catch (error: any) {
      return this.responseHandler.handleError(res, error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const userData = req.body;
    try {
      const newUser = await this.userService.createUser(userData);
      return this.responseHandler.handleSuccess(this.messages.CREATE_SUCCESS(), newUser, res);
    } catch (error: any) {
      return this.responseHandler.handleError(res, error);
    }
  }
  async updateUser(req: Request, res: Response, next:NextFunction): Promise<Response> {
    const userData = req.body;
    const {id } = req.params;
    try {
      const userId = new ObjectId(id);
      const updatedUser = await this.userService.updateUser({ ...userData, id: userId });
      if (!updatedUser) {
        return this.responseHandler.handleError(res, { message: this.messages.NOT_FOUND(), statusCode: StatusCodes.NOT_FOUND });
      }
      return this.responseHandler.handleSuccess(this.messages.UPDATE_SUCCESS(), updatedUser, res);
    } catch (error: any) {
      return this.responseHandler.handleError(res, error);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const userId = new ObjectId(id);
      await this.userService.deleteUser(userId);
      return this.responseHandler.handleSuccess(this.messages.DELETE_SUCCESS(), null, res);
    } catch (error: any) {
      return this.responseHandler.handleError(res, error);
    }
  }
}
