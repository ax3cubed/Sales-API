import { ObjectId } from "mongodb";
import type { MongoRepository, Repository, UpdateResult } from "typeorm";
import { Order } from "../models/order.model";
import { GenericRepository } from "../repositories/GenericRepository";
import { validateOrder } from "./service.validators/order.validators";
import { Messages } from "@/common/utils/messages";
import { Product } from "../models/product.model";
export class OrderService extends GenericRepository<Order> {
  private messages: Messages<Order>;
  private _productRepository: MongoRepository<Product>;
  constructor(
    protected readonly orderRepository: MongoRepository<Order>,
    protected readonly productRepository: MongoRepository<Product>
  ) {
    super(orderRepository);
    this._productRepository = productRepository;
    this.messages = new Messages(Order);
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
  
    await this.orderRepository.save(order);
    return await this.findOrderById(order._id);
  }

  async softDeleteOrder(id: ObjectId): Promise<UpdateResult> {
    const orderToDelete = new Order();
    orderToDelete._id = id;
    orderToDelete.softDeleted = true;
    return this.orderRepository.update(orderToDelete._id, orderToDelete);
  }

  async findOrderById(id: ObjectId): Promise<Order | null> {
    try {
      return await this.orderRepository.findOneBy({
        _id: id,
      });
    } catch (error: any) {
      throw new Error(this.messages.UNABLE_TO_FIND_ENTITY(id, error));
    }
  }
  async findOrdersByOrderNumber(orderNumber: string): Promise<Order[]> {
    try {
      return this.orderRepository.find({
        where: {
          orderNumber: orderNumber,
        },
      });
    } catch (error) {
      throw new Error("Error Occured while retriving");
    }
  }

  async findAllOrders(): Promise<
    Array<{ orderNumber: string; products: any[] }>
  > {
    try {
      // Step 1: Retrieve all orders from the database
      const orders = await this.orderRepository.find();

      if (!orders || orders.length === 0) {
        throw new Error("No orders found");
      }

      // Step 2: Group orders by orderNumber
      const groupedOrders = orders.reduce(
        (
          acc: Record<
            string,
            {
              orderNumber: string;
              user_id: string;
              totalPrice: number;
              products: any[];
              updateAt: Date;
              createdAt: Date;
            }
          >,
          order
        ) => {
          const {
            orderNumber,
            product_id,
            quantity,
            totalPrice,
            user_id,
            ...orderDetails
          } = order;
          if (!orderNumber) {
            throw new Error("Order number is undefined");
          }

          // Initialize the group if not present
          if (!acc[orderNumber]) {
            acc[orderNumber] = {
              orderNumber,
              user_id: user_id ?? "",
              totalPrice: totalPrice ?? 0,
              products: [],
              updateAt: orderDetails.updateAt ?? new Date(),
              createdAt: orderDetails.createdAt ?? new Date(),
            };
          }

          // Add product reference and order details to the group
          acc[orderNumber].products.push({
            product_id,
            quantity,
            ...orderDetails,
          });

          return acc;
        },
        {}
      );

      // Step 3: For each order group, fetch the product details
      const result = await Promise.all(
        Object.entries(groupedOrders).map(
          async ([
            orderNumber,
            {
              orderNumber: _orderNumber,
              user_id,
              totalPrice,
              products,
              createdAt,
              updateAt,
            },
          ]) => {
            // Get all product details for the products in this order
            const productDetails = await Promise.all(
              products.map(async (order) => {
                const product = await this.productRepository.findOneBy({
                  _id: new ObjectId(order.product_id),
                });

                // If the product exists, map the details
                return {
                  _id: product?._id,
                  name: product?.name,
                  description: product?.description,
                  price: product?.price,
                  stockQuantity: product?.stockQuantity,
                  quantity: order.quantity, // From the order
                };
              })
            );

            // Return the order with product details
            return {
              orderNumber: _orderNumber,
              products: productDetails,
              user_id,
              totalPrice,
              createdAt,
              updateAt,
            };
          }
        )
      );

      return result;
    } catch (error: any) {
      throw new Error(`Failed to retrieve orders: ${error.message}`);
    }
  }
}
