import type {   Repository } from "typeorm";
import { Sales } from "../models/sales.model";
import { GenericRepository } from "../repositories/GenericRepository";
import { ApiError } from "@/common/dtos/api-error";
import { Messages } from "@/common/utils/messages";
import { ObjectId } from "mongodb";
import { UnitOfWork } from "../repositories/UnitOfWork";

export class SalesService {
  private messages: Messages<Sales>;

  private salesRepository: Repository<Sales>;
  constructor(unitOfWork: UnitOfWork) {
     this.salesRepository = unitOfWork.getSalesRepository();
    this.messages = new Messages(new Sales());
  }

  async getAllSales(): Promise<Sales[]> {
    try {
      return await this.salesRepository.find();
    } catch (error: any) {
      throw new ApiError<Sales>(
        this.messages.UNABLE_TO_RETRIEVE_ENTITY(error),
        new Sales(),
        error
      );
    }
  }

  async getSalesById(id: ObjectId): Promise<Sales | null> {
    try {
      const sales = await this.salesRepository.findOneBy({ _id: id });
      return sales;
    } catch (error: any) {
      throw new ApiError<Sales>(
        this.messages.UNABLE_TO_FIND_ENTITY(id, error),
        new Sales(),
        error
      );
    }
  }

  async createSales(sales: Sales): Promise<Sales> {
    try {
      return await this.salesRepository.save(sales);
    } catch (error: any) {
      throw new ApiError<Sales>(
        this.messages.UNABLE_TO_CREATE_ENTITY(error),
        new Sales(),
        error
      );
    }
  }

  async updateSales(sales: Sales): Promise<Sales | null> {
    if (!sales._id) {
      throw new ApiError<Sales>(
        this.messages.ENTITY_ID_REQUIRED_TO_UPDATE(),
        new Sales(),
        null
      );
    }

    try {
      await this.salesRepository.save(sales);
      return await this.getSalesById(sales._id);
    } catch (error: any) {
      throw new ApiError<Sales>(
        this.messages.UNABLE_TO_UPDATE_ENTITY(sales._id, error),
        new Sales(),
        error
      );
    }
  }

  async deleteSales(id: ObjectId): Promise<void> {
    if (!id) {
      throw new ApiError<Sales>(
        this.messages.ENTITY_ID_REQUIRED_TO_DELETE(),
        new Sales(),
        null
      );
    }

    try {
      const deleteResult = await this.salesRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new ApiError<Sales>(
          this.messages.NO_ENTITY_FOUND_TO_DELETE(id),
          new Sales(),
          null
        );
      }
    } catch (error: any) {
      throw new ApiError<Sales>(
        this.messages.UNABLE_TO_DELETE_ENTITY(id, error),
        new Sales(),
        error
      );
    }
  }
}
