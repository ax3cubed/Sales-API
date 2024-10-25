import type { ObjectId } from "mongodb";
import type { Repository, UpdateResult } from "typeorm";
import { Order } from "../models/order.model";
import { GenericRepository } from "../repositories/GenericRepository";
import { validateOrder } from "./service.validators/order.validators";
export class OrderService extends GenericRepository<Order> {
  constructor(protected readonly orderRepository: Repository<Order>) {
    super(orderRepository);
  }

  async createOrder(order: Order): Promise<Order> {
    try {
      return this.orderRepository.save(order);
    } catch (error: any) {
      throw new Error(`Unable to create order: ${error.message}`);
    }
  }

  async updateOrder(order: Order): Promise<Order | null> {
    if (!validateOrder(order)) {
      throw new Error("Unable to create order: Valiation failed");
    }
    if (!order?.id) {
      throw new Error("Order ID is required to update the user.");
    }
    await this.orderRepository.update(order.id, order);
    return await this.findOrderById(order.id);
  }

  async softDeleteOrder(id: ObjectId): Promise<UpdateResult> {
    const orderToDelete = new Order();
    orderToDelete.id = id;
    orderToDelete.softDeleted = true;
    return this.orderRepository.update(orderToDelete.id, orderToDelete);
  }

  async findOrderById(id: ObjectId): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: {
        id: id,
      },
    });
  }
}
