import { Entity, ObjectIdColumn, Column, ObjectId } from "typeorm";
import { IsNotEmpty, IsString, IsInt, IsPositive, IsOptional } from "class-validator";
import { DecoratedEntity } from "./decorated.entity";

@Entity()
export class Sales extends DecoratedEntity {
  @ObjectIdColumn()
  id?: ObjectId;

  @Column()
  @IsNotEmpty({ message: "Quantity sold is required" })
  @IsInt({ message: "Quantity sold must be an integer" })
  @IsPositive({ message: "Quantity sold must be a positive number" })
  quantitySold?: number;

  @Column()
  @IsNotEmpty({ message: "Total price is required" })
  @IsPositive({ message: "Total price must be a positive number" })
  totalPrice?: number;

  @Column()
  @IsOptional()
  createdAt?: Date;

  @Column()
  @IsOptional()
  updatedAt?: Date;
}
