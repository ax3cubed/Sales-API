import { Entity, ObjectIdColumn, Column, ObjectId } from "typeorm";
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min, Max } from "class-validator";
import { DecoratedEntity } from "./decorated.entity";

@Entity()
export class User extends DecoratedEntity {
  @ObjectIdColumn()
  id?: ObjectId;

  @Column({ type:"string"})
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name must be a string" })
  name?: string;

  @Column({ type:"string"})
  @IsEmail({}, { message: "Email must be a valid email address" })
  email?: string;

  @Column({ type:"number"})
  @IsInt({ message: "Age must be an integer" })
  @Min(0, { message: "Age must be at least 0" })
  @Max(150, { message: "Age must be less than or equal to 150" })
  age?: number;

  @Column({type:'date'})
  @IsOptional()
  createdAt?: Date;

  @Column({type:'date'})
  @IsOptional()
  updatedAt?: Date;

  /**
   *
   */

 
}