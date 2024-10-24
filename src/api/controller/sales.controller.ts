import { Request, Response } from "express";
import { SalesService } from "../services/sales.service";
import { handleError, handleSuccess } from "@/common/utils/http-handlers";
import { ServiceResponse } from "@/common/dtos/service-response.dto";
import { CREATE_SUCCESS, DELETE_SUCCESS, FETCH_SUCCESS, NOT_FOUND, UPDATE_SUCCESS } from "@/common/utils/messages";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "typeorm";
import { Sales } from "../models/sales.model";

export class SalesController {
    constructor(private salesService: SalesService) {}

    async getAllSales(req: Request, res: Response): Promise<Response> {
        try {
            const sales = await this.salesService.getAllSales();
            return handleSuccess(FETCH_SUCCESS, sales, res);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getSalesById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const salesId = new ObjectId(id);
            const sales = await this.salesService.getSalesById(salesId);
            if (!sales) {
                return handleError(res, { message: NOT_FOUND(Sales), statusCode: StatusCodes.NOT_FOUND });
            }
            return handleSuccess(FETCH_SUCCESS, sales, res);
        }   catch (error: any){
            return handleError(res, error);
        }
    }

    async createSales(req: Request, res: Response): Promise<Response> {
        const salesData = req.body;
        try {
            const newSales = await this.salesService.createSales(salesData);
            return handleSuccess(CREATE_SUCCESS(Sales), newSales, res);
            } catch (error: any) {
            return handleError(res, error);
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
              return handleError(res, { message:  NOT_FOUND(Sales), statusCode: StatusCodes.NOT_FOUND });
            }
            return handleSuccess(UPDATE_SUCCESS(Sales), updatedSales, res);
          } catch (error: any) {
            return handleError(res, error);
          }
    }

    async deleteSales(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
          const salesId = Number(id);  
          await this.salesService.deleteSales(salesId);
          return handleSuccess(DELETE_SUCCESS(Sales), null, res);
        } catch (error: any) {
          return handleError(res, error);
        }
      }
}