import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { DecoratedEntity } from "./decorated.entity";
import { OrderStatus } from "../enums/order-status.enum";

@Entity()
export class Order extends DecoratedEntity {
  @Column({ type: "string" })
  @IsNotEmpty({ message: "Order number is required" })
  @IsString({ message: "Order number must be a string" })
  orderNumber?: string;

  @Column({ type: "string" })
  @IsNotEmpty({ message: "Product id is required" })
  @IsString({ message: "Product id must be a string" })
  product_id?: string;

  @Column({ type: "number" })
  @IsNotEmpty({ message: "Quantity is required" })
  @IsInt({ message: "Quantity must be an integer" })
  @IsPositive({ message: "Quantity must be a positive number" })
  quantity?: number;

  @Column({ type: "string" })
  user_id?: string;

  @Column({ type: "number" })
  @IsNotEmpty({ message: "Total price is required" })
  @IsPositive({ message: "Total price must be a positive number" })
  totalPrice?: number;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status?: OrderStatus;
}
