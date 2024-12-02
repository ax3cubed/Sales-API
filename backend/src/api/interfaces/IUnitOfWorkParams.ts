import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { Sales } from "../models/sales.model";
import { User } from "../models/user.model";
import { IRepository } from "./IRepository";
import {   type Repository } from "typeorm";
export interface IUnitOfWorkParams {
    salesRepository: Repository<Sales>;
    userRepository: Repository<User>;
    productRepository: Repository<Product>;
    orderRepository: Repository<Order>;
}