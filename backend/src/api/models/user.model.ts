import { IsEmail, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { DecoratedEntity } from "./decorated.entity";
import { ObjectId } from "mongodb";

@Entity()
export class User extends DecoratedEntity {
  

  @Column({ type: "string" })
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name must be a string" })
  name!: string;

  @Column({ type: "string" })
  @IsEmail({}, { message: "Email must be a valid email address" })
  email!: string;

  @Column({ type: "int" })
  @IsInt({ message: "Age must be an integer" })
  @Min(0, { message: "Age must be at least 0" })
  @Max(150, { message: "Age must be less than or equal to 150" })
  age?: number;

 
}
