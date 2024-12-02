import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { DecoratedEntity } from "./decorated.entity";
 

@Entity()
export class Product extends DecoratedEntity {
  

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

}