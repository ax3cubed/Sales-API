import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, type ObjectId, ObjectIdColumn, UpdateDateColumn } from "typeorm";
import { DecoratedEntity } from "./decorated.entity";
import { Order } from "./order.model"; // Adjust the import path as necessary

@Entity()
export class Product extends DecoratedEntity {
  @ObjectIdColumn()
  id?: ObjectId;

  @Column({ type: "string" })
  @IsNotEmpty({ message: "Product name is required" })
  @IsString({ message: "Product name must be a string" })
  name!: string;

  @Column({ type: "text" })
  @IsNotEmpty({ message: "Product description is required" })
  @IsString({ message: "Product description must be a string" })
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  @IsNotEmpty({ message: "Price is required" })
  @IsPositive({ message: "Price must be a positive number" })
  price!: number;

  @Column({ type: "int" })
  @IsNotEmpty({ message: "Stock quantity is required" })
  @IsInt({ message: "Stock quantity must be an integer" })
  @IsPositive({ message: "Stock quantity must be a positive number" })
  stockQuantity!: number;

  @ManyToOne(
    () => Order,
    (order) => order.products,
  )
  order?: Order;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
   createdAt?: Date;
  
  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
   updateAt?: Date;
}
