import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { handleError, handleSuccess } from "@/common/utils/http-handlers";
import { ServiceResponse } from "@/common/dtos/service-response.dto";
import { CREATE_SUCCESS, DELETE_SUCCESS, FETCH_SUCCESS, NOT_FOUND, UPDATE_SUCCESS } from "@/common/utils/messages";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "typeorm";
import { Order } from "../models/order.model";

export class OrderController {
    constructor(private orderService: OrderService) {}

    async createOrder(req: Request, res: Response): Promise<Response> {
        try {
            const orderData = req.body;
            const newOrder = this.orderService.createOrder(orderData)
            return handleSuccess(CREATE_SUCCESS(Order), newOrder, res)
        } catch (error: any) {
           return handleError(res, error);
        }
    }

    async updateOrder(req: Request, res: Response): Promise<Response> {
        const orderData = req.body;  
        try {
          const orderId = new ObjectId(orderData.id);  
          const updatedOrder = await this.orderService.updateOrder({ ...orderData, id: orderId });  
          if (!updatedOrder) {
            return handleError(res, { message:  NOT_FOUND(Order), statusCode: StatusCodes.NOT_FOUND });
          }
          return handleSuccess(UPDATE_SUCCESS(Order), updatedOrder, res);
        } catch (error: any) {
          return handleError(res, error);
        }
      }

    async softDeleteOrder(req: Request, res: Response): Promise<Response> {
        const orderId = new ObjectId(req.params.id);
        try {
          const deletedOrder = await this.orderService.softDeleteOrder(orderId);
          if (!deletedOrder.affected) {
            return handleError(res, { message: NOT_FOUND(Order), statusCode: StatusCodes.NOT_FOUND });
          }
          return handleSuccess(DELETE_SUCCESS(Order), deletedOrder, res);
        } catch (error: any) {
          return handleError(res, error);
        }
    }

    // async softDeleteOrder(req: Request, res: Response): Promise<Response> {
    //     const { id } = req.params;
    //     try {
    //       const orderId = new ObjectId(id);
    //       await this.orderService.softDeleteOrder(orderId);
    //       return handleSuccess(DELETE_SUCCESS(Order), null, res);
    //     } catch (error: any) {
    //       return handleError(res, error);
    //     }
    // }

    async findOrderById(req: Request, res: Response): Promise<Response> {
        try {
            const orderId = new ObjectId(req.params.id);
            const order = await this.orderService.findOrderById(orderId);
            if (!order) {
                return handleError(res, { message: NOT_FOUND(Order), statusCode: StatusCodes.NOT_FOUND });
            }
            return handleSuccess(FETCH_SUCCESS, order, res);    
        } catch (error : any) {
            return handleError(res, error);    
        }
    }

}