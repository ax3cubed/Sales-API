import { Entity, ObjectIdColumn, Column, BaseEntity, ObjectId } from "typeorm";
import { IsNotEmpty, IsString, IsInt, IsOptional, IsPositive } from "class-validator";

@Entity()
export class Product extends BaseEntity {
  @ObjectIdColumn()
  id?: ObjectId;

  @Column()
  @IsNotEmpty({ message: "Product name is required" })
  @IsString({ message: "Product name must be a string" })
  name?: string;

  @Column()
  @IsNotEmpty({ message: "Product description is required" })
  @IsString({ message: "Product description must be a string" })
  description?: string;

  @Column()
  @IsNotEmpty({ message: "Price is required" })
  @IsPositive({ message: "Price must be a positive number" })
  price?: number;

  @Column()
  @IsNotEmpty({ message: "Stock quantity is required" })
  @IsInt({ message: "Stock quantity must be an integer" })
  @IsPositive({ message: "Stock quantity must be a positive number" })
  stockQuantity?: number;

  @Column()
  @IsOptional()
  createdAt?: Date;

  @Column()
  @IsOptional()
  updatedAt?: Date;
}
