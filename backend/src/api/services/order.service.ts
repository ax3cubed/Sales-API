import { ObjectId } from "mongodb";
import type {   Repository, UpdateResult } from "typeorm";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { GenericRepository } from "../repositories/GenericRepository";
import { Messages } from "@/common/utils/messages";
import { ApiError } from "@/common/dtos/api-error";
import { validateOrder } from "./service.validators/order.validators";
import { generateOrderNumber } from "@/common/utils/utils";
import { OrderDto } from "../dto/order.dto";
import { ProductDto } from "../dto/product.dto";
import { UnitOfWork } from "../repositories/UnitOfWork";

export class OrderService {
  private messages: Messages<Order>;
  private _productRepository: Repository<Product>;

  private _orderRepository: Repository<Order>

  constructor( unitOfWork: UnitOfWork) {
 
    this._productRepository = unitOfWork.getProductRepository();
    this._orderRepository = unitOfWork.getOrderRepository();
    this.messages = new Messages(new Order());
  }

  async createOrder(orderDto: OrderDto): Promise<Order[]> {
    try {
      
      const orderNumber = generateOrderNumber(orderDto.user_id);

      const orders: Order[] = orderDto.products.map((product: ProductDto) => {
        const order = new Order();
        order.orderNumber = orderNumber;
        order.product_id = product.product_id;
        order.quantity = product.quantity;
        order.totalPrice = product.totalPrice;
        order.user_id = orderDto.user_id;
        return order;
      });
      return await this._orderRepository.save(orders);
    } catch (error: any) {
      throw new ApiError<Order[]>(
        `Failed to create orders: ${error.message}`,
        [],
        error
      );
    }
  }

  async updateOrder(order: Order): Promise<Order | null> {
    if (!validateOrder(order)) {
      throw new ApiError<Order>(
        this.messages.ENTITY_VALIDATION_FAILED(),
        order,
        null
      );
    }

    try {
      await this._orderRepository.save(order);
      return await this.findOrderById(order._id);
    } catch (error: any) {
      throw new ApiError<Order>(
        this.messages.UNABLE_TO_UPDATE_ENTITY(order._id, error),
        order,
        error
      );
    }
  }

  async softDeleteOrder(id: ObjectId): Promise<UpdateResult> {
    if (!id) {
      throw new ApiError<Order>(
        this.messages.ENTITY_ID_REQUIRED_TO_DELETE(),
        new Order(),
        null
      );
    }

    try {
      return await this._orderRepository.update(id, { softDeleted: true });
    } catch (error: any) {
      throw new ApiError<Order>(
        this.messages.UNABLE_TO_DELETE_ENTITY(id, error),
        new Order(),
        error
      );
    }
  }

  async findOrderById(id: ObjectId): Promise<Order | null> {
    try {
      return await this._orderRepository.findOneBy({ _id: id });
    } catch (error: any) {
      throw new ApiError<Order>(
        this.messages.UNABLE_TO_FIND_ENTITY(id, error),
        new Order(),
        error
      );
    }
  }

  async findOrdersByOrderNumber(orderNumber: string): Promise<Order[]> {
    try {
      return await this._orderRepository.find({ where: { orderNumber } });
    } catch (error: any) {
      throw new ApiError<Order>(
        this.messages.UNABLE_TO_RETRIEVE_ENTITY(error),
        new Order(),
        error
      );
    }
  }

  async findAllOrders(): Promise<
    Array<{ orderNumber: string; products: any[] }>
  > {
    try {
      const orders = await this._orderRepository.find();
      if (!orders || orders.length === 0) {
        throw new ApiError<Order>(
          this.messages.NOT_FOUND(),
          new Order(),
          null
        );
      }

      const groupedOrders = orders.reduce((acc: { [key: string]: any }, order) => {
        const { orderNumber, product_id, quantity, totalPrice, user_id, ...details } = order;
        if (!orderNumber) {
          throw new ApiError<Order>(
            this.messages.INVALID_ENTITY_DATA(),
            new Order(),
            null
          );
        }

        if (!acc[orderNumber]) {
          acc[orderNumber] = {
            orderNumber,
            user_id: user_id || "",
            totalPrice: totalPrice || 0,
            products: [],
            createdAt: details.createdAt || new Date(),
            updatedAt: details.updateAt || new Date(),
          };
        }

        acc[orderNumber].products.push({ product_id, quantity, ...details });
        return acc;
      }, {});

      const result = await Promise.all(
        Object.entries(groupedOrders).map(async ([orderNumber, group]) => {
          const products = await Promise.all(
            group.products.map(async (order: { product_id: string; quantity: number }) => {
              const product = await this._productRepository.findOneBy({
                _id: new ObjectId(order.product_id),
              });

              return {
                ...product,
                quantity: order.quantity,
              };
            })
          );

          return {
            ...group,
            products,
          };
        })
      );

      return result;
    } catch (error: any) {
      throw new ApiError<Order>(
        this.messages.UNABLE_TO_RETRIEVE_ENTITY(error),
        new Order(),
        error
      );
    }
  }
}
