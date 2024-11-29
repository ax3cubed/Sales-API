import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";
import { Column, CreateDateColumn, Entity, type ObjectId, ObjectIdColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { DecoratedEntity } from "./decorated.entity";

@Entity()
export class User extends DecoratedEntity {
 
  @ObjectIdColumn()
  _id?: ObjectId;

  @PrimaryColumn({type:'uuid', nullable: false})
  id?:string;

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

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
   createdAt?: Date;
  
  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
   updateAt?: Date;
}
