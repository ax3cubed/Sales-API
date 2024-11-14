import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { Order } from "../models/order.model";
import { Messages } from "@/common/utils/messages";
import { ResponseHandler } from "@/common/utils/response-handler";

export class OrderController {
  messages : Messages<Order>;
  responseHandler: ResponseHandler<OrderController>;
    constructor(private orderService: OrderService) {
        this.messages= new Messages(new Order);
        this.responseHandler = new ResponseHandler(this); 
    }

    async createOrder(req: Request, res: Response): Promise<Response> {
        try {
            const orderData = req.body;
            const newOrder = this.orderService.createOrder(orderData)
            return this.responseHandler.handleSuccess(this.messages.CREATE_SUCCESS(), newOrder, res);
          } catch (error: any) {
            return this.responseHandler.handleError(res, error);
          
        }
    }

    async updateOrder(req: Request, res: Response): Promise<Response> {
        const orderData = req.body;  
        try {
          const orderId = new ObjectId(orderData.id);  
          const updatedOrder = await this.orderService.updateOrder({ ...orderData, id: orderId });  
          if (!updatedOrder) {
            return this.responseHandler.handleError(res, { message:  this.messages.NOT_FOUND(), statusCode: StatusCodes.NOT_FOUND });
          }
          return this.responseHandler.handleSuccess(this.messages.UPDATE_SUCCESS(), updatedOrder, res);
        } catch (error: any) {
          return this.responseHandler.handleError(res, error);
        }
      }

    async softDeleteOrder(req: Request, res: Response): Promise<Response> {
        const orderId = new ObjectId(req.params.id);
        try {
          const deletedOrder = await this.orderService.softDeleteOrder(orderId);
          if (!deletedOrder.affected) {
            return this.responseHandler.handleError(res, { message: this.messages.NOT_FOUND(), statusCode: StatusCodes.NOT_FOUND });
          }
          return this.responseHandler.handleSuccess(this.messages.DELETE_SUCCESS(), deletedOrder, res);
        } catch (error: any) {
          return this.responseHandler.handleError(res, error);
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
                return this.responseHandler.handleError(res, { message: this.messages.NOT_FOUND(), statusCode: StatusCodes.NOT_FOUND });
            }
            return this.responseHandler.handleSuccess(this.messages.FETCH_SUCCESS, order, res);    
        } catch (error : any) {
            return this.responseHandler.handleError(res, error);    
        }
    }

}