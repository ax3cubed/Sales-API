import { Entity, ObjectIdColumn, Column, ObjectId, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { IsNotEmpty, IsString, IsInt, IsOptional, IsPositive } from "class-validator";
import { Product } from "./product.model";
import { User } from "./user.model";
import { DecoratedEntity } from "./decorated.entity";

@Entity()
export class Order extends DecoratedEntity {
  @ObjectIdColumn()
  id?: ObjectId;

  @Column()
  @IsNotEmpty({ message: "Order number is required" })
  @IsString({ message: "Order number must be a string" })
  orderNumber?: string;

  @Column()
  @IsNotEmpty({ message: "Product id is required" })
  @IsString({ message: "Product id must be a string" })
  @OneToMany(type => Product, product => product.order)
  products?: Product[];

  @Column()
  @IsNotEmpty({ message: "Quantity is required" })
  @IsInt({ message: "Quantity must be an integer" })
  @IsPositive({ message: "Quantity must be a positive number" })
  quantity?: number;

  @OneToOne(type => User) @JoinColumn()
  user?: User;

  @Column()
  @IsNotEmpty({ message: "Price is required" })
  @IsPositive({ message: "Price must be a positive number" })
  price?: number;

  @Column()
  @IsOptional()
  createdAt?: Date;

  @Column()
  @IsOptional()
  updatedAt?: Date;
}
