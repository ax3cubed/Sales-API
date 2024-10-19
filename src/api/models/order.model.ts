import { Entity, ObjectIdColumn, Column, ObjectId, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { IsNotEmpty, IsString, IsInt, IsOptional, IsPositive } from "class-validator";
import { Product } from "./product.model";
import { User } from "./user.model";
import { DecoratedEntity } from "./decorated.entity";

@Entity()
export class Order extends DecoratedEntity {
  @ObjectIdColumn()
  id?: ObjectId;

  @Column({ type:"string"})
  @IsNotEmpty({ message: "Order number is required" })
  @IsString({ message: "Order number must be a string" })
  orderNumber?: string;

  @Column({ type:"array"})
  @IsNotEmpty({ message: "Product id is required" })
  @IsString({ message: "Product id must be a string" })
  @OneToMany(type => Product, product => product.order)
  products?: Product[];

  @Column({ type:"number"})
  @IsNotEmpty({ message: "Quantity is required" })
  @IsInt({ message: "Quantity must be an integer" })
  @IsPositive({ message: "Quantity must be a positive number" })
  quantity?: number;

  @OneToOne(type => User) @JoinColumn()
  user?: User;

  @Column({type:"number"})
  @IsNotEmpty({ message: "Total price is required" })
  @IsPositive({ message: "Total price must be a positive number" })
  totalPrice?: number;

  @Column({type:'date'})
  @IsOptional()
  createdAt?: Date;

  @Column({type:'date'})
  @IsOptional()
  updatedAt?: Date;

  @Column({ default: false , type:"boolean"})
  @IsOptional()
  softDeleted?: boolean;
}
