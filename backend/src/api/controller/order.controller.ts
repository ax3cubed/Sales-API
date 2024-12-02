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
        const {id} = req.params;
        try {
          const orderId = new ObjectId(orderData._id);  
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
      const {id} = req.params;
        const orderId = new ObjectId(id);
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

 

    async findOrderById(req: Request, res: Response): Promise<Response> {
      const {id} = req.params;
        try {
            const orderId = new ObjectId(id);
            const order = await this.orderService.findOrderById(orderId);
            if (!order) {
                return this.responseHandler.handleError(res, { message: this.messages.NOT_FOUND(), statusCode: StatusCodes.NOT_FOUND });
            }
            return this.responseHandler.handleSuccess(this.messages.FETCH_SUCCESS, order, res);    
        } catch (error : any) {
            return this.responseHandler.handleError(res, error);    
        }
    }

    async findOrdersByOrderNumber(req: Request, res: Response): Promise<Response> {
      try {
          const orderNumber = req.params.orderNumber;
          const order = await this.orderService.findOrdersByOrderNumber(orderNumber)
          if (!order) {
              return this.responseHandler.handleError(res, { message: this.messages.NOT_FOUND(), statusCode: StatusCodes.NOT_FOUND });
          }
          return this.responseHandler.handleSuccess(this.messages.FETCH_SUCCESS, order, res);    
      } catch (error : any) {
          return this.responseHandler.handleError(res, error);    
      }
  }


  async findAllOrders(req: Request, res: Response): Promise<Response> {
    try {
        
        const orders = await this.orderService.findAllOrders();
  
        if (!orders) {
            return this.responseHandler.handleError(res, { message: this.messages.NOT_FOUND(), statusCode: StatusCodes.NOT_FOUND });
        }
        return this.responseHandler.handleSuccess(this.messages.FETCH_SUCCESS, orders, res);    
    } catch (error : any) {
        return this.responseHandler.handleError(res, error);    
    }
}
}