import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, type ObjectId, ObjectIdColumn, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { DecoratedEntity } from "./decorated.entity";
import { Product } from "./product.model";
import { User } from "./user.model";

@Entity()
export class Order extends DecoratedEntity {
  @ObjectIdColumn()
  id?: ObjectId;

  
  @Column({ type: "string" })
  @IsNotEmpty({ message: "Order number is required" })
  @IsString({ message: "Order number must be a string" })
  orderNumber?: string;

  @Column({ type: "string" })
  @IsNotEmpty({ message: "Product id is required" })
  @IsString({ message: "Product id must be a string" })
  product_id?: string;
  // @OneToMany(
  //   (type) => Product,
  //   (product) => product.order,
  // )
  // products?: Product[];


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

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
   createdAt?: Date;
  
  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
   updateAt?: Date;

  @Column({ default: false, type: "boolean" })
  @IsOptional()
  softDeleted?: boolean;
}
