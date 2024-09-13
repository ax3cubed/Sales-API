import { MongoDbDataSource } from "@/common/datasources";
import { Order } from "../models/order.model";
import { SalesService } from "./sales.service";
import { UpdateResult } from "typeorm";
import { Sales } from "../models/sales.model"; 
import { MoreThanOrEqual } from "typeorm";
export class OrderService {
  private salesService: SalesService;

  constructor() {
    this.salesService = new SalesService();
  }

  async createOrder(order: Order): Promise<Order> {
    try {
        // Set the createdAt date to the current date/time
        order.createdAt = new Date();
        // Save the order to the database
        const createdOrder = await MongoDbDataSource.manager.save(Order, order);
        
        // After successfully saving the order, return the created order
        return createdOrder;
      } catch (error: any) {
        // Throw an error if something goes wrong
        throw new Error(`Unable to create order: ${error.message}`);
      }
  }

  /**
   * Update an existing order if created less than 15 minutes ago
   */
  async updateOrder(order: Order): Promise<Order | null> {
    const existingOrder = await this.findOrderById(order.id);
  
    if (!existingOrder) {
      throw new Error(`Order with ID ${order.id} not found`);
    }
  
    if (!existingOrder.createdAt) {
        throw new Error('Order creation time is missing.');
      }
      
    // Calculate the time difference between now and the order creation time
    const now = new Date().getTime();
    const createdAt = new Date(existingOrder.createdAt).getTime();
    const timeDifference = (now - createdAt) / (1000 * 60); // Time difference in minutes
  
    if (timeDifference > 15) {
      throw new Error('Order cannot be updated after 15 minutes of creation.');
    }
  
    return await MongoDbDataSource.manager.save(Order, order);
  }

  /**
   * Soft delete an order by marking it as deleted
   */
  async softDeleteOrder(id: number): Promise<void> {
    const order = await this.findOrderById(id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }

    order.softDeleted = true;
    await MongoDbDataSource.manager.save(Order, order);
  }

  /**
   * Find an order by ID
   */
  async findOrderById(id: number): Promise<Order | null> {
    return await MongoDbDataSource.manager.findOneBy(Order, { id, softDeleted: false });
  }
}
