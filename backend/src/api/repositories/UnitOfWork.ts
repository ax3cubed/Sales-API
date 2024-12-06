import { Messages } from "@/common/utils/messages";
import { IRepository } from "../interfaces/IRepository";
import { IUnitOfWork } from "../interfaces/IUnitOfWork";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { Sales } from "../models/sales.model";
import { User } from "../models/user.model";
import { ApiError } from "@/common/dtos/api-error";
import { ApiLogger } from "@/common/dtos/api-logger";
import { IUnitOfWorkParams } from "../interfaces/IUnitOfWorkParams";
import { Repository } from "typeorm";
import { th } from "@faker-js/faker/.";


export class UnitOfWork implements IUnitOfWork {
  private salesRepository: Repository<Sales>;
  private userRepository: Repository<User>;
  private productRepository: Repository<Product>;
  private orderRepository: Repository<Order>;
  private logger: ApiLogger<UnitOfWork>;

  private TransactionStarted = false;

  private transaction: any = null;

  constructor(
    params:IUnitOfWorkParams
  ) {
    this.salesRepository = params.salesRepository;
    this.userRepository = params.userRepository;
    this.productRepository = params.productRepository;
    this.orderRepository = params.orderRepository;
    this.logger = new ApiLogger(UnitOfWork);  
  }

  async begin(): Promise<void> {
    this.logger.logInfo("Transaction Started")
    this.TransactionStarted = true;

  }

  async commit(): Promise<void> {
      // In a memory implementation, commit doesn't do anything
      this.logger.logInfo("Transaction Committed");
      if(this.TransactionStarted){
        this.transaction 
      }else{
        this.logger.logError("Transaction not started");
      }
      this.transaction = null;

  }

  async rollback(): Promise<void> {
       // In a memory implementation, rollback doesn't do anything
       this.logger.logInfo("Transaction Committed");
        this.transaction = null;
  }

  getSalesRepository(): Repository<Sales> {
    return this.salesRepository;
  }

  getUserRepository(): Repository<User> {
    return this.userRepository;
  }

  getProductRepository(): Repository<Product> {
    return this.productRepository;
  }

  getOrderRepository(): Repository<Order> {
    return this.orderRepository;
  }
}
