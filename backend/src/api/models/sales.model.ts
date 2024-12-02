import { IsInt, IsNotEmpty, IsPositive } from "class-validator";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { DecoratedEntity } from "./decorated.entity";

@Entity()
export class Sales extends DecoratedEntity {
 
  @Column({ type: "int" })
  @IsNotEmpty({ message: "Quantity sold is required" })
  @IsInt({ message: "Quantity sold must be an integer" })
  @IsPositive({ message: "Quantity sold must be a positive number" })
  quantitySold?: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  @IsNotEmpty({ message: "Total price is required" })
  @IsPositive({ message: "Total price must be a positive number" })
  totalPrice?: number;
 
}
