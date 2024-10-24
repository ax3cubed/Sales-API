import { Entity, ObjectIdColumn, Column, ObjectId, ManyToOne } from "typeorm";
import { IsNotEmpty, IsString, IsInt, IsOptional, IsPositive } from "class-validator";
import { Order } from "./order.model";
import { DecoratedEntity } from "./decorated.entity";

@Entity()
export class Product extends DecoratedEntity {
  @ObjectIdColumn()
  id?: ObjectId;

  @Column({ type:"string"})
  @IsNotEmpty({ message: "Product name is required" })
  @IsString({ message: "Product name must be a string" })
  name?: string;

  @Column({ type:"string"})
  @IsNotEmpty({ message: "Product description is required" })
  @IsString({ message: "Product description must be a string" })
  description?: string;

  @Column({type:"number"})
  @IsNotEmpty({ message: "Price is required" })
  @IsPositive({ message: "Price must be a positive number" })
  price?: number;

  @Column({type:"number"})
  @IsNotEmpty({ message: "Stock quantity is required" })
  @IsInt({ message: "Stock quantity must be an integer" })
  @IsPositive({ message: "Stock quantity must be a positive number" })
  stockQuantity?: number;

  @ManyToOne(type => Order, order => order.products)
  order? : Order;

  @Column({type:'date'})
  @IsOptional()
  createdAt?: Date;

  @Column({type:'date'})
  @IsOptional()
  updatedAt?: Date;
}
