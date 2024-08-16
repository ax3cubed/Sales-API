import { Entity, ObjectIdColumn, Column, BaseEntity, ObjectId } from "typeorm";
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min, Max } from "class-validator";

@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn()
  id?: ObjectId;

  @Column()
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name must be a string" })
  name?: string;

  @Column()
  @IsEmail({}, { message: "Email must be a valid email address" })
  email?: string;

  @Column()
  @IsInt({ message: "Age must be an integer" })
  @Min(0, { message: "Age must be at least 0" })
  @Max(150, { message: "Age must be less than or equal to 150" })
  age?: number;

  @Column()
  @IsOptional()
  createdAt?: Date;

  @Column()
  @IsOptional()
  updatedAt?: Date;
}