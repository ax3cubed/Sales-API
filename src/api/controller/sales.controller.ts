import { Request, Response } from "express";
import { SalesService } from "../services/sales.service";
import { ServiceResponse } from "@/common/dtos/service-response.dto";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "typeorm";
import { Sales } from "../models/sales.model";
import { ResponseHandler } from "@/common/utils/response-handler";
import { Messages } from "@/common/utils/messages";

export class SalesController {

    
  messages : Messages<Sales>;
  responseHandler: ResponseHandler<SalesController>;
    constructor(private salesService: SalesService) {
        this.messages= new Messages(new Sales);
        this.responseHandler = new ResponseHandler(this);
    }

    async getAllSales(req: Request, res: Response): Promise<Response> {
        try {
            const sales = await this.salesService.getAllSales();
            return this.responseHandler.handleSuccess(this.messages.FETCH_SUCCESS, sales, res);
        } catch (error) {
            return this.responseHandler.handleError(res, error);
        }
    }

    async getSalesById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const salesId = new ObjectId(id);
            const sales = await this.salesService.getSalesById(salesId);
            if (!sales) {
                return this.responseHandler.handleError(res, { message: this.messages.NOT_FOUND(), statusCode: StatusCodes.NOT_FOUND });
            }
            return this.responseHandler.handleSuccess(this.messages.FETCH_SUCCESS, sales, res);
        }   catch (error: any){
            return this.responseHandler.handleError(res, error);
        }
    }

    async createSales(req: Request, res: Response): Promise<Response> {
        const salesData = req.body;
        try {
            const newSales = await this.salesService.createSales(salesData);
            return this.responseHandler.handleSuccess(this.messages.CREATE_SUCCESS(), newSales, res);
            } catch (error: any) {
            return this.responseHandler.handleError(res, error);
        }
        // const { quantitySold, totalPrice } = req.body;
        // try {
        //     const newSales = new Sales();
        //     newSales.quantitySold = quantitySold;
        //     newSales.totalPrice = totalPrice;
        //     const createdSales = await this.salesService.createSales(newSales);
        //     return handleSuccess(CREATE_SUCCESS(Sales), createdSales, res);
        // } catch (error) {
        //     return handleError(res, error);
        // }
    }

    async updateSales(req: Request, res: Response): Promise<Response> {
        const salesData = req.body;
        try {
            const salesId = new ObjectId(salesData.id);  
            const updatedSales = await this.salesService.updateSales({ ...salesData, id: salesId });  
            if (!updatedSales) {
              return this.responseHandler.handleError(res, { message:  this.messages.NOT_FOUND(), statusCode: StatusCodes.NOT_FOUND });
            }
            return this.responseHandler.handleSuccess(this.messages.UPDATE_SUCCESS(), updatedSales, res);
          } catch (error: any) {
            return this.responseHandler.handleError(res, error);
          }
    }

    async deleteSales(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
          const salesId = Number(id);  
          await this.salesService.deleteSales(salesId);
          return this.responseHandler.handleSuccess(this.messages.DELETE_SUCCESS(), null, res);
        } catch (error: any) {
          return this.responseHandler.handleError(res, error);
        }
      }
}