import { Repository } from "typeorm";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { Sales } from "../models/sales.model";
import { User } from "../models/user.model";
import { IRepository } from "./IRepository";

export interface IUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getSalesRepository(): Repository<Sales>;
  getUserRepository(): Repository<User>;
  getProductRepository(): Repository<Product>;
  getOrderRepository(): Repository<Order>;
}
